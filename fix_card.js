const fs = require('fs');

function fixCard() {
    let content = fs.readFileSync('src/components/feeds/ScholarshipCard.tsx', 'utf8');
    content = content.replace(
        "if (scholarship.application_deadline) {",
        "const deadline = scholarship.application_deadline || scholarship.last_date;\n  if (deadline) {"
    );
    content = content.replace(
        "const end = new Date(scholarship.application_deadline);",
        "const end = new Date(deadline);"
    );
    content = content.replace(
        "const formattedDate = new Date(scholarship.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });",
        "const formattedDate = new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });"
    );
    fs.writeFileSync('src/components/feeds/ScholarshipCard.tsx', content);
    console.log("Fixed card.");
}
fixCard();
