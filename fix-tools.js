const fs = require('fs');

const file = 'src/app/tools/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add shield icon import
content = content.replace(
  /Keyboard } from "lucide-react";/,
  'Keyboard, Shield } from "lucide-react";'
);

// Add the tool to the array
const toolInsert = { name: "Am I Eligible?", icon: <Shield className="text-emerald-500" size={24} />, link: "/tools/eligibility-checker", color: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },\n      { name: "Career Advisor";

content = content.replace('{ name: "Career Advisor"', toolInsert);

fs.writeFileSync(file, content, 'utf8');
