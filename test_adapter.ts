import { JobAssamHubAdapter } from "./src/lib/ingestion/adapters/JobAssamHubAdapter";

async function run() {
    const adapter = new JobAssamHubAdapter({
        source_name: 'Job Assam Hub',
        base_url: 'https://jobassamhub.com'
    } as any);

    const items = await adapter.discover();
    console.log(`Discovered ${items.length} items`);
    if(items.length > 0) {
        let content = await adapter.fetch(items[0]);
        let extracted = await adapter.extract(content);
        let normalized = await adapter.normalize(extracted);
        console.log("Normalized:", normalized);
    }
}
run();
