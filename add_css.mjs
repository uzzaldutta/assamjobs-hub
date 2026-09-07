import fs from 'fs';

let css = fs.readFileSync('src/app/globals.css', 'utf8');

const scrollCss = `
/* Custom sleek scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: #334155;
}
.dark .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
`;

if (!css.includes('.custom-scroll')) {
  css += '\n' + scrollCss;
  fs.writeFileSync('src/app/globals.css', css);
  console.log("Added custom-scroll to globals.css");
} else {
  console.log("custom-scroll already exists");
}
