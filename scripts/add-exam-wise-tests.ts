import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin as supabase } from '@/lib/supabase';
import crypto from 'crypto';

interface QuestionSeed {
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface NewMockTest {
  title: string;
  exam_slug: string;
  duration_minutes: number;
  total_marks: number;
  negative_marking: number;
  instructions: string;
  questions: QuestionSeed[];
}

const newTests: NewMockTest[] = [
  {
    title: "ADRE 2.0 Grade III (Paper III) Full Mock Test 2026",
    exam_slug: "adre-assam-direct-recruitment",
    duration_minutes: 60,
    total_marks: 50,
    negative_marking: 0.25,
    instructions: "This test consists of multiple-choice questions based on the latest SLRC ADRE 2.0 syllabus. Each question carries 1 mark with 0.25 negative marking for incorrect answers.",
    questions: [
      {
        question_text: "Who was the first Ahom king to formally adopt a Hindu title and assume the name 'Swarganarayan'?",
        options: { A: "Suhungmung", B: "Jayadhwaj Singha", C: "Rudra Singha", D: "Pratap Singha" },
        correct_answer: "A",
        explanation: "Suhungmung (1497–1539), also known as the Dihingia Raja, was the first Ahom king to assume the Hindu title 'Swarganarayan' and adopt the Saka era.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "The historic treaty of Yandabo was signed in which year, leading to British annexation of Assam?",
        options: { A: "1824", B: "1826", C: "1857", D: "1838" },
        correct_answer: "B",
        explanation: "The Treaty of Yandabo was signed on 24 February 1826 between the British East India Company and the Kingdom of Burma, ending the First Anglo-Burmese War and marking the start of British rule in Assam.",
        difficulty: "EASY"
      },
      {
        question_text: "Which national park in Assam is renowned as the primary habitat of the endangered White-winged Wood Duck (Deo Hah)?",
        options: { A: "Kaziranga National Park", B: "Manas National Park", C: "Nameri National Park", D: "Dibru-Saikhowa National Park" },
        correct_answer: "C",
        explanation: "Nameri National Park (along with Dibru-Saikhowa) is a critical stronghold for the White-winged Wood Duck (Asarcornis scutulata), the state bird of Assam.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "If a sum of money doubles itself in 5 years at simple interest, what is the annual rate of interest?",
        options: { A: "15%", B: "20%", C: "25%", D: "10%" },
        correct_answer: "B",
        explanation: "Simple Interest = Principal. Rate = (SI * 100) / (P * T) = (P * 100) / (P * 5) = 20% per annum.",
        difficulty: "EASY"
      },
      {
        question_text: "Who was the editor of the historic Assamese journal 'Jonaki' published in 1889 from Calcutta?",
        options: { A: "Lakshminath Bezbaroa", B: "Chandra Kumar Agarwala", C: "Hemchandra Goswami", D: "Padmanath Gohain Baruah" },
        correct_answer: "B",
        explanation: "Chandra Kumar Agarwala was the founder-editor of 'Jonaki' in 1889, inaugurating the Romantic era in Assamese literature.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "The bridge connecting Dhola to Sadiya over the Lohit river is officially named after which illustrious personality?",
        options: { A: "Lachit Borphukan", B: "Dr. Bhupen Hazarika", C: "Gopinath Bordoloi", D: "Bishnu Prasad Rabha" },
        correct_answer: "B",
        explanation: "The Dhola-Sadiya Bridge, spanning 9.15 km across the Lohit river, is officially named the Dr. Bhupen Hazarika Setu.",
        difficulty: "EASY"
      },
      {
        question_text: "Select the correctly formatted passive sentence: 'The committee rejected the proposal.'",
        options: { 
          A: "The proposal has been rejected by the committee.", 
          B: "The proposal was rejected by the committee.", 
          C: "The proposal is being rejected by the committee.", 
          D: "The proposal had rejected by the committee." 
        },
        correct_answer: "B",
        explanation: "The sentence is in Simple Past tense. The passive structure is: Object + was/were + past participle + by + Subject ('The proposal was rejected by the committee').",
        difficulty: "EASY"
      },
      {
        question_text: "Which tier of Panchayati Raj operates at the block level in Assam?",
        options: { A: "Gaon Panchayat", B: "Anchalik Panchayat", C: "Zilla Parishad", D: "Gram Sabha" },
        correct_answer: "B",
        explanation: "In Assam's 3-tier Panchayati Raj system, Anchalik Panchayat functions at the intermediate/block level, Gaon Panchayat at village level, and Zilla Parishad at district level.",
        difficulty: "MEDIUM"
      }
    ]
  },
  {
    title: "ADRE 2.0 Grade IV Special Mock Test 2026",
    exam_slug: "adre-assam-direct-recruitment",
    duration_minutes: 45,
    total_marks: 40,
    negative_marking: 0.25,
    instructions: "General Awareness and Elementary Mathematics for ADRE 2.0 Class IV posts. Attempt all questions.",
    questions: [
      {
        question_text: "Which district of Assam is famous for Bell-metal and Brass-metal crafts?",
        options: { A: "Barpeta (Sarthebari)", B: "Darrang", C: "Nalbari", D: "Golaghat" },
        correct_answer: "A",
        explanation: "Sarthebari in Barpeta district is world-renowned for its traditional bell-metal cottage industry.",
        difficulty: "EASY"
      },
      {
        question_text: "What is the capital of Assam?",
        options: { A: "Guwahati", B: "Dispur", C: "Jorhat", D: "Silchar" },
        correct_answer: "B",
        explanation: "Dispur, a locality in Guwahati, has been the capital of Assam since 1973 (shifted from Shillong).",
        difficulty: "EASY"
      },
      {
        question_text: "Find the average of numbers: 12, 18, 24, 30, 36.",
        options: { A: "22", B: "24", C: "26", D: "28" },
        correct_answer: "B",
        explanation: "Sum = 120, count = 5. Average = 120 / 5 = 24. Also, for equally spaced consecutive numbers, the middle term is the average.",
        difficulty: "EASY"
      },
      {
        question_text: "Who wrote the state anthem of Assam 'O Mur Apunar Desh'?",
        options: { A: "Lakshminath Bezbaroa", B: "Jyoti Prasad Agarwala", C: "Bishnu Prasad Rabha", D: "Hem Barua" },
        correct_answer: "A",
        explanation: "'O Mur Apunar Desh' was composed by Sahityarathi Lakshminath Bezbaroa and officially adopted as the state song of Assam in 1927.",
        difficulty: "EASY"
      },
      {
        question_text: "Which organ in the human body pumps blood?",
        options: { A: "Lungs", B: "Liver", C: "Heart", D: "Kidney" },
        correct_answer: "C",
        explanation: "The heart functions as the biological pump circulating blood through the circulatory system.",
        difficulty: "EASY"
      }
    ]
  },
  {
    title: "Assam Police Constable & SI Special Mock Test 2026",
    exam_slug: "assam-police-recruitment",
    duration_minutes: 45,
    total_marks: 40,
    negative_marking: 0.25,
    instructions: "Standard SLPRB exam format. Answer all questions within the 45-minute window. Negative marking applies.",
    questions: [
      {
        question_text: "Where is the headquarter of the Assam Police Training College (Dergaon) situated?",
        options: { A: "Golaghat district", B: "Jorhat district", C: "Nagaon district", D: "Kamrup Metro" },
        correct_answer: "A",
        explanation: "Dergaon Police Training College (Assam Police Academy) is located in Golaghat district.",
        difficulty: "EASY"
      },
      {
        question_text: "Find the missing number in the series: 4, 9, 25, 49, 121, ?",
        options: { A: "144", B: "169", C: "196", D: "225" },
        correct_answer: "B",
        explanation: "The series represents squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, next prime is 13, and 13^2 = 169.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "During the Quit India Movement of 1942, Kanaklata Barua attained martyrdom while trying to hoist the National Flag at which police station?",
        options: { A: "Dhekiajuli Police Station", B: "Gohpur Police Station", C: "Sootea Police Station", D: "Barpeta Police Station" },
        correct_answer: "B",
        explanation: "17-year-old Kanaklata Barua was shot dead by British police on 20 September 1942 while leading the Mrityu Bahini procession to hoist the Tricolour at Gohpur police station.",
        difficulty: "EASY"
      },
      {
        question_text: "Which chemical compound is commonly known as 'Laughing Gas'?",
        options: { A: "Nitric oxide", B: "Nitrous oxide", C: "Nitrogen dioxide", D: "Sulfur dioxide" },
        correct_answer: "B",
        explanation: "Nitrous oxide (N2O) is commonly known as laughing gas or nitrous.",
        difficulty: "EASY"
      },
      {
        question_text: "Pointing to a photograph, a man said, 'She is the daughter of my grandfather's only son.' How is the woman in the photograph related to the man?",
        options: { A: "Mother", B: "Aunt", C: "Sister", D: "Daughter" },
        correct_answer: "C",
        explanation: "Grandfather's only son is the man's father. The daughter of the man's father is his sister.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "Under the Indian Constitution, 'Police' and 'Public Order' are subjects under which list?",
        options: { A: "Union List", B: "State List", C: "Concurrent List", D: "Residuary Powers" },
        correct_answer: "B",
        explanation: "According to Schedule VII of the Constitution of India, Police and Public Order are listed under the State List (List II, Entries 1 & 2).",
        difficulty: "EASY"
      }
    ]
  },
  {
    title: "APSC CCE 2026 Prelims GS Paper I Mock Test",
    exam_slug: "apsc-cce",
    duration_minutes: 60,
    total_marks: 50,
    negative_marking: 0.25,
    instructions: "Designed strictly on the updated UPSC/APSC combined pattern. Read all explanations post-submission to deepen conceptual retention.",
    questions: [
      {
        question_text: "Consider the following statements regarding the Battle of Saraighat (1671):\n1. It was fought between the Mughal Empire led by Ram Singh I and the Ahom Kingdom led by Lachit Borphukan.\n2. The Ahoms strategically used naval warfare on the Brahmaputra at Saraighat.\nWhich of the statements given above is/are correct?",
        options: { A: "1 only", B: "2 only", C: "Both 1 and 2", D: "Neither 1 nor 2" },
        correct_answer: "C",
        explanation: "Both statements are correct. The 1671 naval engagement saw Lachit Borphukan exploit the narrow gauge of the Brahmaputra to overcome the superior Mughal artillery and cavalry.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "Which Constitutional Amendment Act granted Constitutional status and protection to the Panchayati Raj Institutions in India?",
        options: { A: "42nd Amendment Act, 1976", B: "44th Amendment Act, 1978", C: "73rd Amendment Act, 1992", D: "86th Amendment Act, 2002" },
        correct_answer: "C",
        explanation: "The 73rd Constitutional Amendment Act of 1992 inserted Part IX and the 11th Schedule into the Constitution, giving constitutional sanction to Panchayati Raj Institutions.",
        difficulty: "EASY"
      },
      {
        question_text: "The 'Moamoria Rebellion' was a significant peasant and socio-religious uprising against which dynasty?",
        options: { A: "Koch Dynasty", B: "Ahom Dynasty", C: "Kachari Dynasty", D: "Chutiya Dynasty" },
        correct_answer: "B",
        explanation: "The Moamoria rebellion was a prolonged late 18th-century conflict between the Moamaria Matak disciples and the Ahom monarchy, critically weakening Ahom authority.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "What is the primary ecological reason for designating the Majuli river island as an eco-sensitive cultural landscape?",
        options: { 
          A: "Only habitat of the Golden Langur", 
          B: "World's largest inhabited freshwater river island exhibiting Vaishnavite Satriya cultural symbiosis and rich avian biodiversity", 
          C: "Largest mangrove delta in Northeast India", 
          D: "Exclusive location of petroleum reservoirs" 
        },
        correct_answer: "B",
        explanation: "Majuli is the world's largest inhabited river island on the Brahmaputra, representing an extraordinary socio-cultural synthesis centered around Neo-Vaishnavite Satras.",
        difficulty: "MEDIUM"
      },
      {
        question_text: "Which Article of the Indian Constitution empowers the Governor of a state to promulgate Ordinances when the state legislature is not in session?",
        options: { A: "Article 123", B: "Article 213", C: "Article 214", D: "Article 163" },
        correct_answer: "B",
        explanation: "Article 213 deals with the legislative power of the Governor to promulgate Ordinances during recess of Legislature (Article 123 applies to the President).",
        difficulty: "EASY"
      }
    ]
  },
  {
    title: "Assam TET 2026 Child Development & Pedagogy Mock Test",
    exam_slug: "assam-tet",
    duration_minutes: 45,
    total_marks: 40,
    negative_marking: 0,
    instructions: "No negative marking for Assam TET. Attempt all questions.",
    questions: [
      {
        question_text: "According to Jean Piaget's cognitive development theory, in which stage does a child develop object permanence?",
        options: { A: "Sensorimotor stage (0-2 years)", B: "Pre-operational stage (2-7 years)", C: "Concrete operational stage (7-11 years)", D: "Formal operational stage (11+ years)" },
        correct_answer: "A",
        explanation: "In Piaget's theory, infants develop object permanence (understanding that objects continue to exist even when hidden) during the Sensorimotor stage (0-2 years).",
        difficulty: "EASY"
      },
      {
        question_text: "Lev Vygotsky introduced the concept of 'Zone of Proximal Development' (ZPD), which refers to:",
        options: { 
          A: "The physical boundary within a classroom", 
          B: "The difference between what a learner can do without help and what they can do with guidance", 
          C: "The innate biological intelligence of a student", 
          D: "The maximum memory retention limit" 
        },
        correct_answer: "B",
        explanation: "Vygotsky's ZPD defines the learning space between the child's actual developmental level (independent problem solving) and potential developmental level under adult guidance (Scaffolding).",
        difficulty: "MEDIUM"
      },
      {
        question_text: "Which of the following is the most effective approach to foster inclusive education in Assam schools?",
        options: { 
          A: "Segregating children with special needs into separate classrooms", 
          B: "Differentiated instruction, assistive aids, and addressing diverse linguistic backgrounds with equity", 
          C: "Conducting identical high-stakes written tests for every student", 
          D: "Focusing solely on rote memorization of textbooks" 
        },
        correct_answer: "B",
        explanation: "Inclusive education mandates accommodating the full range of abilities and linguistic diversities through customized pedagogy, positive reinforcement, and equal learning opportunities.",
        difficulty: "EASY"
      },
      {
        question_text: "Right to Free and Compulsory Education (RTE) Act 2009 guarantees free education to all children in India between which age group?",
        options: { A: "3 to 14 years", B: "6 to 14 years", C: "5 to 15 years", D: "6 to 18 years" },
        correct_answer: "B",
        explanation: "Under Article 21A and the RTE Act 2009, free and compulsory education is guaranteed to all children between 6 and 14 years of age.",
        difficulty: "EASY"
      }
    ]
  }
];

async function run() {
  console.log("=== Creating Exam-Wise Mock Tests ===");

  // 1. Fetch exams
  const { data: exams, error: exErr } = await supabase.from('prep_exams').select('id, slug, title');
  if (exErr) {
    console.error("Error fetching exams:", exErr);
    return;
  }
  const examMap = new Map<string, string>();
  exams.forEach(e => examMap.set(e.slug, e.id));

  for (const t of newTests) {
    const examId = examMap.get(t.exam_slug);
    if (!examId) {
      console.warn(`Exam with slug ${t.exam_slug} not found, skipping.`);
      continue;
    }

    // Check if test already exists by title and exam_id
    const { data: existing } = await supabase
      .from('prep_mock_tests')
      .select('id, title')
      .eq('title', t.title)
      .eq('exam_id', examId)
      .maybeSingle();

    let testId: string;
    if (existing) {
      testId = existing.id;
      console.log(`Test already exists: "${t.title}" (${testId}), updating question mappings...`);
    } else {
      const { data: created, error: createErr } = await supabase
        .from('prep_mock_tests')
        .insert({
          title: t.title,
          exam_id: examId,
          duration_minutes: t.duration_minutes,
          total_marks: t.total_marks,
          negative_marking: t.negative_marking,
          instructions: t.instructions,
          status: 'PUBLISHED'
        })
        .select('id')
        .single();

      if (createErr || !created) {
        console.error(`Failed to create test "${t.title}":`, createErr);
        continue;
      }
      testId = created.id;
      console.log(`✓ Created test "${t.title}" (${testId})`);
    }

    // Insert questions and map
    let orderIndex = 1;
    for (const q of t.questions) {
      // Find or insert question
      const { data: qExisting } = await supabase
        .from('prep_questions')
        .select('id')
        .eq('question_text', q.question_text)
        .maybeSingle();

      let questionId: string;
      if (qExisting) {
        questionId = qExisting.id;
      } else {
        const { data: qInserted, error: qErr } = await supabase
          .from('prep_questions')
          .insert({
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            status: 'PUBLISHED'
          })
          .select('id')
          .single();

        if (qErr || !qInserted) {
          console.error("Failed to insert question:", qErr);
          continue;
        }
        questionId = qInserted.id;
      }

      // Map to prep_mock_test_questions
      const { error: mapErr } = await supabase
        .from('prep_mock_test_questions')
        .upsert(
          {
            test_id: testId,
            question_id: questionId,
            order_index: orderIndex
          },
          { onConflict: 'test_id,question_id' }
        );

      if (mapErr) {
        console.warn(`Map error for question ${orderIndex}:`, mapErr.message);
      } else {
        orderIndex++;
      }
    }

    console.log(`✓ Mapped ${orderIndex - 1} questions to "${t.title}"`);
  }

  console.log("=== Exam-Wise Mock Tests Successfully Added! ===");
}

run().catch(console.error);
