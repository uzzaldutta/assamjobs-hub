const fs = require('fs');

let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const target = '{/* Verification / Source Footer */}';
if (content.includes(target) && !content.includes('EligibilityDetailButton job={job}')) {
    content = content.replace(
        '{/* Verification / Source Footer */}',
        '<div className="px-4 pb-4">\n                <EligibilityDetailButton job={job} />\n              </div>\n              {/* Verification / Source Footer */}'
    );
    fs.writeFileSync(pagePath, content);
    console.log("Patched detail page HTML");
}
