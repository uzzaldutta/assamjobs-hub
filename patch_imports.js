const fs = require('fs');

function patchLucide(path) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
        if (!p1.includes('Bookmark')) {
            return `import {${p1}, Bookmark} from "lucide-react";`;
        }
        return match;
    });
    fs.writeFileSync(path, content);
}

patchLucide('src/components/DesktopNav.tsx');
patchLucide('src/components/MobileBottomNav.tsx');
console.log("Patched imports");
