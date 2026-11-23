import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin as supabase } from '@/lib/supabase';

interface BookItem {
  title: string;
  type: string;
  exam_slug?: string;
  author: string;
  year: number;
  description: string;
  content?: string;
  cover_url?: string;
  file_url?: string;
  tags: string[];
  metadata: {
    book_category: 'FREE_TEXTBOOK' | 'AJH_EBOOK' | 'RECOMMENDED_BUY';
    language: string;
    pages: number;
    publisher?: string;
    buy_url?: string;
    edition?: string;
    highlight?: string;
    is_full_book?: boolean;
    rating?: number;
    table_of_contents?: string;
  };
}

const books: BookItem[] = [
  // --- Category 1: Free Official State & National Textbooks ---
  {
    title: "SCERT Assam Class 10 Social Science & Assam History",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "State Council of Educational Research and Training (SCERT), Assam",
    year: 2026,
    description: "Official Class 10 textbook covering Partition of Bengal, Swadeshi Movement, Mahatma Gandhi & National Freedom Movement in Assam, and Cultural Heritage of Assam. Essential foundation reading for ADRE Grade III & IV and Assam Police examinations.",
    content: "### Complete Table of Contents\n\n1. **History:**\n   - Chapter 1: Partition of Bengal and Swadeshi Movement\n   - Chapter 2: Rise of Gandhi and the Freedom Struggle in Assam\n   - Chapter 3: Anti-British Rising and Peasant Movements in Assam\n   - Chapter 4: Cultural Heritage of India and Northeast Region\n2. **Geography:**\n   - Economic Geography of Assam: Tea, Oil, Coal, Agriculture\n   - Environment, Biodiversity and River Systems of Brahmaputra & Barak\n3. **Political Science & Economics:**\n   - Indian Democracy and Panchayati Raj in Assam\n   - Money and Financial Banking Institutions",
    file_url: "https://scert.assam.gov.in/sites/default/files/swf_utility_folder/departments/scert_medhassu_in_oid_3/portlet/level_2/class_x_social_science_english_medium.pdf",
    cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    tags: ["scert", "free-book", "adre", "assam-police", "history", "social-science"],
    metadata: {
      book_category: "FREE_TEXTBOOK",
      language: "Assamese / English Medium",
      pages: 284,
      publisher: "Assam State Textbook Production & Publication Corp",
      is_full_book: true,
      highlight: "Official Government Board Textbook - 100% Free Complete Book",
      rating: 4.9
    }
  },
  {
    title: "SCERT Assam Class 9 History & Geography Textbook",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "SCERT Assam",
    year: 2026,
    description: "Complete Class 9 Social Studies textbook explaining the advent of Europeans in India, Burmese invasions of Assam (Maanar Aakraman), Treaty of Yandabo (1826), and Assam's physiographic divisions.",
    content: "### Major Chapters Included\n\n- **History Section:**\n  - Advent of the Europeans into Assam & India\n  - Burmese Invasions of Assam (1817-1826) and Fall of Ahom Kingdom\n  - Beginning of British Rule and Administrative Changes in Assam\n- **Geography Section:**\n  - Weather and Climate Patterns of Assam\n  - Natural Vegetation and Forest Resources of Assam",
    file_url: "https://scert.assam.gov.in/sites/default/files/swf_utility_folder/departments/scert_medhassu_in_oid_3/portlet/level_2/class_ix_social_science_english.pdf",
    cover_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80",
    tags: ["scert", "free-book", "adre", "geography", "history"],
    metadata: {
      book_category: "FREE_TEXTBOOK",
      language: "Assamese / English",
      pages: 240,
      publisher: "SCERT Assam",
      is_full_book: true,
      highlight: "Covers Treaty of Yandabo & Ahom Decline - Crucial for ADRE Exams",
      rating: 4.8
    }
  },
  {
    title: "NCERT Class 11 Indian Constitution at Work (Polity Foundation)",
    type: "BOOK",
    exam_slug: "apsc-cce",
    author: "NCERT New Delhi",
    year: 2026,
    description: "The gold standard conceptual foundation book for Indian Constitution, Fundamental Rights, Directive Principles, Parliamentary system, Judiciary, and Federalism. Recommended by all APSC & UPSC toppers.",
    content: "### Syllabus Coverage\n\n- Constitution: Why and How?\n- Rights in the Indian Constitution\n- Election and Representation\n- Executive, Legislature & Judiciary\n- Federalism and Local Governments (Panchayati Raj 73rd & 74th Amendments)\n- Constitution as a Living Document",
    file_url: "https://ncert.nic.in/textbook/pdf/keps2dd.zip",
    cover_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    tags: ["ncert", "polity", "apsc", "assam-police-si", "free-book"],
    metadata: {
      book_category: "FREE_TEXTBOOK",
      language: "English / Hindi",
      pages: 236,
      publisher: "National Council of Educational Research and Training",
      is_full_book: true,
      highlight: "Must-Read for APSC CCE Prelims GS Paper I & Assam Police SI",
      rating: 5.0
    }
  },

  // --- Category 2: AssamJobs Hub Exclusive E-Books & Booklets ---
  {
    title: "Assam History & Heritage Complete Revision Booklet (AJH Exclusive)",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "AssamJobs Hub Academic Cell",
    year: 2026,
    description: "Complete, condensed 60-page fast-track revision booklet crafted specifically for ADRE 2.0 & Assam Police aspirants. Covers Ahom dynasty chronologies, important kings & administrative titles, British annexation treaties, Satra cultural institutions, and freedom fighters.",
    content: "### Booklet Highlights\n\n- **Part 1: Ancient Assam (Kamrupa)** - Varman, Salastambha, Pala dynasties.\n- **Part 2: Medieval Assam** - Sukapha's arrival (1228), Suhungmung, Mir Jumla's invasion (1662), Battle of Saraighat (1671, Lachit Borphukan), Battle of Itakhuli (1682), Rudra Singha's golden era.\n- **Part 3: Burmese Invasion & Yandabo Treaty (1826)** - Step-by-step chronology.\n- **Part 4: Modern Assam & Freedom Movement** - Gomdhar Konwar, Maniram Dewan, Phulaguri Dhawa (1861), Patharughat peasant massacre (1894), Kanaklata Barua, Bhogeswari Phukanani.\n- **Part 5: Quick Revision Flash Tables** - All Ahom administrative titles (Barbarua, Borphukan, Gohains) and architectural monuments.",
    file_url: "https://assamjobshub.com/study-materials",
    cover_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
    tags: ["ajh-exclusive", "free-book", "adre", "assam-history", "quick-revision"],
    metadata: {
      book_category: "AJH_EBOOK",
      language: "Bilingual (Assamese & English)",
      pages: 64,
      publisher: "AssamJobs Hub Learning Division",
      is_full_book: true,
      highlight: "Compiled by Toppers & Educators - Free to Read Online",
      rating: 4.9
    }
  },
  {
    title: "ADRE 2.0 500+ High-Yield Solved GK & Math Questions Booklet",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "AssamJobs Hub Prep Team",
    year: 2026,
    description: "Exclusively curated question bank containing 500 hand-picked multiple-choice questions strictly mapped to the updated SLRC Grade III & IV syllabus, with detailed explanations for every math problem and GK fact.",
    content: "### Breakdown of 500 Questions\n\n- 150 Questions on Assam GK, History, National Parks, and Census\n- 100 Questions on General Mathematics (Class 10 level: LCM, Percentage, Profit-Loss, Time-Distance)\n- 100 Questions on Logical Reasoning & Verbal Puzzles\n- 100 Questions on General English (Prepositions, Voice Change, Antonyms, Idioms)\n- 50 Questions on Central & Assam State Government Welfare Schemes (Orunodoi 3.0, Mukhya Mantri Atmanirbhar Asom Abhiyan)",
    file_url: "https://assamjobshub.com/mock-tests",
    cover_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    tags: ["ajh-exclusive", "free-book", "adre", "solved-papers", "practice-questions"],
    metadata: {
      book_category: "AJH_EBOOK",
      language: "Bilingual (English & Assamese)",
      pages: 88,
      publisher: "AssamJobs Hub Learning Division",
      is_full_book: true,
      highlight: "100% Free Complete Solved Problem Booklet",
      rating: 4.9
    }
  },
  {
    title: "Assam Current Affairs & State Schemes 2025-2026 Compendium",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "AssamJobs Hub Editorial",
    year: 2026,
    description: "Complete annual compendium of Assam state news, budget allocations, new wildlife sanctuaries, Padma awardees from Assam, appointments, and mega development projects (Semiconductor plant in Jagiroad, Brahmaputra bridges, Guwahati AIIMS expansion).",
    content: "### Sections Covered\n\n- All Cabinet Decisions & Ordinances of Government of Assam\n- State Awards: Assam Baibhav, Assam Saurav, Assam Gaurav\n- Environment & Biodiversity: Kaziranga & Manas eco-developments\n- Infrastructure Projects: Tata Semiconductor Plant in Jagiroad, New National Highways\n- Sports & Youth Affairs: Assam athletes at National Games & Olympics",
    file_url: "https://assamjobshub.com/updates",
    cover_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80",
    tags: ["ajh-exclusive", "free-book", "current-affairs", "adre", "assam-police", "apsc"],
    metadata: {
      book_category: "AJH_EBOOK",
      language: "English & Assamese",
      pages: 72,
      publisher: "AssamJobs Hub",
      is_full_book: true,
      highlight: "Comprehensive Annual Roundup for All State Exams",
      rating: 4.8
    }
  },

  // --- Category 3: Recommended Commercial Bestsellers (Buying Guides & Links) ---
  {
    title: "Assam Year Book 2026 (English & Assamese Editions)",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "Santanu Koushik Baruah",
    year: 2026,
    description: "Universally acknowledged as the premier reference book for any competitive exam in Assam. Comprehensive coverage of Assam's history, geographical features, mineral resources, tea & oil industry, literature, festivals, and demographic census.",
    content: "### Recommended Study Strategy for Assam Year Book\n\n- **For ADRE Grade III & IV:** Focus heavily on Sections 1 to 4 (History of Assam, Geography, National Parks, and Assamese Culture). Skip high-level industrial statistical tables.\n- **For Assam Police SI:** Prioritize District-wise profiles, boundary disputes, tribal demographics, and police administration.\n- **For APSC CCE:** Study the entire economy, agriculture, forest cover, and cultural syncretism sections thoroughly.",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "bestseller", "assam-year-book", "adre", "apsc", "assam-police"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "Available in separate Assamese & English editions",
      pages: 650,
      publisher: "Jyoti Prakashan, Panbazar, Guwahati",
      buy_url: "https://www.amazon.in/s?k=assam+year+book+santanu+kaushik+baruah",
      is_full_book: false,
      highlight: "The #1 Must-Have Book for all Assam State Competitive Exams",
      rating: 4.9
    }
  },
  {
    title: "Quantitative Aptitude for Competitive Examinations",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "Dr. R.S. Aggarwal",
    year: 2025,
    description: "The definitive mathematics book for building elementary to advanced quantitative aptitude. Essential for ADRE Paper III & IV, SSC, and Banking exams.",
    content: "### Crucial Chapters for ADRE & Assam Police\n\n- Number Systems, HCF & LCM of Numbers\n- Simplification and Approximations\n- Percentages, Profit and Loss, Discount\n- Simple Interest & Compound Interest\n- Ratio & Proportion, Partnership\n- Time and Work, Pipes and Cisterns\n- Time, Speed and Distance, Trains & Boats\n- Mensuration (Area and Volume of 2D & 3D figures)",
    cover_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "maths", "quantitative-aptitude", "adre", "assam-police"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "English / Hindi",
      pages: 940,
      publisher: "S. Chand Publishing",
      buy_url: "https://www.amazon.in/s?k=quantitative+aptitude+rs+aggarwal",
      is_full_book: false,
      highlight: "Master ADRE Class 10/12 Level Math Section with Solved Examples",
      rating: 4.8
    }
  },
  {
    title: "Indian Polity (7th Edition)",
    type: "BOOK",
    exam_slug: "apsc-cce",
    author: "M. Laxmikanth",
    year: 2026,
    description: "Widely regarded as the 'Bible of Indian Polity'. Indispensable for APSC Combined Competitive Examination (CCE) Prelims & Mains and Assam Police Sub-Inspector recruitments.",
    content: "### Key Chapters for APSC CCE & Assam Police SI\n\n- Historical Background & Making of the Constitution\n- Preamble, Fundamental Rights (Articles 12-35), Directive Principles of State Policy\n- President, Vice-President, Prime Minister & Council of Ministers\n- Parliament (Lok Sabha & Rajya Sabha) legislative procedures\n- Governor, Chief Minister, and State Legislature (Assam Legislative Assembly)\n- Panchayati Raj (73rd Amendment) and Municipalities (74th Amendment)\n- Constitutional Bodies (ECI, UPSC, APSC, CAG)",
    cover_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "polity", "apsc", "assam-police-si", "civil-services"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "English",
      pages: 890,
      publisher: "McGraw Hill Education",
      buy_url: "https://www.amazon.in/s?k=indian+polity+m+laxmikanth",
      is_full_book: false,
      highlight: "Essential Text for APSC Prelims GS & Mains Examination",
      rating: 5.0
    }
  },
  {
    title: "Objective General English",
    type: "BOOK",
    exam_slug: "adre-assam-direct-recruitment",
    author: "S.P. Bakshi",
    year: 2025,
    description: "The most recommended reference book for General English language sections in ADRE, Assam Police, and Assam TET. Provides comprehensive rule explanations, error-spotting practice, and high-frequency vocabulary.",
    content: "### High-Yield Syllabus Topics\n\n- Parts of Speech & Subject-Verb Agreement rules\n- Correct Use of Prepositions (Fixed prepositions list)\n- Active and Passive Voice conversion rules\n- Direct and Indirect Speech\n- Synonyms, Antonyms, One-Word Substitutions, and Common Idioms\n- Sentence Completion & Reading Comprehension passages",
    cover_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "english", "grammar", "adre", "assam-police", "tet"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "English",
      pages: 720,
      publisher: "Arihant Publications",
      buy_url: "https://www.amazon.in/s?k=objective+general+english+sp+bakshi",
      is_full_book: false,
      highlight: "Master English Grammar & Vocabulary for 35 Marks in ADRE",
      rating: 4.8
    }
  },
  {
    title: "Assam Police Sub-Inspector (SI) & Constable Exam Guide",
    type: "BOOK",
    exam_slug: "assam-police-recruitment",
    author: "B.B. Dey / Ashok Kumar",
    year: 2026,
    description: "Complete targeted guide specifically designed for SLPRB Assam Police recruitment examinations. Contains previous years' solved question papers, mental reasoning tricks, general science formulas, and Assam history notes.",
    content: "### Complete SLPRB Exam Preparation Guide\n\n- Detailed analysis of Physical Efficiency (PET) and Written Exam criteria\n- Reasoning & Mental Ability with shortcut techniques\n- Assam Police history, ranks, and Indian Penal Code / Criminal Law basics\n- Full-length model mock tests with explanatory answer keys",
    cover_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "assam-police", "si", "constable", "guide"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "Assamese & English Bilingual",
      pages: 512,
      publisher: "Vidya Prakashan / Ashok Publication",
      buy_url: "https://www.amazon.in/s?k=assam+police+exam+book",
      is_full_book: false,
      highlight: "Targeted Specifically for SLPRB Constable (AB/UB) & Sub-Inspector",
      rating: 4.7
    }
  },
  {
    title: "Child Development and Pedagogy for CTET & Assam TET",
    type: "BOOK",
    exam_slug: "assam-tet",
    author: "Himanshi Singh / Pearson",
    year: 2026,
    description: "The top-rated textbook for Lower Primary (LP) and Upper Primary (UP) Teachers Eligibility Test. Thoroughly breaks down child psychology theories, pedagogy of learning, inclusive schooling, and cognitive assessment.",
    content: "### Pedagogy Core Topics\n\n- Concept of Development and its Relationship with Learning\n- Principles of Development of Children\n- Theories of Piaget, Kohlberg, and Vygotsky: Constructs and Critical Perspectives\n- Concepts of Child-Centered and Progressive Education\n- Addressing Learners from Diverse Backgrounds and Addressing Children with Special Needs (CWSN)\n- Formative and Summative Evaluation methods",
    cover_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    tags: ["recommended-buy", "tet", "pedagogy", "assam-tet", "education"],
    metadata: {
      book_category: "RECOMMENDED_BUY",
      language: "Bilingual (English & Hindi/Assamese context)",
      pages: 420,
      publisher: "Pearson / Let's LEARN",
      buy_url: "https://www.amazon.in/s?k=child+development+and+pedagogy+himanshi+singh",
      is_full_book: false,
      highlight: "Essential for Scoring 30/30 in Assam TET Pedagogy Section",
      rating: 4.9
    }
  }
];

