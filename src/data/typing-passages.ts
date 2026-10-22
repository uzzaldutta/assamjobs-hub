export interface TypingPassage {
  id: string;
  title: string;
  category: 'tough' | 'secretariat' | 'legal' | 'assam' | 'technical' | 'numbers';
  difficulty: 'Medium' | 'Hard' | 'Extreme';
  text: string;
}

export const TOUGH_WORDS_BANK: string[] = [
  // Administrative & Bureaucratic
  "bureaucracy", "accountability", "remuneration", "superannuation", "corrigendum",
  "exchequer", "gazetteer", "ombudsman", "relinquishment", "misallocation",
  "disqualification", "insubordination", "conscientiousness", "misappropriation", "indemnification",
  "apportionment", "decentralization", "infrastructure", "reconnaissance", "surveillance",
  "absenteeism", "counterintuitive", "circumstantial", "quintessential", "disenfranchisement",
  "compartmentalization", "gubernatorial", "uncharacteristic", "incomprehensibility", "oversimplification",
  "institutionalization", "interdisciplinary", "disproportionate", "unconstitutional", "interoperability",
  "recommendation", "authentication", "vulnerability", "chronological", "differentiation",
  "representation", "straightforward", "misunderstand", "unconventional", "telecommunication",
  "characteristic", "simultaneously", "conscientiously", "authoritarianism", "totalitarianism",
  "internationalization", "multidimensional", "counterproductive", "misinterpretation", "uncompromising",
  "unconventionality", "overgeneralization", "indistinguishable", "nonconfrontational", "mischaracterization",
  "reconceptualizing", "revolutionizing", "recontextualizing", "contextualization", "institutionalize",
  "interrelationship", "counterintelligence", "disproportionately", "indistinguishably", "uncompromisingly",
  "phenomenological", "incomprehensible", "transcendentalism", "extraterritorial", "psychosomatic",
  "biocompatibility", "synchronization", "spectrophotometer", "cinematography", "historiography",
  "lexicography", "crystallography", "oceanography", "sociolinguistics", "psycholinguistics",
  "anthropomorphism", "autobiographical", "characteristically", "environmentally", "enthusiastically",
  "internationally", "psychologically", "philosophically", "physiologically", "systematically",
  "administratively", "mathematically", "computationally", "technologically", "scientifically",
  "institutionally", "geographically", "constitutionally", "circumstantially", "probabilistically",
  "instantaneously", "extraordinarily", "overwhelmingly", "straightforwardly", "unsophisticated",
  
  // High-Vocabulary & Spelling Challenges
  "acquiescence", "idiosyncrasy", "supercilious", "recalcitrance", "grandiloquence",
  "magniloquence", "surreptitious", "perspicacious", "magnanimous", "pusillanimous",
  "verisimilitude", "sesquipedalian", "obsequious", "fastidious", "recalcitrant",
  "pernicious", "ubiquitous", "ephemeral", "cacophony", "serendipitous",
  "parsimonious", "pusillanimity", "anachronistic", "antediluvian", "circumlocution",
  "discombobulate", "ebullient", "equanimity", "grandiloquent", "inchoate",
  "intransigent", "mellifluous", "munificent", "nefarious", "obfuscate",
  "panegyric", "perniciousness", "proclivity", "pugnacious", "quixotic",
  "recondite", "salubrious", "sycophant", "taciturn", "truculent",
  "ubiquity", "vacillate", "vicissitude", "zealous", "aberration",
  "belligerent", "capricious", "debilitate", "eclectic", "facetious",
  "garrulous", "harangue", "iconoclast", "juxtaposition", "labyrinthine",
  "maelstrom", "nadir", "ostentatious", "paradoxical", "querulous",
  "rancorous", "sagacious", "tenebrous", "unctuous", "venerable",
  
  // Governance, Legal & Statutory
  "adjudication", "jurisprudence", "affidavit", "petitioner", "respondent",
  "sovereignty", "bicameral", "plebiscite", "subpoena", "prerogative",
  "ordinance", "promulgation", "judicature", "extradition", "statutory",
  "quashment", "injunction", "arbitration", "conciliatory", "tribunal",
  "plenipotentiary", "jurisdiction", "sovereign", "naturalization", "hereditary",
  "proportionality", "secularism", "parliamentary", "subdelegation", "amendment",
  "nullification", "ratification", "litigation", "appellate", "cognizable",
  
  // Assam Heritage, Administrative Geography & Geography
  "Brahmaputra", "Kaziranga", "Charaideo", "Lachit", "Borphukan",
  "Sukapha", "Rangghar", "Karengghar", "Talatalghar", "Srimanta",
  "Sankardev", "Madhavdev", "Bordowa", "Kamakhya", "Nilachal",
  "Umananda", "Barpeta", "Majuli", "Sualkuchi", "Dibrugarh",
  "Silchar", "Tezpur", "Jorhat", "Golaghat", "Sivasagar",
  "Bongaigaon", "Karbi", "Anglong", "Dima", "Hasao",
  "Kokrajhar", "Morigaon", "Nagaon", "Darrang", "Udalguri",
  "Sonitpur", "Biswanath", "Lakhimpur", "Dhemaji", "Tinsukia",
  "Cachar", "Hailakandi", "Karimganj", "Dhubri", "Goalpara",
  "Vaishnavite", "Sattriya", "Moidam", "Ahom", "Koch",
  "Kachari", "Chutia", "Dimasa", "Tiwa", "Rabha",
  "Mishing", "Bodo", "Karbi", "Garo", "Deori"
];

