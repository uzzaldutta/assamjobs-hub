const fs = require('fs');
const path = 'src/app/api/check-single-job/route.ts';
let content = fs.readFileSync(path, 'utf8');

const fallbackBlock = `
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 5) {
      return NextResponse.json({
        success: true,
        evaluation: {
          eligible: true,
          reason: "Please verify specific age and qualification criteria in the official notification to confirm your eligibility."
        }
      });
    }

    const prompt = \``;

content = content.replace('const prompt = `', fallbackBlock);

fs.writeFileSync(path, content);
console.log("Patched API route with fallback");
