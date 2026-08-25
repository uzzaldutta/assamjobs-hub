import re

def update_questions(file_path, new_questions_js):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find the QUESTIONS array
    pattern = re.compile(r'const QUESTIONS = \[.*?\];', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(f'const QUESTIONS = {new_questions_js};', content)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"Could not find QUESTIONS array in {file_path}")

gk_questions = """[
  {
    id: 1,
    question: "Assam’s capital city is:",
    options: ["Guwahati", "Dispur", "Jorhat", "Silchar"],
    answer: 1,
    explanation: "Dispur became the capital of Assam in 1973, shifting from Shillong."
  },
  {
    id: 2,
    question: "The largest city of Assam is:",
    options: ["Dispur", "Guwahati", "Tezpur", "Dibrugarh"],
    answer: 1,
    explanation: "Guwahati is the largest city in Assam and the largest metropolis in Northeast India."
  },
  {
    id: 3,
    question: "Assam’s Kaziranga National Park lies along which river’s bank?",
    options: ["Barak", "Brahmaputra", "Subansiri", "Manas"],
    answer: 1,
    explanation: "Kaziranga National Park lies along the mighty Brahmaputra river."
  },
  {
    id: 4,
    question: "The Ahom capital was later shifted to:",
    options: ["Charaideo", "Sivasagar", "Guwahati", "Tezpur"],
    answer: 1,
    explanation: "The Ahom capital was shifted to Sivasagar (formerly Rangpur/Garhgaon area) by later kings."
  },
  {
    id: 5,
    question: "Mahatma Gandhi was born in the year:",
    options: ["1869", "1875", "1885", "1890"],
    answer: 0,
    explanation: "Mahatma Gandhi was born on October 2, 1869, in Porbandar, Gujarat."
  },
  {
    id: 6,
    question: "Sukaphaa, founder of the Ahom kingdom, established his capital at:",
    options: ["Sivasagar", "Charaideo", "Guwahati", "Dibrugarh"],
    answer: 1,
    explanation: "Charaideo was the first capital of the Ahom kingdom established by Sukaphaa in 1253."
  },
  {
    id: 7,
    question: "Rongali (Bohag) Bihu, marking the Assamese New Year, is celebrated in which month?",
    options: ["January", "April", "October", "August"],
    answer: 1,
    explanation: "Rongali Bihu is celebrated in mid-April, marking the onset of the Assamese New Year and the coming of Spring."
  },
  {
    id: 8,
    question: "The first Assamese-language newspaper, published in 1846, was:",
    options: ["Asom Bandhu", "Orunodoi", "Natun Asomiya", "Assam Tribune"],
    answer: 1,
    explanation: "Orunodoi was the first Assamese-language magazine, published from Sivasagar in 1846 by American Baptist Missionaries."
  },
  {
    id: 9,
    question: "Majuli, located in Assam, is recognised as the world’s largest:",
    options: ["Delta", "River island", "Wetland", "Mangrove forest"],
    answer: 1,
    explanation: "Majuli is the world's largest river island, located on the Brahmaputra River."
  },
  {
    id: 10,
    question: "The state song of Assam, ‘O Mur Apunar Desh’, was written by:",
    options: ["Lakshminath Bezbaroa", "Hem Baruah", "Jyoti Prasad Agarwala", "Nabin Chandra Bordoloi"],
    answer: 0,
    explanation: "It was written by Lakshminath Bezbaroa, a prominent figure in modern Assamese literature."
  }
]"""

