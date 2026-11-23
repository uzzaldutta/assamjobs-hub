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

const englishQuestions: QuestionSeed[] = [
  {
    question_text: "Choose the correct antonym of the word 'BENEVOLENT':",
    options: { A: "Kind", B: "Generous", C: "Malevolent", D: "Sympathetic" },
    correct_answer: "C",
    explanation: "'Benevolent' means well-meaning and kindly. Its direct antonym is 'Malevolent', meaning wishing evil or harm to others.",
    difficulty: "EASY"
  },
  {
    question_text: "Fill in the blank with the appropriate preposition: 'He is proficient _____ Assamese and English.'",
    options: { A: "in", B: "with", C: "at", D: "for" },
    correct_answer: "A",
    explanation: "The adjective 'proficient' is correctly followed by the preposition 'in' when referring to skills or languages.",
    difficulty: "EASY"
  },
  {
    question_text: "Identify the correctly spelled word:",
    options: { A: "Burocracy", B: "Bureaucracy", C: "Beurocracy", D: "Bureaucrasy" },
    correct_answer: "B",
    explanation: "The correct spelling is 'Bureaucracy' (B-U-R-E-A-U-C-R-A-C-Y).",
    difficulty: "EASY"
  },
  {
    question_text: "What is the meaning of the idiom 'To burn the midnight oil'?",
    options: { A: "To waste electricity", B: "To work or study late into the night", C: "To cause an accidental fire", D: "To spend money extravagantly" },
    correct_answer: "B",
    explanation: "'To burn the midnight oil' means to work, read, or study late into the night.",
    difficulty: "EASY"
  },
  {
    question_text: "Choose the one word substitution for: 'A person who knows and speaks many languages.'",
    options: { A: "Polyglot", B: "Linguist", C: "Philologist", D: "Grammarian" },
    correct_answer: "A",
    explanation: "A 'Polyglot' is a person who knows and speaks several languages.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Select the correct passive form: 'The police caught the thief red-handed.'",
    options: {
      A: "The thief was caught red-handed by the police.",
      B: "The thief had caught red-handed by police.",
      C: "The thief is caught red-handed by the police.",
      D: "The police was catching the thief red-handed."
    },
    correct_answer: "A",
    explanation: "In simple past tense ('caught'), the passive structure is 'was/were + past participle' (was caught).",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Fill in the blank: 'Neither the teacher nor the students _____ present in the seminar.'",
    options: { A: "was", B: "were", C: "is", D: "has been" },
    correct_answer: "B",
    explanation: "When two subjects are joined by 'neither... nor', the verb agrees with the closer subject ('the students' -> plural verb 'were').",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Choose the synonym of 'CANDID':",
    options: { A: "Deceptive", B: "Secretive", C: "Frank", D: "Shy" },
    correct_answer: "C",
    explanation: "'Candid' means truthful, straightforward, and frank.",
    difficulty: "EASY"
  },
  {
    question_text: "Spot the error in the sentence: 'Each of the participants (A) / were given (B) / a certificate of appreciation (C) / No error (D)'",
    options: { A: "A", B: "B", C: "C", D: "D" },
    correct_answer: "B",
    explanation: "'Each' takes a singular verb. The correct phrase is 'was given' instead of 'were given'.",
    difficulty: "HARD"
  },
  {
    question_text: "Choose the correct indirect speech: He said, 'I am reading a book on Assam history.'",
    options: {
      A: "He said that he was reading a book on Assam history.",
      B: "He said that he is reading a book on Assam history.",
      C: "He said that he had read a book on Assam history.",
      D: "He said that he reads a book on Assam history."
    },
    correct_answer: "A",
    explanation: "In reported speech with a past reporting verb, present continuous ('am reading') shifts to past continuous ('was reading').",
    difficulty: "MEDIUM"
  }
];

