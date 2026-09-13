const { evaluateJobAssamPromotionalContent } = require('./src/lib/ingestion/jobassam-firewall.js'); // Assuming it's compiled or I'll just write it.

function evaluate(payload) {
    const title = (payload.title || "").toLowerCase();
    const org = (payload.organization || "").toLowerCase();
    const hasOrg = org !== "unknown" && org.length > 2;
    const hasVacancy = !!payload.vacancy;
    const hasDeadline = !!payload.applicationEnd;
    
    let genuineScore = 0;
    const genuineKeywords = [
        "recruitment", "posts", "vacancies", "assistant", "manager", "department", 
        "commission", "police", "university", "apprentice", "apply online"
    ];
    for (const kw of genuineKeywords) {
        if (title.includes(kw)) genuineScore += 2;
    }
    if (hasOrg) genuineScore += 3;
    if (hasVacancy) genuineScore += 3;
    if (hasDeadline) genuineScore += 2;
    if (payload.applyUrl) genuineScore += 2;

    const highPromoExact = [
        "bio-data maker", "resume maker", "resume builder", "cover-letter generator"
    ];

    for (const kw of highPromoExact) {
        if (title.includes(kw) && genuineScore < 5) return "HIGH";
    }

    let promoScore = 0;
    const medPromoKeywords = [
        "maker", "builder", "generator", "converter", "calculator", "tool", "utility", 
        "subscription", "service", "app", "telegram", "whatsapp", "join our"
    ];
    
    for (const kw of medPromoKeywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(title)) promoScore += 2;
    }

    if (!hasOrg && !hasVacancy && !hasDeadline && genuineScore < 2) {
        return "HIGH"; 
    }

    if (promoScore >= 4 && genuineScore < 4) return "HIGH";
    if (promoScore >= 2 && genuineScore < 6) return "MEDIUM";
    
    if (!hasOrg && !hasVacancy && genuineScore < 4) return "MEDIUM";

    return "LOW";
}

const spamScore = evaluate({
    title: "JobAssam Free Online Bio-Data Maker for Job Seekers",
    organization: "Private Company",
    vacancy: null,
    applicationEnd: null,
    applyUrl: "https://jobassam.in/bio-data-maker/"
});

console.log(spamScore);
