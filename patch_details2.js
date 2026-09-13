const fs = require('fs');

let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// The file ends roughly like this:
// <p className="text-xs text-slate-500">Data provided for informational purposes.</p>
//             </div>
//           </div>
//           
//         </div>
//       </div>
//     </div>
//   );
// }

// Replace the closing of the sidebar box and the sidebar itself:
const replacedContent = content.replace(
    /(<p className="text-xs text-slate-500">Data provided for informational purposes\.<\/p>\s*<\/div>\s*<\/div>)/,
    '$1\n\n          <RecentlyViewed currentJob={job} />'
);

if (replacedContent !== content) {
    fs.writeFileSync(pagePath, replacedContent);
    console.log("Regex patch successful");
} else {
    console.log("Regex patch failed");
}