const adreQuestions: QuestionSeed[] = [
  {
    question_text: "Who was the first Ahom king to formally adopt a Hindu title and coin currency?",
    options: { A: "Suhungmung (Swarganarayan)", B: "Rudra Singha", C: "Gadadhar Singha", D: "Sukaphaa" },
    correct_answer: "A",
    explanation: "Suhungmung was the first Ahom king to assume the Hindu title 'Swarganarayan' and initiated notable administrative reforms.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "The historic Battle of Saraighat was fought on the Brahmaputra in which year?",
    options: { A: "1662", B: "1671", C: "1681", D: "1654" },
    correct_answer: "B",
    explanation: "The Battle of Saraighat took place in 1671 between the Mughal Empire (led by Ram Singh I) and the Ahom Kingdom (led by Lachit Borphukan).",
    difficulty: "EASY"
  },
  {
    question_text: "Which national park in Assam is famous for being the primary habitat of the Golden Langur?",
    options: { A: "Kaziranga National Park", B: "Manas National Park", C: "Raimona National Park", D: "Nameri National Park" },
    correct_answer: "C",
    explanation: "Raimona National Park in the Bodoland Territorial Region is internationally celebrated for preserving the endangered Golden Langur.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Simplify: If a train running at 72 km/h crosses a pole in 15 seconds, what is the length of the train?",
    options: { A: "200 m", B: "250 m", C: "300 m", D: "350 m" },
    correct_answer: "C",
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Length (Distance) = Speed * Time = 20 m/s * 15 s = 300 meters.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "The Treaty of Yandabo, which ended the First Anglo-Burmese War and brought Assam under British rule, was signed in:",
    options: { A: "1824", B: "1826", C: "1838", D: "1857" },
    correct_answer: "B",
    explanation: "The Treaty of Yandabo was signed on 24 February 1826 between the East India Company and the Kingdom of Burma.",
    difficulty: "EASY"
  },
  {
    question_text: "Who composed the state anthem of Assam, 'O Mur Apunar Dex'?",
    options: { A: "Bhupen Hazarika", B: "Lakshminath Bezbaroa", C: "Jyoti Prasad Agarwala", D: "Hemchandra Baruah" },
    correct_answer: "B",
    explanation: "'O Mur Apunar Dex' was written by Lakshminath Bezbaroa and first published in the literary magazine 'Bahi' in 1909.",
    difficulty: "EASY"
  },
  {
    question_text: "A shopkeeper marks an article at ₹800 and offers a 15% discount. What is the selling price?",
    options: { A: "₹680", B: "₹700", C: "₹720", D: "₹650" },
    correct_answer: "A",
    explanation: "Discount = 15% of 800 = ₹120. Selling Price = 800 - 120 = ₹680.",
    difficulty: "EASY"
  },
  {
    question_text: "Which river is the longest right-bank tributary of the Brahmaputra in Assam?",
    options: { A: "Dhansiri", B: "Subansiri", C: "Kopili", D: "Manas" },
    correct_answer: "B",
    explanation: "The Subansiri River (Gold River) is the largest and longest tributary joining the Brahmaputra from its north (right) bank.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: { A: "95", B: "127", C: "115", D: "125" },
    correct_answer: "B",
    explanation: "Pattern: (previous number * 2) + 1. (63 * 2) + 1 = 126 + 1 = 127.",
    difficulty: "EASY"
  },
  {
    question_text: "Who was the founder president of the Asam Sahitya Sabha held at Sivasagar in 1917?",
    options: { A: "Padmanath Gohain Baruah", B: "Chandradhar Barua", C: "Kaliram Medhi", D: "Hemchandra Goswami" },
    correct_answer: "A",
    explanation: "Padmanath Gohain Baruah was the first president of Asam Sahitya Sabha during its inaugural session at Sivasagar in December 1917.",
    difficulty: "MEDIUM"
  }
];

