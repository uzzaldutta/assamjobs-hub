const fs = require('fs');
let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'className="max-h-[380px] md:max-h-[480px] overflow-y-auto custom-thin-scroll', 
  'className="max-h-[380px] md:max-h-[480px] overflow-y-auto overflow-x-hidden w-full min-w-0 custom-thin-scroll'
);
c = c.replace(
  'className="max-h-[380px] md:max-h-[480px] overflow-y-auto custom-thin-scroll', 
  'className="max-h-[380px] md:max-h-[480px] overflow-y-auto overflow-x-hidden w-full min-w-0 custom-thin-scroll'
);

c = c.replace(/<ul className="flex flex-col px-3">/g, '<ul className="flex flex-col px-3 w-full min-w-0">');

c = c.replace(/className="block w-full break-words whitespace-normal/g, 'style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} className="block w-full whitespace-normal');

fs.writeFileSync(p, c);
console.log("Brute force applied");