async function seed() {
  console.log("=== Seeding Books & Study Material Catalog ===");

  // 1. Fetch exams
  const { data: exams, error: exErr } = await supabase.from('prep_exams').select('id, slug, title');
  if (exErr) {
    console.error("Error fetching exams:", exErr);
    return;
  }
  const examMap = new Map<string, string>();
  exams.forEach(e => examMap.set(e.slug, e.id));

  for (const b of books) {
    const examId = b.exam_slug ? examMap.get(b.exam_slug) : null;

    // Check if book already exists by title
    const { data: existing } = await supabase
      .from('prep_materials')
      .select('id')
      .eq('title', b.title)
      .maybeSingle();

    if (existing) {
      const fullDescription = (b as any).content 
        ? `${b.description}\n\n${(b as any).content}`
        : b.description;

      const { error: upErr } = await supabase
        .from('prep_materials')
        .update({
          type: b.type,
          exam_id: examId,
          author: b.author,
          year: b.year,
          description: fullDescription,
          file_url: b.file_url,
          cover_url: b.cover_url,
          tags: b.tags,
          metadata: b.metadata,
          status: 'PUBLISHED',
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (upErr) {
        console.error(`Failed to update book "${b.title}":`, upErr.message);
      } else {
        console.log(`✓ Updated book: "${b.title}"`);
      }
    } else {
      const fullDescription = (b as any).content 
        ? `${b.description}\n\n${(b as any).content}`
        : b.description;

      const { error: inErr } = await supabase
        .from('prep_materials')
        .insert({
          title: b.title,
          type: b.type,
          exam_id: examId,
          author: b.author,
          year: b.year,
          description: fullDescription,
          file_url: b.file_url,
          cover_url: b.cover_url,
          tags: b.tags,
          metadata: b.metadata,
          status: 'PUBLISHED'
        });

      if (inErr) {
        console.error(`Failed to insert book "${b.title}":`, inErr.message);
      } else {
        console.log(`✓ Inserted book: "${b.title}"`);
      }
    }
  }

  console.log("=== Books Catalog Successfully Seeded! ===");
}

seed().catch(console.error);
