import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { profile, job } = await req.json();

    if (!profile || !job) {
      return NextResponse.json({ success: false, error: 'Missing profile or job data' }, { status: 400 });
    }

    const candidateAge = parseInt(profile.age);
    const candidateQual = (profile.qualification || "").toLowerCase();
    const candidateCat = profile.category || "General (UR)";
    
    const jobQual = (job.qualification || "").toLowerCase();
    const jobAgeLimit = (job.age_limit || "").toLowerCase();

    let eligible = true;
    let reasons: string[] = [];

    // 1. AGE CHECK
    if (!isNaN(candidateAge) && jobAgeLimit) {
      // Find all numbers in the age limit string
      const numbers = jobAgeLimit.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        let maxAge = Math.max(...numbers.map(Number));
        
        // Usually, 18 is minimum, so if maxAge is 18, it might mean "Minimum 18" and no max specified.
        // Or if they say "18 to 40", max is 40.
        // Let's assume the highest number under 65 is the max age limit.
        const validMaxAges = numbers.map(Number).filter((n: number) => n > 20 && n <= 65);
        if (validMaxAges.length > 0) {
           maxAge = Math.max(...validMaxAges);
           
           // Apply Assam govt age relaxation rules
           if (candidateCat.includes("OBC") || candidateCat.includes("MOBC")) {
               maxAge += 3;
           } else if (candidateCat.includes("SC") || candidateCat.includes("ST")) {
               maxAge += 5;
           } else if (candidateCat.includes("PWD") || candidateCat.includes("Persons with Disabilities")) {
               maxAge += 10;
           }

           if (candidateAge > maxAge) {
               eligible = false;
               reasons.push(`Your age (${candidateAge}) exceeds the maximum limit of ${maxAge} years (including category relaxation).`);
           }
        }
      }
    }

    // 2. QUALIFICATION CHECK (Basic Heuristic)
    // Hierarchy: 8th < 10th < 12th < ITI/Diploma < Degree < Master
    const qualLevels = [
        { level: 1, keywords: ["8th", "viii"] },
        { level: 2, keywords: ["10th", "matric", "hslc", "high school"] },
        { level: 3, keywords: ["12th", "hs", "higher secondary", "10+2", "intermediate"] },
        { level: 4, keywords: ["iti", "diploma"] },
        { level: 5, keywords: ["degree", "graduation", "bachelor", "b.a", "b.sc", "b.com", "b.e", "b.tech"] },
        { level: 6, keywords: ["master", "post graduate", "m.a", "m.sc", "m.com", "m.tech", "mba", "mca"] }
    ];

    function getLevel(text: string) {
        let maxLevel = 0;
        for (const q of qualLevels) {
            for (const kw of q.keywords) {
                if (text.includes(kw) && q.level > maxLevel) {
                    maxLevel = q.level;
                }
            }
        }
        return maxLevel;
    }

    if (jobQual && candidateQual) {
        const requiredLevel = getLevel(jobQual);
        const candidateLevel = getLevel(candidateQual);

        if (requiredLevel > 0 && candidateLevel > 0 && candidateLevel < requiredLevel) {
            eligible = false;
            // Find what they required
            const reqName = qualLevels.find(q => q.level === requiredLevel)?.keywords[0] || "higher qualification";
            reasons.push(`This job appears to require a ${reqName.toUpperCase()} or equivalent, which is higher than your current profile.`);
        }
    }

    let finalReason = "Based on the provided details, you appear to be eligible! Please verify specific criteria in the official notification.";
    if (!eligible) {
        finalReason = reasons.join(" ");
    } else if (reasons.length > 0) {
        finalReason = "You appear eligible, but note: " + reasons.join(" ") + " Verify with the official notification.";
    } else if (!jobAgeLimit && !jobQual) {
        finalReason = "We couldn't find explicit age or qualification data for this job. You might be eligible, but please read the official notification carefully.";
    }

    return NextResponse.json({ 
        success: true, 
        evaluation: {
            eligible: eligible,
            reason: finalReason
        } 
    });

  } catch (error: any) {
    console.error("Rule-based eligibility check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