const assamPoliceQuestions: QuestionSeed[] = [
  {
    question_text: "Where is the Assam Police Training College (Dergaon) located?",
    options: { A: "Golaghat District", B: "Jorhat District", C: "Nagaon District", D: "Kamrup District" },
    correct_answer: "A",
    explanation: "The Assam Police Training College is situated at Dergaon in the Golaghat district of Assam.",
    difficulty: "EASY"
  },
  {
    question_text: "In the Indian Constitution, 'Police and Public Order' are subjects under which list?",
    options: { A: "Union List", B: "State List", C: "Concurrent List", D: "Residuary Powers" },
    correct_answer: "B",
    explanation: "Under the Seventh Schedule of the Indian Constitution, 'Police' and 'Public Order' are entries 1 and 2 of the State List.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "If 'POLICE' is coded as 'QNMJDF' in a certain code, how is 'ARREST' coded?",
    options: { A: "BSQFRU", B: "BSSFTU", C: "BSQDTS", D: "BSSDTS" },
    correct_answer: "A",
    explanation: "Letter shifting: P(+1)->Q, O(-1)->N, L(+1)->M, I(+1)->J, C(+1)->D, E(+1)->F. Applying the pattern yields BSQFRU.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "The prestigious Bir Chilarai Award is given by the Government of Assam in memory of the commander-in-chief of which dynasty?",
    options: { A: "Ahom Dynasty", B: "Koch Dynasty", C: "Kachari Dynasty", D: "Chutiya Dynasty" },
    correct_answer: "B",
    explanation: "Chilarai (Shukladhwaj) was the famous general and younger brother of King Nara Narayana of the Koch dynasty.",
    difficulty: "EASY"
  },
  {
    question_text: "A person facing North turns 90 degrees clockwise, then 180 degrees counter-clockwise. Which direction is he facing now?",
    options: { A: "East", B: "West", C: "North", D: "South" },
    correct_answer: "B",
    explanation: "North -> 90° clockwise = East. East -> 180° counter-clockwise = West.",
    difficulty: "EASY"
  },
  {
    question_text: "Who was the first Director General of Police (DGP) of independent Assam?",
    options: { A: "K. R. Choudhury", B: "R. N. Phukan", C: "B. N. Hazarika", D: "J. N. Neog" },
    correct_answer: "A",
    explanation: "K. R. Choudhury, IPS served as the first Inspector General / Director General of Police in post-independence Assam.",
    difficulty: "HARD"
  },
  {
    question_text: "Under the Code of Criminal Procedure (CrPC), an arrested person must be produced before the nearest Magistrate within how many hours?",
    options: { A: "12 hours", B: "24 hours", C: "48 hours", D: "72 hours" },
    correct_answer: "B",
    explanation: "Section 57 of CrPC (and Article 22 of the Constitution) requires production within 24 hours excluding travel time.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "In which year did the historic Moamoria Rebellion begin against Ahom rule?",
    options: { A: "1769", B: "1782", C: "1794", D: "1805" },
    correct_answer: "A",
    explanation: "The Moamoria rebellion started in 1769 during the reign of King Lakshmi Singha.",
    difficulty: "MEDIUM"
  }
];

