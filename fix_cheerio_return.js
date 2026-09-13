const fs = require('fs');

let adapterPath = 'src/lib/ingestion/adapters/JobAssamHubAdapter.ts';
let adapterContent = fs.readFileSync(adapterPath, 'utf8');
adapterContent = adapterContent.replace('$(el).find(\'th\').each((j, th) => headers.push($(th).text().trim()));', '$(el).find(\'th\').each((j, th) => { headers.push($(th).text().trim()); });');
fs.writeFileSync(adapterPath, adapterContent);
console.log("Fixed cheerio each return type");
