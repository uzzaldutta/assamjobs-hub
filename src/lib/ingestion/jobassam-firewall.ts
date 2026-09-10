export function evaluateJobAssamPromotionalContent(payload: any, rawPayload: any): "HIGH" | "MEDIUM" | "LOW" {
    const title = (payload.title || "").toLowerCase();
    const org = (payload.organization || "").toLowerCase();
    const hasOrg = org !== "unknown" && org.length > 2;
    const hasVacancy = !!payload.vacancy;
    const hasDeadline = !!payload.applicationEnd;
    
    // Some basic job signals
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

    // Direct High-Confidence Reject Patterns (Must not hit if it's a real job)
    const highPromoExact = [
        "bio-data maker", "resume maker", "resume builder", "cover-letter generator", 
        "application generator", "pdf tools", "document tools", "document converter", 
        "salary calculator", "age calculator", "eligibility calculator", "career calculator", 
        "ai tools", "ai resume", "ai interview", "interview preparation tools", "job-search tools", 
        "job-alert", "notification subscription", "whatsapp promotion", "telegram promotion", 
        "mobile apps", "android app", "ios app", "website utilities", "online utilities", 
        "career services", "career counselling", "coaching promotion", "course promotion", 
        "training promotion", "advertisement services", "recruitment marketing", "paid services", 
        "membership services", "subscription services", "generic informational", "useful tools", 
        "free tools"
    ];

    for (const kw of highPromoExact) {
        if (title.includes(kw) && genuineScore < 5) return "HIGH";
    }

    // Secondary Promotional keywords
    let promoScore = 0;
    const medPromoKeywords = [
        "maker", "builder", "generator", "converter", "calculator", "tool", "utility", 
        "subscription", "service", "app", "telegram", "whatsapp", "join our"
    ];
    
    for (const kw of medPromoKeywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(title)) promoScore += 2;
    }

    // Generic articles with no actual vacancy
    if (!hasOrg && !hasVacancy && !hasDeadline && genuineScore < 2) {
        return "HIGH"; // Lacks everything that makes it a job
    }

    if (promoScore >= 4 && genuineScore < 4) return "HIGH";
    if (promoScore >= 2 && genuineScore < 6) return "MEDIUM";
    
    // Lacks most fields but not strictly hitting promo words
    if (!hasOrg && !hasVacancy && genuineScore < 4) return "MEDIUM";

    return "LOW";
}
