const fs = require('fs');

let p = 'src/app/page.tsx';
let c = fs.readFileSync(p, 'utf8');

if (!c.includes('ClassicUpdatesBoard')) {
  // Import
  c = c.replace('import HeroSection from "@/components/HeroSection";', 'import HeroSection from "@/components/HeroSection";\nimport ClassicUpdatesBoard from "@/components/ClassicUpdatesBoard";');

  // Insert before the <SubscribeForm /> or after <LatestUpdatesScroller />
  const target = `<LatestUpdatesScroller feedItems={allRecent} />`;
  const repl = `<LatestUpdatesScroller feedItems={allRecent} />\n\n        {/* CLASSIC 3-COLUMN BOARD */}\n        <ClassicUpdatesBoard />`;
  
  c = c.replace(target, repl);
  fs.writeFileSync(p, c);
  console.log("Patched page.tsx with ClassicUpdatesBoard");
} else {
  console.log("Already patched");
}
