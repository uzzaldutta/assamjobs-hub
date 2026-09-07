import { GenericAssamGovAdapter } from './src/lib/ingestion/adapters/GenericAssamGovAdapter';

async function testSource(name: string, url: string) {
    console.log(`\n================ Testing ${name} ================`);
    const adapter = new GenericAssamGovAdapter({
        id: '123',
        source_name: name,
        base_url: url,
        adapter_name: 'GenericAssamGovAdapter',
        feed_type: name === 'NHM Assam' ? 'MULTIPLE' : 'JOB',
        is_official: true,
        tier: 1,
        is_active: true
    } as any);

    try {
        const rawItems = await adapter.discover();
        console.log(`Discovered ${rawItems.length} items for ${name}.`);
        
        let count = 0;
        for (const raw of rawItems) {
            if (count >= 15) break;
            const extracted = await adapter.extract(raw);
            const normalized = await adapter.normalize(extracted);
            
            console.log(`\n--- Item ${count + 1} ---`);
            const parsed = JSON.parse(raw.html || '{}');
            console.log(`Raw Title: ${parsed.title}`);
            console.log(`Normalized Title: ${normalized.title}`);
            console.log(`Content Type: ${normalized.contentType}`);
            console.log(`Source URL: ${normalized.sourceUrl}`);
            console.log(`Notification URL: ${normalized.notificationUrl}`);
            count++;
        }
    } catch (err: any) {
        console.error(`Error testing ${name}:`, err.message);
    }
}

async function run() {
    await testSource('Employment Assam', 'https://employment.assam.gov.in');
    await testSource('NHM Assam', 'https://nhm.assam.gov.in');
}

run();
