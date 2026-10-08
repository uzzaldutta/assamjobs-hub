const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-pro' });
        const result = await model.generateContent('Say hi');
        console.log('SUCCESS:', result.response.text());
    } catch(e) {
        console.log('ERROR:', e.message);
    }
}
test();