export const CURATED_PASSAGES: TypingPassage[] = [
  {
    id: 'passage-tough-1',
    title: 'Constitutional Jurisprudence & Public Administration',
    category: 'legal',
    difficulty: 'Extreme',
    text: 'Constitutionalism mandates rigorous institutional accountability, probity, and transparent administrative governance across all statutory bodies. The bureaucratic apparatus must systematically dismantle nepotism, absenteeism, and financial misappropriation while upholding the quintessential principles of equity and natural justice. Judicial pronouncements repeatedly emphasize that discretionary executive authority is neither absolute nor unconstrained, requiring conscientious adherence to established legislative jurisprudence.'
  },
  {
    id: 'passage-tough-2',
    title: 'Secretariat Dispatch & Official Procedure',
    category: 'secretariat',
    difficulty: 'Hard',
    text: 'In reference to the aforementioned memorandum, the competent authority has directed that all pending service verification dossiers be reconciled forthwith. Any discrepancy regarding superannuation gratuity, leave encashment calculations, or provisional pension disbursement must be rectified through an official corrigendum. Departmental heads are strictly cautioned that insubordination, unjustified procedural procrastination, or willful negligence shall invite disciplinary action under the civil service conduct rules.'
  },
  {
    id: 'passage-tough-3',
    title: 'Assam Archaeological Heritage & Historical Legacy',
    category: 'assam',
    difficulty: 'Hard',
    text: 'The archaeological splendors of the Ahom dynasty at Charaideo, Sivasagar, and Rangpur demonstrate architectural ingenuity, characterized by the subterranean chambers of Karengghar and monumental earthen mounds known as Moidams. Under the visionary generalship of Lachit Borphukan at the Battle of Saraighat in 1671, the indigenous forces leveraged naval maneuvers across the Brahmaputra to vanquish imperial expansionism, preserving the cultural sovereignty of medieval Assam.'
  },
  {
    id: 'passage-tough-4',
    title: 'Financial Auditing, CAG Scrutiny & Budget Allocation',
    category: 'secretariat',
    difficulty: 'Extreme',
    text: 'The statutory audit conducted by the Comptroller and Auditor General revealed substantial discrepancies in budgetary appropriation, procurement indemnification, and expenditure reconciliation. Public works departments failed to produce authenticated vouchers, resulting in unwarranted fiscal liability against the consolidated fund of the state exchequer. Rigorous financial oversight mandates quarterly reconciliation of non-tax revenue and prompt liquidation of unadjusted advances.'
  },
  {
    id: 'passage-tough-5',
    title: 'Environmental Ecology & Kaziranga Biodiversity',
    category: 'assam',
    difficulty: 'Hard',
    text: 'The ecologically sensitive wetlands of Kaziranga National Park and Pobitora Wildlife Sanctuary harbor the world’s quintessential stronghold of the endangered greater one-horned rhinoceros. Anthropogenic encroachment, seasonal inundated flooding along the Brahmaputra riparian corridor, and poaching cartels necessitate sophisticated drone surveillance, spatial telemetry, and uninterrupted forest patrol battalions to safeguard fragile biodiversity.'
  },
  {
    id: 'passage-tough-6',
    title: 'Cryptographic Security & Digital Public Infrastructure',
    category: 'technical',
    difficulty: 'Extreme',
    text: 'Modern digital public infrastructure requires asymmetric cryptographic authentication, decentralized microservices, and robust fault-tolerant architecture to resist adversarial cyber penetration. Interoperability protocols facilitate seamless data exchange between heterogeneous governmental repositories while enforcing end-to-end encryption and cryptographic hashing to preserve evidentiary non-repudiation.'
  },
  {
    id: 'passage-tough-7',
    title: 'Court Affidavit & Judicial Procedure',
    category: 'legal',
    difficulty: 'Hard',
    text: 'The learned counsel for the petitioner submitted an exhaustive rejoinder affidavit challenging the impugned administrative notification on grounds of procedural ultra vires and violation of statutory provisions. The division bench observed that circumstantial evidence cannot supersede documented legislative enactments, consequently remanding the interlocutory dispute to the appellate tribunal for de novo adjudication.'
  },
  {
    id: 'passage-tough-8',
    title: 'Complex Numerical & Official Symbol Proficiency Test',
    category: 'numbers',
    difficulty: 'Extreme',
    text: 'Pursuant to Notification No. AAP.142/2026/Pt-II/89, dated 15th October 2026, the sanction of Rs. 45,78,920/- (Rupees forty-five lakh seventy-eight thousand nine hundred twenty only) has been allocated under Head of Account: 2052-00-090-0145-000-01-01 [SDRF-Assam]. Approximately 68.75% of the total 1,250 posts have been reserved under §4(b) & §12(a); whereas 31.25% remain unreserved (UR).'
  },
  {
    id: 'passage-tough-9',
    title: 'Public Health Administration & Epidemiological Surveillance',
    category: 'tough',
    difficulty: 'Extreme',
    text: 'Comprehensive epidemiological surveillance requires real-time immunological monitoring, serological characterization of microbiological pathogens, and prompt prophylactic intervention. Public healthcare administrators must balance pharmaceutical supply logistics, quarantine enforcement protocols, and clinical triaging during syndromic outbreaks to mitigate asymptomatic community transmission.'
  },
  {
    id: 'passage-tough-10',
    title: 'Socio-Economic Development & Micro-Enterprise Governance',
    category: 'secretariat',
    difficulty: 'Medium',
    text: 'Empowerment of decentralized rural cooperatives and handloom artisans in Sualkuchi demands access to formal microfinance credit facilities, technical skill upgrading, and digital e-commerce aggregation. Government initiatives aim to eliminate intermediary exploitation, ensuring remunerative compensation and fostering self-reliant indigenous entrepreneurship across rural Assam.'
  }
];

