const fs = require('fs');

let pagePath = 'src/app/api/admin/add-job/route.ts';
let content = fs.readFileSync(pagePath, 'utf8');

const oldStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/jobs/[id]', 'page');`;

const newStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath(\`/jobs/\${newEntry.id}\`);`;

if (content.includes("revalidatePath('/jobs/[id]', 'page');")) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched add-job");
} else {
    console.log("add-job target not found");
}
