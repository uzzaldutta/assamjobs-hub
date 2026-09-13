const fs = require('fs');

function addAdapter(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('JobAssamHubAdapter')) {
        content = content.replace(
            "import { JobAssamAdapter } from '@/lib/ingestion/adapters/JobAssamAdapter';",
            "import { JobAssamAdapter } from '@/lib/ingestion/adapters/JobAssamAdapter';\nimport { JobAssamHubAdapter } from '@/lib/ingestion/adapters/JobAssamHubAdapter';"
        );
        
        content = content.replace(
            "else if (adapterName === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source",
            "else if (adapterName === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);\n    else if (adapterName === 'JobAssamHubAdapter') adapterInstance = new JobAssamHubAdapter(source"
        );
        
        content = content.replace(
            "else if (source.adapter_name === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);",
            "else if (source.adapter_name === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);\n        else if (source.adapter_name === 'JobAssamHubAdapter') adapterInstance = new JobAssamHubAdapter(source);"
        );
        
        fs.writeFileSync(filePath, content);
    }
}

addAdapter('src/app/api/admin/test-source/route.ts');
addAdapter('src/app/api/cron/ingestion/route.ts');
console.log("Registered adapter!");
