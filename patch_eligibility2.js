const fs = require('fs');
let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const targetStr = `              </div>\r\n            </div>\r\n          )}\r\n\r\n          {job.unique_description_assamese && (`.replace(/\r/g, '');

const replStr = `              </div>\n            </div>\n          )}\n\n          <div className="my-6 lg:hidden">\n            <EligibilityDetailButton job={job} />\n          </div>\n\n          {job.unique_description_assamese && (`;

let normalizedContent = content.replace(/\r/g, '');
if (normalizedContent.includes(targetStr)) {
    content = normalizedContent.replace(targetStr, replStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched successfully!");
} else {
    console.log("Could not find target string.");
}
