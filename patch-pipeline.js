const fs = require('fs');
let content = fs.readFileSync('src/lib/ingestion/pipeline.ts', 'utf8');

const targetStr = alidation_warnings: validation.warnings\n          });;
const targetStr2 = alidation_warnings: validation.warnings\r\n          });;

let replacement = alidation_warnings: validation.warnings
          }).select('id').single();

          if (qItem && finalStatus === 'NEW' && qualityScore >= 70 && (source.tier <= 2 || source.is_official || normalized.title.toLowerCase().includes('govt'))) {
            try {
              await approveQueueItemAction(qItem.id, 'NEW');
              console.log(\Auto-approved high-quality Govt job: \\);
            } catch (e) {
              console.error(\Auto-approve failed: \\);
            }
          };

let replaced = false;
if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    replaced = true;
} else if (content.includes(targetStr2)) {
    content = content.replace(targetStr2, replacement);
    replaced = true;
} else {
    // try a regex approach if exact match fails
    const regex = /validation_warnings:\s*validation\.warnings\s*\}\);/m;
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        replaced = true;
    }
}

if (replaced) {
    fs.writeFileSync('src/lib/ingestion/pipeline.ts', content);
    console.log("Successfully patched pipeline.ts");
} else {
    console.log("Could not find the target string to replace in pipeline.ts");
}