const apscQuestions: QuestionSeed[] = [
  {
    question_text: "Consider the following statements regarding the Assam Accord of 1985:\n1. 1st January 1966 was fixed as the base date for regularizing foreign nationals.\n2. All persons who entered Assam between 1st January 1966 and 24th March 1971 were to be disenfranchised for 10 years.\nWhich of the statements is/are correct?",
    options: { A: "1 only", B: "2 only", C: "Both 1 and 2", D: "Neither 1 nor 2" },
    correct_answer: "C",
    explanation: "Both statements are correct. The Assam Accord provided that pre-1966 entrants are citizens, 1966-1971 entrants lose voting rights for 10 years, and post-24 March 1971 entrants are to be detected and expelled.",
    difficulty: "HARD"
  },
  {
    question_text: "Under the Government of India Act 1935, who was the first Prime Minister (Premier) of Assam province in 1937?",
    options: { A: "Gopinath Bordoloi", B: "Sir Syed Muhammad Saadulla", C: "Tarun Ram Phukan", D: "Bishnuram Medhi" },
    correct_answer: "B",
    explanation: "Sir Syed Muhammad Saadulla of the Muslim League headed the first ministry of Assam in April 1937 under the 1935 Act.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Which Article of the Indian Constitution grants special provisions to the state of Assam regarding the Legislative Assembly and tribal areas?",
    options: { A: "Article 371A", B: "Article 371B", C: "Article 371C", D: "Article 371D" },
    correct_answer: "B",
    explanation: "Article 371B deals with special provisions with respect to the State of Assam (Sixth Schedule District Councils).",
    difficulty: "MEDIUM"
  },
  {
    question_text: "The famous tea discovery in Assam by Robert Bruce took place with the guidance of which indigenous nobleman?",
    options: { A: "Maniram Dewan", B: "Piyoli Phukan", C: "Bishnu Prasad Rabha", D: "Kushal Konwar" },
    correct_answer: "A",
    explanation: "Maniram Dutta Baruah (Maniram Dewan) introduced Robert Bruce to the Singpho chief Bisa Gam, who showed indigenous Camellia sinensis tea plants in 1823.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "Majuli, the world's largest river island, was officially declared the first island district of India in which year?",
    options: { A: "2014", B: "2016", C: "2018", D: "2020" },
    correct_answer: "B",
    explanation: "Majuli was upgraded to a full revenue district in September 2016, becoming the first river island district in India.",
    difficulty: "EASY"
  }
];

const tetQuestions: QuestionSeed[] = [
  {
    question_text: "According to Jean Piaget's stages of cognitive development, the 'Concrete Operational Stage' spans which age group?",
    options: { A: "Birth to 2 years", B: "2 to 7 years", C: "7 to 11 years", D: "11 years and above" },
    correct_answer: "C",
    explanation: "Piaget's Concrete Operational stage occurs between ages 7 and 11, where children develop logical thought about concrete events.",
    difficulty: "MEDIUM"
  },
  {
    question_text: "The concept of 'Zone of Proximal Development' (ZPD) was introduced by:",
    options: { A: "B. F. Skinner", B: "Lev Vygotsky", C: "Jerome Bruner", D: "Howard Gardner" },
    correct_answer: "B",
    explanation: "Lev Vygotsky introduced the Zone of Proximal Development (ZPD) as the difference between what a learner can do independently and with guidance.",
    difficulty: "EASY"
  },
  {
    question_text: "The Right to Free and Compulsory Education (RTE) Act 2009 came into national effect on:",
    options: { A: "1st April 2010", B: "26th January 2009", C: "15th August 2010", D: "2nd October 2009" },
    correct_answer: "A",
    explanation: "Although enacted in August 2009, the RTE Act officially came into legal force throughout India on 1st April 2010.",
    difficulty: "EASY"
  },
  {
    question_text: "Which of the following is the most effective approach for handling diverse learning styles in an inclusive classroom?",
    options: {
      A: "Differentiated Instruction",
      B: "Strict Standardized Testing",
      C: "Separating students by IQ score",
      D: "Rote memorization drills"
    },
    correct_answer: "A",
    explanation: "Differentiated instruction adapts teaching pace, content, and medium to cater to the diverse cognitive needs of all students.",
    difficulty: "MEDIUM"
  }
];

