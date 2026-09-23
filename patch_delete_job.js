const fs = require('fs');

let pagePath = 'src/app/api/admin/delete-job/route.ts';
let content = fs.readFileSync(pagePath, 'utf8');

const oldStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/jobs/[id]', 'page');`;

const newStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath(\`/jobs/\${id}\`);`;

if (content.includes("revalidatePath('/jobs/[id]', 'page');")) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched delete-job");
} else {
    console.log("delete-job target not found");
}
