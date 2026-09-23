const fs = require('fs');
let p = 'src/app/search/page.tsx';
if (fs.existsSync(p)) {
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('robots:')) {
    c = c.replace(
      "title: 'Search',",
      "title: 'Search',\n  robots: { index: false, follow: true },"
    );
    fs.writeFileSync(p, c);
    console.log("Updated search page metadata");
  }
}
