import crypto from 'crypto';

interface IndexingNotificationResult {
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
  googleIndexingApi: boolean;
  sitemapPing: boolean;
  message: string;
}

/**
 * Generate a signed JWT for Google Service Account authentication
 */
function createGoogleJwt(clientEmail: string, privateKeyPem: string): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const base64UrlEncode = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(header);
  const encodedClaim = base64UrlEncode(claimSet);
  const signingInput = `${encodedHeader}.${encodedClaim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  const signature = signer.sign(privateKeyPem, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${signature}`;
}

/**
 * Request an access token from Google OAuth2 using JWT
 */
async function getGoogleAccessToken(clientEmail: string, privateKeyPem: string): Promise<string | null> {
  try {
    const jwt = createGoogleJwt(clientEmail, privateKeyPem);
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[GoogleIndexing] OAuth2 token exchange failed:', errText);
      return null;
    }

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.warn('[GoogleIndexing] Error obtaining Google access token:', err);
    return null;
  }
}

/**
 * Ping Google and Bing sitemap services to request an immediate recrawl
 */
export async function pingSearchEngineSitemaps(sitemapUrl = 'https://assamjobshub.com/sitemap.xml'): Promise<boolean> {
  try {
    const googlePing = fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: { 'User-Agent': 'AssamJobsHub-CrawlerBot/1.0' }
    }).catch(() => null);

    const bingPing = fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: { 'User-Agent': 'AssamJobsHub-CrawlerBot/1.0' }
    }).catch(() => null);

    await Promise.allSettled([googlePing, bingPing]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Notify Google of a new or updated JobPosting URL for rapid indexing (10-30 min)
 */
export async function notifyGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<IndexingNotificationResult> {
  const result: IndexingNotificationResult = {
    url,
    type,
    googleIndexingApi: false,
    sitemapPing: false,
    message: ''
  };

  // 1. Instant search engine sitemap ping
  result.sitemapPing = await pingSearchEngineSitemaps();

  // 2. Direct Google Indexing API
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    try {
      // Clean private key formatting (convert literal \n to actual newlines)
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
      if (accessToken) {
        const indexRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            url,
            type
          })
        });

        if (indexRes.ok) {
          result.googleIndexingApi = true;
          result.message = 'Notified Google Indexing API successfully (~10-30m crawl scheduled)';
          return result;
        } else {
          const errData = await indexRes.text();
          result.message = `Google Indexing API responded with error: ${errData}`;
        }
      }
    } catch (apiErr: any) {
      result.message = `Google Indexing API request failed: ${apiErr.message}`;
    }
  } else {
    result.message = 'Sitemap pinged. (To enable instant 15-min indexing, configure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).';
  }

  return result;
}
