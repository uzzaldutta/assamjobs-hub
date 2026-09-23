const fs = require('fs');

let pagePath = 'src/app/api/admin/spam-control/route.ts';
let content = fs.readFileSync(pagePath, 'utf8');

const oldStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/jobs/[id]', 'page');`;

const newStr = `    revalidatePath('/');
    revalidatePath('/jobs');
    // We already invalidated specific IDs in the loop above`;

const target1 = `      if (deleteError) throw deleteError;
      deletedCount = idsToDelete.length;
    }`;

const replace1 = `      if (deleteError) throw deleteError;
      deletedCount = idsToDelete.length;
      
      idsToDelete.forEach(id => revalidatePath(\`/jobs/\${id}\`));
    }`;

if (content.includes("revalidatePath('/jobs/[id]', 'page');")) {
    content = content.replace(target1, replace1);
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched spam-control");
} else {
    console.log("spam-control target not found");
}