english_questions = """[
  {
    id: 1,
    question: "Choose the correct synonym of ‘Brave’:",
    options: ["Timid", "Courageous", "Weak", "Careless"],
    answer: 1,
    explanation: "Courageous is the exact synonym for Brave."
  },
  {
    id: 2,
    question: "Choose the correct antonym of ‘Genuine’:",
    options: ["Real", "Fake", "Honest", "True"],
    answer: 1,
    explanation: "Fake is the exact opposite (antonym) of Genuine."
  },
  {
    id: 3,
    question: "Choose the correctly spelt word:",
    options: ["Necessary", "Neccessary", "Necesary", "Neccesary"],
    answer: 0,
    explanation: "'Necessary' is spelt with one 'c' and double 's'."
  },
  {
    id: 4,
    question: "Choose the correct verb: “The team ___ playing well this season.”",
    options: ["is", "are", "were", "be"],
    answer: 0,
    explanation: "The word 'team' is a collective noun and typically takes a singular verb ('is') when acting as a single unit."
  },
  {
    id: 5,
    question: "The idiom ‘a piece of cake’ means:",
    options: ["A dessert", "Something very easy", "A small gift", "A difficult task"],
    answer: 1,
    explanation: "If a task is 'a piece of cake', it means it is extremely easy to complete."
  },
  {
    id: 6,
    question: "Choose the correct article: “She is ___ university student.”",
    options: ["a", "an", "the", "no article"],
    answer: 0,
    explanation: "We use 'a' before 'university' because it starts with a consonant 'yoo' sound, not a vowel sound."
  },
  {
    id: 7,
    question: "Choose the correct synonym of ‘Diligent’:",
    options: ["Lazy", "Hardworking", "Careless", "Slow"],
    answer: 1,
    explanation: "Diligent means showing care and conscientiousness in one's work or duties (Hardworking)."
  },
  {
    id: 8,
    question: "One-word substitution: ‘One who cannot read or write’:",
    options: ["Illiterate", "Innocent", "Ignorant", "Incompetent"],
    answer: 0,
    explanation: "Illiterate refers to a person who is unable to read or write."
  },
  {
    id: 9,
    question: "Choose the correct passive voice of: “They built a bridge.”",
    options: ["A bridge was built by them.", "A bridge is built by them.", "A bridge built by them.", "A bridge has build by them."],
    answer: 0,
    explanation: "The past simple 'built' becomes 'was built' in the passive voice."
  },
  {
    id: 10,
    question: "The idiom ‘spill the beans’ means:",
    options: ["To waste food", "To reveal a secret", "To cook dinner", "To argue"],
    answer: 1,
    explanation: "'Spill the beans' is a common idiom meaning to accidentally or prematurely reveal secret information."
  }
]"""

reasoning_questions = """[
  {
    id: 1,
    question: "Find the next term: 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "54"],
    answer: 2,
    explanation: "The series doubles each time: 3x2=6, 6x2=12, 12x2=24, so 24x2 = 48."
  },
  {
    id: 2,
    question: "The opposite direction of East is:",
    options: ["North", "South", "West", "North-West"],
    answer: 2,
    explanation: "West is exactly 180 degrees opposite to East on a compass."
  },
  {
    id: 3,
    question: "If DOG is coded as EPH, then CAT would be coded as:",
    options: ["DBU", "DCU", "DBV", "CBU"],
    answer: 0,
    explanation: "Each letter is shifted 1 position forward in the alphabet (D->E, O->P, G->H). Applying this to CAT: C->D, A->B, T->U."
  },
  {
    id: 4,
    question: "The daughter of my father’s sister is my:",
    options: ["Sister", "Cousin", "Aunt", "Niece"],
    answer: 1,
    explanation: "Your father's sister is your aunt. Her daughter is your cousin."
  },
  {
    id: 5,
    question: "Find the missing number: 5, 10, 15, ?, 25",
    options: ["18", "19", "20", "22"],
    answer: 2,
    explanation: "The series increases by 5 each time: 5, 10, 15, 20, 25."
  },
  {
    id: 6,
    question: "Find the next number in the series: 4, 8, 16, 32, ?",
    options: ["48", "56", "64", "72"],
    answer: 2,
    explanation: "Each number is multiplied by 2 to get the next. 32 x 2 = 64."
  },
  {
    id: 7,
    question: "Fish is related to Water in the same way as Bird is related to:",
    options: ["Nest", "Air", "Tree", "Egg"],
    answer: 1,
    explanation: "A fish moves and lives primarily in water, just as a bird flies and moves primarily in the air."
  },
  {
    id: 8,
    question: "Facing East, a man turns 90° anticlockwise and then 90° clockwise. He is now facing:",
    options: ["North", "South", "East", "West"],
    answer: 2,
    explanation: "A 90 degree turn left followed by a 90 degree turn right leaves him in the exact original direction (East)."
  },
  {
    id: 9,
    question: "If Sunday is the 1st day of the week, which day corresponds to the 6th day?",
    options: ["Thursday", "Friday", "Saturday", "Monday"],
    answer: 1,
    explanation: "1-Sun, 2-Mon, 3-Tue, 4-Wed, 5-Thu, 6-Fri."
  },
  {
    id: 10,
    question: "A woman said, “He is the son of my husband’s sister.” How is the boy related to the woman?",
    options: ["Son", "Nephew", "Brother", "Cousin"],
    answer: 1,
    explanation: "Her husband's sister is her sister-in-law. The son of a sister-in-law is a nephew."
  }
]"""

update_questions(r'src\app\mock-tests\assam-gk\page.tsx', gk_questions)
update_questions(r'src\app\mock-tests\english-grammar\page.tsx', english_questions)
update_questions(r'src\app\mock-tests\logical-reasoning\page.tsx', reasoning_questions)