/**
 * Generates an infinite variety of challenging typing passages composed of randomly sampled
 * high-difficulty vocabulary words, ensuring that candidates never encounter the same text twice.
 */
export function generateRandomToughPassage(wordCount: number = 55): string {
  // Shuffle words with Fisher-Yates
  const shuffled = [...TOUGH_WORDS_BANK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selectedWords = shuffled.slice(0, wordCount);
  
  // Assemble words into sentences with natural punctuation (commas, periods, capitalized beginnings)
  const sentences: string[] = [];
  let currentSentence: string[] = [];
  
  for (let i = 0; i < selectedWords.length; i++) {
    const word = selectedWords[i];
    currentSentence.push(word);
    
    // Create sentences of 7-12 words
    if (currentSentence.length >= 8 + Math.floor(Math.random() * 5) || i === selectedWords.length - 1) {
      // Capitalize first word
      currentSentence[0] = currentSentence[0].charAt(0).toUpperCase() + currentSentence[0].slice(1);
      
      // Optionally add a mid-sentence comma if sentence is long
      if (currentSentence.length > 8 && Math.random() > 0.4) {
        const commaIdx = Math.floor(currentSentence.length / 2);
        currentSentence[commaIdx] = currentSentence[commaIdx] + ",";
      }
      
      sentences.push(currentSentence.join(" ") + ".");
      currentSentence = [];
    }
  }

  return sentences.join(" ");
}
