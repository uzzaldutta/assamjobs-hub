const fs = require('fs');

let pagePath = 'src/app/api/admin/edit-job/route.ts';
let content = fs.readFileSync(pagePath, 'utf8');

const oldStr = `    // Surgical ISR Cache Invalidation
    revalidatePath('/jobs');
    revalidatePath('/jobs/[id]', 'page');
    revalidatePath('/');`;

const newStr = `    // Surgical ISR Cache Invalidation
    revalidatePath('/jobs');
    revalidatePath(\`/jobs/\${id}\`);
    revalidatePath('/');`;

if (content.includes("revalidatePath('/jobs/[id]', 'page');")) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched edit-job");
} else {
    console.log("edit-job target not found");
}
