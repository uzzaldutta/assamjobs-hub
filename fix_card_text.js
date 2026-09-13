const fs = require('fs');

function fixCard() {
    let content = fs.readFileSync('src/components/feeds/ScholarshipCard.tsx', 'utf8');
    content = content.replace(
        "{scholarship.application_deadline ? new Date(scholarship.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : \"Not Specified\"}",
        "{deadline ? new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : \"Not Specified\"}"
    );
    fs.writeFileSync('src/components/feeds/ScholarshipCard.tsx', content);
    console.log("Fixed card display text.");
}
fixCard();
