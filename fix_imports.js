const fs = require('fs');
for (let p of ['src/app/mock-tests/[testId]/page.tsx', 'src/app/study-materials/[materialId]/page.tsx']) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace("import ReactMarkdown from 'react-markdown';", "import ReactMarkdown from 'react-markdown';\nimport remarkGfm from 'remark-gfm';");
    fs.writeFileSync(p, content);
}