async function seedMockTests() {
  console.log("=== Seeding Mock Tests and Questions ===");

  const { data: exams } = await supabase.from('prep_exams').select('id, title, slug');
  const { data: tests } = await supabase.from('prep_mock_tests').select('id, title, exam_id');

  if (!tests || tests.length === 0) {
    console.error("No mock tests found in prep_mock_tests");
    return;
  }

  const examMap = new Map((exams || []).map(e => [e.slug, e.id]));
  const adreId = examMap.get('adre-assam-direct-recruitment');
  const policeId = examMap.get('assam-police-recruitment');
  const apscId = examMap.get('apsc-cce');
  const tetId = examMap.get('assam-tet');

  // Map questions to tests
  const testAssignments: { testId: string; questions: QuestionSeed[]; examId?: string }[] = [];

  for (const test of tests) {
    const tTitle = test.title.toLowerCase();
    if (tTitle.includes('english')) {
      testAssignments.push({ testId: test.id, questions: englishQuestions, examId: test.exam_id || adreId });
    } else if (tTitle.includes('grade iii') || tTitle.includes('speed drill')) {
      testAssignments.push({ testId: test.id, questions: adreQuestions, examId: test.exam_id || adreId });
    } else if (tTitle.includes('grade iv')) {
      testAssignments.push({ testId: test.id, questions: [...adreQuestions.slice(3, 9), ...englishQuestions.slice(0, 4)], examId: test.exam_id || adreId });
    } else if (tTitle.includes('police') || tTitle.includes('constable') || tTitle.includes('sub-inspector')) {
      testAssignments.push({ testId: test.id, questions: assamPoliceQuestions, examId: test.exam_id || policeId });
    } else if (tTitle.includes('apsc')) {
      testAssignments.push({ testId: test.id, questions: apscQuestions, examId: test.exam_id || apscId });
    } else if (tTitle.includes('tet')) {
      testAssignments.push({ testId: test.id, questions: tetQuestions, examId: test.exam_id || tetId });
    } else {
      // Default general mix
      testAssignments.push({ testId: test.id, questions: [...adreQuestions.slice(0, 5), ...englishQuestions.slice(0, 5)], examId: test.exam_id || adreId });
    }
  }

  console.log(`Found ${testAssignments.length} tests to seed with questions.`);

  for (const assignment of testAssignments) {
    console.log(`\nProcessing Test: ${assignment.testId}`);

    // Clean existing test questions for idempotent rerun
    await supabase.from('prep_mock_test_questions').delete().eq('test_id', assignment.testId);

    const questionIds: string[] = [];

    for (const q of assignment.questions) {
      // Check if question with exact text already exists
      const { data: existingQ } = await supabase
        .from('prep_questions')
        .select('id')
        .eq('question_text', q.question_text)
        .maybeSingle();

      let qId: string;
      if (existingQ) {
        qId = existingQ.id;
        // Ensure published status
        await supabase.from('prep_questions').update({ status: 'PUBLISHED' }).eq('id', qId);
      } else {
        const { data: newQ, error: qErr } = await supabase.from('prep_questions').insert({
          id: crypto.randomUUID(),
          exam_id: assignment.examId || null,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          status: 'PUBLISHED'
        }).select('id').single();

        if (qErr) {
          console.error("Error inserting question:", qErr.message);
          continue;
        }
        qId = newQ.id;
      }
      questionIds.push(qId);
    }

    // Insert into prep_mock_test_questions
    const joinRows = questionIds.map((qid, idx) => ({
      test_id: assignment.testId,
      question_id: qid,
      order_index: idx
    }));

    if (joinRows.length > 0) {
      const { error: joinErr } = await supabase.from('prep_mock_test_questions').insert(joinRows);
      if (joinErr) {
        console.error("Error inserting mock test question mappings:", joinErr.message);
      } else {
        console.log(`✓ Mapped ${joinRows.length} questions to test.`);
      }

      // Update test total marks
      await supabase.from('prep_mock_tests').update({
        total_marks: joinRows.length,
        status: 'PUBLISHED'
      }).eq('id', assignment.testId);
    }
  }

  console.log("\n=== Seeding Finished Successfully ===");
}

seedMockTests().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
