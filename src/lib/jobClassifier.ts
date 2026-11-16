/**
 * Intelligent Job Type Classifier
 * Automatically classifies jobs as 'GOVERNMENT', 'PRIVATE', or 'RAILWAY'
 * based on title, organization, and category tags.
 */

const GOVT_ORGANIZATION_KEYWORDS = [
  'apsc', 'slprb', 'adre', 'assam police', 'upsc', 'ssc', 'drdo', 'isro',
  'ongc', 'iocl', 'oil india', 'nrl', 'powergrid', 'bel', 'bhel', 'ntpc',
  'gail', 'coal india', 'state bank of india', 'sbi', 'bank of baroda',
  'indian bank', 'punjab national bank', 'pnb', 'canara bank', 'union bank',
  'central bank of india', 'ibps', 'rbi', 'nabard', 'exim bank', 'export-import bank',
  'supreme court', 'high court', 'district & sessions', 'chief judicial magistrate',
  'assam rifles', 'crpf', 'bsf', 'cisf', 'itbp', 'ssb', 'indian air force', 'indian army', 'indian navy',
  'directorate of', 'commissionerate of', 'department of', 'govt of assam', 'government of assam',
  'samagra shiksha', 'nhm', 'national health mission', 'dhs', 'p&rd', 'pwd', 'btc',
  'bodoland territorial', 'gauhati university', 'dibrugarh university', 'assam university',
  'tezpur university', 'cotton university', 'bhattadev university', 'kokrajhar university',
  'gurucharan university', 'atomic energy', 'aees', 'central silk board', 'central warehousing',
  'food safety assam', 'cmaaa', 'dr b borooah cancer institute', 'esic', 'epfo', 'aiims',
  'iit guwahati', 'iiit', 'nita', 'nit silchar', 'nedfi', 'kendriya vidyalaya', 'jawahar navodaya', 'jnv'
];

const PRIVATE_SIGNALS = [
  'school', 'academy', 'vidyalaya', 'public school', 'senior secondary',
  'pvt ltd', 'private limited', 'private job', 'private ltd', 'llp',
  'hospital', 'clinic', 'medishop', 'nursing home', 'diagnostic',
  'dealership', 'dealer', 'showroom', 'motors', 'auto commercial', 'bimal auto',
  'labs', 'technologies', 'solutions', 'enterprises', 'hotel', 'resort', 'inn',
  'news', 'prag news', 'dy365', 'media', 'trust', 'society', 'foundation',
  'microfinance', 'sales executive', 'dse', 'full stack', 'developer @',
  'storekeeper @', 'sales manager', 'telecaller', 'front desk', 'receptionist'
];

export function classifyJobType(
  title: string,
  organization?: string | null,
  categories?: string[]
): 'GOVERNMENT' | 'PRIVATE' | 'RAILWAY' {
  const titleLow = (title || '').toLowerCase();
  const orgLow = (organization || '').toLowerCase();
  const catsLow = (categories || []).map(c => c.toLowerCase());
  const combined = `${titleLow} ${orgLow} ${catsLow.join(' ')}`;

  // 1. Explicit Railway Check
  if (
    combined.includes('railway') ||
    combined.includes('rrb') ||
    combined.includes('rrc') ||
    combined.includes('irctc') ||
    combined.includes('ircon') ||
    combined.includes('rites')
  ) {
    return 'RAILWAY';
  }

  // 2. Check if explicitly tagged as Private by Source
  if (
    catsLow.some(c => c.includes('private') || c.includes('company') || c.includes('private jobs')) ||
    titleLow.includes('[private]') ||
    titleLow.includes('(private)') ||
    titleLow.includes('private job')
  ) {
    return 'PRIVATE';
  }

  // 3. Check for Recognized Government / PSU / Central Entities
  for (const gk of GOVT_ORGANIZATION_KEYWORDS) {
    if (combined.includes(gk)) {
      return 'GOVERNMENT';
    }
  }

  // 4. Check for Private Sector Signals (Schools, Hospitals, Dealerships, Hotels, Labs, etc.)
  for (const ps of PRIVATE_SIGNALS) {
    if (titleLow.includes(ps) || orgLow.includes(ps)) {
      return 'PRIVATE';
    }
  }

  // Default to GOVERNMENT if no private indicators are found
  return 'GOVERNMENT';
}
