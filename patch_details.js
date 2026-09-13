const fs = require('fs');

let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add import RecentlyViewed
if (!content.includes('import RecentlyViewed')) {
    content = content.replace(
        'import EligibilityDetailButton from "@/components/EligibilityDetailButton";',
        'import EligibilityDetailButton from "@/components/EligibilityDetailButton";\nimport RecentlyViewed from "@/components/RecentlyViewed";'
    );
}

// 2. Inject <RecentlyViewed currentJob={job} /> into the sidebar
const target = '<p className="text-xs text-slate-500">Data provided for informational purposes.</p>\n            </div>\n          </div>\n          \n        </div>';
if (content.includes(target) && !content.includes('<RecentlyViewed currentJob={job} />')) {
    content = content.replace(
        target,
        '<p className="text-xs text-slate-500">Data provided for informational purposes.</p>\n            </div>\n          </div>\n\n          <RecentlyViewed currentJob={job} />\n          \n        </div>'
    );
}

fs.writeFileSync(pagePath, content);
console.log("Patched jobs/[id]/page.tsx");
