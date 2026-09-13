const fs = require('fs');

let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const target = `            </div>
          )}

          {job.unique_description_assamese && (`;

const replacement = `            </div>
          )}

          <div className="my-6 block lg:hidden">
            <EligibilityDetailButton job={job} />
          </div>

          {job.unique_description_assamese && (`;

if (content.includes(target) && !content.includes('<div className="my-6 block lg:hidden">')) {
    content = content.replace(target, replacement);
    fs.writeFileSync(pagePath, content);
    console.log("Patched jobs/[id]/page.tsx to add eligibility button in main column");
} else {
    // try a more resilient regex
    const replaced = content.replace(
        /(\s*<\/div>\s*<\/div>\s*)\}\)\s*\{job\.unique_description_assamese\s*&&\s*\(/,
        '$1)}\n\n          <div className="my-6 block lg:hidden">\n            <EligibilityDetailButton job={job} />\n          </div>\n\n          {job.unique_description_assamese && ('
    );
    if (replaced !== content) {
        fs.writeFileSync(pagePath, replaced);
        console.log("Patched via regex");
    } else {
        console.log("Failed to patch");
    }
}
