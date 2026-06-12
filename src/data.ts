export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface Feature {
  id: string;
  name: string;
  module: string;
  description: string;
  whyUnique: string;
  emotion: string;
  tier: "Free" | "Premium" | "Pro" | "Enterprise";
}

export interface NameOption {
  name: string;
  whyResonant: string;
  tagline: string;
  archetype: string;
  colors: string;
  rationale: string;
}

export const STRATEGY_ANSWERS = {
  q1: {
    title: "Q1. What does a 23-year-old in Tier 2 India actually lie awake worrying about?",
    answer: `They don't lie awake crying about 'bad active voice' or 'incorrect prepositions'. 
    They lie awake worrying about **Status, Survival, and Shame**.
    
    1. **The Middle-Class Ceiling**: They have a Rs 15,000/month job at a local retailer, but they need Rs 45,000/month to stand proud in their family and pay off their educational loan. They know the premium jobs exist in high-rise tech parks, but they feel physically locked out.
    2. **The Shame of Silent Meetings**: They got hired by TCS/Infosys off-campus on technical skills, but they sit with their cameras off in global client standups, sweating that they will be asked a direct question and stutter.
    3. **The Unspoken Rejection**: Watching peers from English-medium schools walk away with 10 LPA packages, while they—despite being technically superior coders or analysts—get relegated to back-office support purely because they are 'un-presentable'. It is a visceral, existential dread of remaining unseen.`
  },
  q2: {
    title: "Q2. What does every English app get fundamentally wrong about motivation & behavior change?",
    answer: `Competitors (Duolingo, local grammar coach channels) treat English as a **school subject** with grammatical rule-memorization, daily streaks of matching bubble translations, and vocabulary quizzes. 
    
    This is flat wrong. Learning English is not a content problem; it is an **identity and confidence problem**.
    - People don't fail due to lack of dictionary definitions. They fail because of **speech-anxiety paralysis** (knowing the perfect word in their head but freezing once an elite speaker stares at them).
    - Gamifying grammar drills feels like doing chores. Gamifying *realistic negotiation, salary escalation, and high-pressure survival* creates absolute obsession because the reward is real, life-altering wealth.`
  },
  q3: {
    title: "Q3. If you removed the 'English learning' label entirely, what category does this product belong to?",
    answer: `It is a **Social Escalator & Economic Empowerment Engine**. 
    It is the transactional companion that converts locked-in regional potential into global corporate leverage. It is a communication simulator built to capture market value, disguised as a speaking app.`
  },
  q4: {
    title: "Q4. What is the ONE metric that proves this product is changing lives?",
    answer: `**The Salary Multiplier Ratio (SMR)**.
    Specifically: \`(User's CTC 120 days post-onboarding) / (User's CTC on Day 1)\`.
    If this ratio is under 1.5x across our active graduates, we are just an EdTech toy. If it is 2.5x+, we are an unstoppable economic movement.`
  }
};

export const PRODUCT_IDENTITY: NameOption[] = [
  {
    name: "SKILLONY",
    whyResonant: "Skillony combines 'Skill' and 'Symphony/Harmony', representing the seamless coordination of professional communication and technical prowess. It expresses high mastery of soft skills and structured fluency.",
    tagline: "Speak with Authority. Double your Salary.",
    archetype: "The Unstoppable Outlaw / Hero",
    colors: "Deep Charcoal Gray (#121214) with Electric Neon Cyan (#06b6d4) & Copper-Gold accents.",
    rationale: "Represents absolute modern power. High-contrast neon cyan symbolizes the spark of high ambition, while copper-gold represents the career wealth premium being unlocked."
  },
  {
    name: "AAROHAN",
    whyResonant: "Sanskrit for 'Ascension' or 'Climbing to the summit'. Speaks to the literal social ladder ascension that Tier 2 youth crave.",
    tagline: "Ascend the Corporate Ladder with Voice.",
    archetype: "The Sage / Creator",
    colors: "Sleek Carbon Blue with Emerald green accentuation.",
    rationale: "Emerald implies growth, compound wealth progress, and prestige."
  },
  {
    name: "VAKYA AI",
    whyResonant: "'Vakya' means structured expression or statement. Targets structured clarity of speech over chaotic translation.",
    tagline: "Your words, engineered for enterprise impact.",
    archetype: "The Ruler / Alchemist",
    colors: "Deep Cosmic Indigo with Royal White and Platinum.",
    rationale: "Invokes feeling of high-class global standard, perfect for BPO operations."
  }
];

export const MODULES_LIST = [
  { id: "A", name: "AI SPEAKING COACH" },
  { id: "B", name: "AI CAREER & INTERVIEW ENGINE" },
  { id: "C", name: "CONFIDENCE & PSYCHOLOGY LAYER" },
  { id: "D", name: "REAL-WORLD SCENARIOS" },
  { id: "E", name: "SOCIAL & COMPETITIVE LAYER" },
  { id: "F", name: "PERSONALIZATION ENGINE" },
  { id: "G", name: "PROOF & CREDIBILITY SYSTEM" },
  { id: "H", name: "ENTERPRISE & CAMPUS LAYER" }
];

export const FEATURES_DATA: Feature[] = [
  // MODULE A
  {
    id: "FEAT-001",
    name: "Swara Accent Adaptor",
    module: "A",
    description: "Aligns native articulation of complex sounds to clear, globally understood pronunciations.",
    whyUnique: "Focused on global comprehensibility, not dynamic mimicry of artificial Western accents.",
    emotion: "Relief",
    tier: "Free"
  },
  {
    id: "FEAT-002",
    name: "Executive Pausology",
    module: "A",
    description: "Monitors conversational pause frequency, replacing frantic, rushed sentences with impactful silence.",
    whyUnique: "Treats pausing as a display of power rather than an awkward gap in fluency.",
    emotion: "Control",
    tier: "Premium"
  },
  {
    id: "FEAT-003",
    name: "Tone Calibration Mirror",
    module: "A",
    description: "Real-time pitch and modulation analyzer that prevents defensive or overly submissive verbal styles.",
    whyUnique: "No competitor actively measures deference versus dominance in voice.",
    emotion: "Authority",
    tier: "Premium"
  },
  {
    id: "FEAT-004",
    name: "Filler Word Eliminator",
    module: "A",
    description: "Tracks micro-vocalizations ('uhm', 'actually', 'basically') sending screen-flash alerts on repetitive use.",
    whyUnique: "Uses instant visual reinforcement loops to intercept habits as they occur.",
    emotion: "Mindfulness",
    tier: "Free"
  },
  {
    id: "FEAT-005",
    name: "Corporate Pitch Tuner",
    module: "A",
    description: "Upgrades weak conversational openers to executive declarations suitable for project proposals.",
    whyUnique: "Connects sentence delivery strategies directly to investment proposal frameworks.",
    emotion: "Confidence",
    tier: "Pro"
  },
  {
    id: "FEAT-006",
    name: "Bilingual Pivot Detection (INVENTED 1)",
    module: "A",
    description: "Detects when the user switches to Hinglish or local mother tongue under cognitive strain and anchors them back.",
    whyUnique: "Never treats multilingual habits as a crime, but gently builds the natural bridge in real-time.",
    emotion: "Rescue",
    tier: "Premium"
  },
  {
    id: "FEAT-007",
    name: "High-Pressure Breath Coach (INVENTED 2)",
    module: "A",
    description: "Analyzes microphone-captured breath patterns to identify physiological adrenaline spikes before stuttering starts.",
    whyUnique: "Intervenes physically instead of linguistically, aligning breathing rhythm with speaking rate.",
    emotion: "Calm",
    tier: "Pro"
  },
  {
    id: "FEAT-008",
    name: "Decibel Domination (INVENTED 3)",
    module: "A",
    description: "Measures speech delivery volume assertion during mock disagreement scenarios to stop subordinate fading.",
    whyUnique: "Ensures Indian professionals retain equal weight in cross-border conversational dynamics.",
    emotion: "Empowerment",
    tier: "Premium"
  },
  {
    id: "FEAT-009",
    name: "Microphone Proximity Confidence",
    module: "A",
    description: "A hardware tuning system ensuring perfect vocal clarity and resonance during remote corporate meets.",
    whyUnique: "Addresses physical sound-capture confidence, which competitors completely disregard.",
    emotion: "Preparedness",
    tier: "Free"
  },
  {
    id: "FEAT-010",
    name: "The Indian Idiom Upgrader (INVENTED 4)",
    module: "A",
    description: "Rewrites direct Hindi/regional literal translations ('I am doing job since 2 years') to standard business syntax.",
    whyUnique: "Acknowledges the native grammar system and acts as an intelligent, real-time idiomatic compiler.",
    emotion: "Clarity",
    tier: "Premium"
  },

  // MODULE B
  {
    id: "FEAT-011",
    name: "Corporate Sandbox Interviewer",
    module: "B",
    description: "High-fidelity mock interviewing customized to the specific structural styles of service majors.",
    whyUnique: "Recreates company culture nuances rather than generic, dry technical questionnaires.",
    emotion: "Efficacy",
    tier: "Free"
  },
  {
    id: "FEAT-012",
    name: "Salary Leverage Predictor",
    module: "B",
    description: "Analyzes conversational poise during negotiation mocks and calculates estimated CTC hikes.",
    whyUnique: "Links articulation directly to money in real-time.",
    emotion: "Anticipation",
    tier: "Premium"
  },
  {
    id: "FEAT-013",
    name: "Offer Letter Loophole Finder",
    module: "B",
    description: "Scans offers and trains users to verbally challenge unfair clauses during the final conversion calls.",
    whyUnique: "Converts legal contracts into assertiveness practice scenarios.",
    emotion: "Shield",
    tier: "Pro"
  },
  {
    id: "FEAT-014",
    name: "LinkedIn Oral Auditory Review",
    module: "B",
    description: "Provides vocal scripts and feedback for the 'About Me' audio introduction segment on professional profiles.",
    whyUnique: "Optimizes the literal 'voice' profile, which recruiter search engines are prioritizing.",
    emotion: "Pride",
    tier: "Premium"
  },
  {
    id: "FEAT-015",
    name: "Resume Keyword Voice Aligner",
    module: "B",
    description: "Asks structured verbal questions mapped directly to claims on the candidate's custom resume.",
    whyUnique: "Tests if users can actually defend their written credentials dynamically and and confidently.",
    emotion: "Verification",
    tier: "Free"
  },
  {
    id: "FEAT-016",
    name: "The TCS Readiness Glass Ceiling (INVENTED 5)",
    module: "B",
    description: "Simulates the rigorous, unforgiving client-readiness screening used by TCS/Infosys before onshore allocation.",
    whyUnique: "Simulates the exact gatekeeping process that locks developers into low-wage benches.",
    emotion: "Grit",
    tier: "Premium"
  },
  {
    id: "FEAT-017",
    name: "The Poker-Face Interviewer (INVENTED 6)",
    module: "B",
    description: "An AI interviewer that stays deadpan—never smiling, nodding, or giving positive reinforcement.",
    whyUnique: "Trains core psychological resilience under highly stressful corporate evaluation scenarios.",
    emotion: "Steadfastness",
    tier: "Pro"
  },
  {
    id: "FEAT-018",
    name: "Colleague Interruption Intercepter (INVENTED 7)",
    module: "B",
    description: "Simulates aggressive colleagues cutting you off in real time and trains assertive reclamation phrases.",
    whyUnique: "EdTech teaches polite compliance; we teach tactical boardroom dominance.",
    emotion: "Vitality",
    tier: "Premium"
  },
  {
    id: "FEAT-019",
    name: "The Equity-to-CTC Voice Translator (INVENTED 8)",
    module: "B",
    description: "Complex negotiation simulations comparing startup stocks, base salaries, and performance milestones.",
    whyUnique: "Directly solves high-end startup offer negotiation with technical and conversational mechanics.",
    emotion: "Strategy",
    tier: "Pro"
  },
  {
    id: "FEAT-020",
    name: "Notice Period Exit Negotiator (INVENTED 9)",
    module: "B",
    description: "Voice-driven simulations to confront and negotiate short notice periods with defensive HR managers.",
    whyUnique: "Speeds up transition times when taking newer, higher-income positions.",
    emotion: "Liberation",
    tier: "Premium"
  },

  // MODULE C
  {
    id: "FEAT-021",
    name: "Imposter Syndrome Companion",
    module: "C",
    description: "Reflects and breaks down cognitive distortions about communication inadequacy in corporate setups.",
    whyUnique: "Treats verbal fear as a transient psychological friction, not a permanent intellectual deficit.",
    emotion: "Empathy",
    tier: "Free"
  },
  {
    id: "FEAT-022",
    name: "Somatic Rejection Shield",
    module: "C",
    description: "High-intensity verbal drills that habituate users to rejections, decoupling speaking failure from self-worth.",
    whyUnique: "No competitor actively builds failure resilience modules.",
    emotion: "Fearlessness",
    tier: "Premium"
  },
  {
    id: "FEAT-023",
    name: "Confidence Score Timeline",
    module: "C",
    description: "A visually gorgeous graph showing user verbal assertiveness scaling over multiple conversational sessions.",
    whyUnique: "Measures vocal tone microdata to plot genuine self-confidence and delivery flow.",
    emotion: "Triumph",
    tier: "Free"
  },
  {
    id: "FEAT-024",
    name: "Fear of Public Speaking Graph",
    module: "C",
    description: "Uses biometric analysis of voice vibration to outline conversational stress triggers.",
    whyUnique: "Scientific vocal analysis replaces subjective, vague intuition.",
    emotion: "Self-Knowledge",
    tier: "Premium"
  },
  {
    id: "FEAT-025",
    name: "The Desi Shame De-Conditioner (INVENTED 10)",
    module: "C",
    description: "A tailored module targeting the specific trauma of speaking faulty English in front of snobbish peers.",
    whyUnique: "Addresses India's deep-rooted post-colonial linguistic divide head-on.",
    emotion: "Healing",
    tier: "Premium"
  },
  {
    id: "FEAT-026",
    name: "Mother-Tongue Pride Buffer (INVENTED 11)",
    module: "C",
    description: "Analyzes regional accents and highlights them as prestigious cultural assets while retaining clarity.",
    whyUnique: "Decouples accent modification from identity erasure; we build clear, authentic champions.",
    emotion: "Dignity",
    tier: "Free"
  },
  {
    id: "FEAT-027",
    name: "The Sudden-Spotlight Prompt (INVENTED 12)",
    module: "C",
    description: "Spontaneously prompts the user (with flash notifications) to speak on a random boardroom crisis topic with zero prep.",
    whyUnique: "Engages cognitive reflexes to end verbal freezing during unscripted office discussions.",
    emotion: "Agility",
    tier: "Premium"
  },
  {
    id: "FEAT-028",
    name: "Critical HR Poker-Face Coach (INVENTED 13)",
    module: "C",
    description: "Monitors vocally tremors when confronted with hostile HR gaslighting techniques, teaching stable pacing.",
    whyUnique: "Ensures the candidate retains complete emotional composure and posture under hostile scrutiny.",
    emotion: "Security",
    tier: "Pro"
  },

  // MODULE D
  {
    id: "FEAT-029",
    name: "Cold Voice Pitch Architect",
    module: "D",
    description: "Guides user to record high-converting verbal elevator pitches targeting global decision-makers.",
    whyUnique: "Focused on conversion outcomes: generating active callbacks, not theoretical fluency.",
    emotion: "Ambition",
    tier: "Free"
  },
  {
    id: "FEAT-030",
    name: "Client Presentation Coach",
    module: "D",
    description: "Constructs voice outlines and pacing matrices for major business deliverables.",
    whyUnique: "We optimize for global client standards: persuasive, direct, and structured.",
    emotion: "Focus",
    tier: "Premium"
  },
  {
    id: "FEAT-031",
    name: "Daily Standup Status Streamliner",
    module: "D",
    description: "Helps users state what they did, what they are doing, and blockers in under 60 crisp seconds.",
    whyUnique: "Stops engineers from rambling and ensures they project visible value.",
    emotion: "Precision",
    tier: "Free"
  },
  {
    id: "FEAT-032",
    name: "Performance Appraisal Self-Advocacy",
    module: "D",
    description: "Provides realistic practice to claim credit, quote key metrics, and counter hostile management feedback.",
    whyUnique: "Provides physical scripts for the most critical 30 minutes in an employee's annual cycle.",
    emotion: "Power",
    tier: "Premium"
  },
  {
    id: "FEAT-033",
    name: "Escalation Response Simulator",
    module: "D",
    description: "Simulates direct fire drills: answering voice messages from angry project stakeholders.",
    whyUnique: "Teaches defensive structured communication under massive functional distress.",
    emotion: "Calmness",
    tier: "Premium"
  },
  {
    id: "FEAT-034",
    name: "B2B Client Ghosting Reviver (INVENTED 14)",
    module: "D",
    description: "Teaches exactly how to verbally nudge stalled partners without sounding desperate or meek.",
    whyUnique: "Solves a major communication bottleneck for young freelancers and agency founders.",
    emotion: "Success",
    tier: "Premium"
  },
  {
    id: "FEAT-035",
    name: "Apology-to-Advocacy Converter (INVENTED 15)",
    module: "D",
    description: "An AI translator that replaces subordinate expressions like 'Sorry for late reply' with 'Thank you for your patience'.",
    whyUnique: "Reroutes linguistic power paradigms from compliance to high executive authority.",
    emotion: "Dignity",
    tier: "Free"
  },
  {
    id: "FEAT-036",
    name: "Informal Chai-Networking Partner (INVENTED 16)",
    module: "D",
    description: "Teaches informal small-talk, organic bonding, and localized humor vital for corporate project allocations.",
    whyUnique: "Fills the social gap other apps ignore—where 80% of business relationships are cemented.",
    emotion: "Belonging",
    tier: "Premium"
  },
  {
    id: "FEAT-037",
    name: "Client Call Shouting Dampener (INVENTED 17)",
    module: "D",
    description: "Simulates real shouting, aggressive verbal confrontations, and trains calming de-escalation pitches.",
    whyUnique: "Trains core survival tactics for high-pressure support and account leadership roles.",
    emotion: "Thick-Skin",
    tier: "Pro"
  },
  {
    id: "FEAT-038",
    name: "Cross-Cultural Idiom Translator (INVENTED 18)",
    module: "D",
    description: "Maps and practices localized US/UK idioms so developers understand client conversations flawlessly.",
    whyUnique: "Stops awkward pauses in conversation by translating native business slang directly.",
    emotion: "Integration",
    tier: "Premium"
  },

  // MODULE E
  {
    id: "FEAT-039",
    name: "Speaking Battle (1v1)",
    module: "E",
    description: "Real-time, peer-to-peer 1v1 verbal duels on impromptu topics judged objectively by AI.",
    whyUnique: "Bypasses isolating single-player lessons for high-intensity, addictive competitive growth.",
    emotion: "Excitement",
    tier: "Free"
  },
  {
    id: "FEAT-040",
    name: "Cohort Accountability Squads",
    module: "E",
    description: "Small circles of 5 job-seekers locked in a mutual placement sprint with weekly live feedback loops.",
    whyUnique: "Leverages intense peer support to achieve 3x baseline retention.",
    emotion: "Camaraderie",
    tier: "Premium"
  },
  {
    id: "FEAT-041",
    name: "Global Speaking Leaderboard",
    module: "E",
    description: "A prestigious list showcasing top communicators, drawing heavy recruiter traffic.",
    whyUnique: "Directly connects game status with active placements.",
    emotion: "Honor",
    tier: "Free"
  },
  {
    id: "FEAT-042",
    name: "Company-Specific Prep Rooms",
    module: "E",
    description: "Live channels where users currently applying to target firms (e.g. Accenture) practice together.",
    whyUnique: "Converts study groups into tactical placement command headquarters.",
    emotion: "Security",
    tier: "Premium"
  },
  {
    id: "FEAT-043",
    name: "The 'Aukaat' Challenge (INVENTED 19)",
    module: "E",
    description: "Blind speaking tournaments where users pitch from identical scripts and get raw peer rankings.",
    whyUnique: "Strips away elite bias (accents, backgrounds) to reward authentic, raw communication fire.",
    emotion: "Fire",
    tier: "Premium"
  },
  {
    id: "FEAT-044",
    name: "The Crisis Boardroom Rally (INVENTED 20)",
    module: "E",
    description: "A 4-user real-time speaking sandbox simulating a critical company server crash or stock dip.",
    whyUnique: "Teaches rapid, structured verbal alignment in high-stakes, realistic social spaces.",
    emotion: "Mastery",
    tier: "Pro"
  },
  {
    id: "FEAT-045",
    name: "Regional Mentor Match (INVENTED 21)",
    module: "E",
    description: "Bridges top-performing rural speakers with alumni of top systems integrators for mentorship.",
    whyUnique: "Taps into professional pride networks rather than paid teaching operations.",
    emotion: "Gratitude",
    tier: "Enterprise"
  },
  {
    id: "FEAT-046",
    name: "Whisper-Peer Mentoring Networks (INVENTED 22)",
    module: "E",
    description: "Allows high-tier peers to silently whisper instant coaching prompts to active speaking users.",
    whyUnique: "Creates an energetic, collaborative multiplayer learning environment.",
    emotion: "Support",
    tier: "Premium"
  },

  // MODULE F (Personalization)
  {
    id: "FEAT-047",
    name: "Dialect-Aware Translation Key",
    module: "F",
    description: "Understands localized idioms and maps them instantly to clean global phrasing.",
    whyUnique: "Speeds up articulation by optimizing rather than punishing regional instincts.",
    emotion: "Relief",
    tier: "Free"
  },
  {
    id: "FEAT-048",
    name: "Industry-Specific Jargon Path",
    module: "F",
    description: "Tailor-made speech training for specialized roles (Finance, Logistics, Tech, Healthcare).",
    whyUnique: "Replaces general English with targeted, functional professional syntax.",
    emotion: "Authority",
    tier: "Premium"
  },
  {
    id: "FEAT-049",
    name: "Mother-Tongue Influence MTI Corrector",
    module: "F",
    description: "Corrects regional mother-tongue articulation traps common to specific Indian states.",
    whyUnique: "Understands localized physics of speech distortion directly.",
    emotion: "Awakening",
    tier: "Free"
  },
  {
    id: "FEAT-050",
    name: "The Pincode Accent Re-mapper (INVENTED 23)",
    module: "F",
    description: "An ultra-localized calibration engine tuned to specific accents of sub-districts (e.g. Bihar, rural TN).",
    whyUnique: "No competitor has a dialect map this localized or respect-driven.",
    emotion: "Focus",
    tier: "Premium"
  },
  {
    id: "FEAT-051",
    name: "Salary Bracket Vocab Injector (INVENTED 24)",
    module: "F",
    description: "Dynamically shifts vocabulary complexity in prompts based on the salary tier user targets (e.g., 4LPA vs 40LPA).",
    whyUnique: "Directly ties coaching complexity to economic leverage standards.",
    emotion: "Aspiration",
    tier: "Pro"
  },
  {
    id: "FEAT-052",
    name: "The Cognitive Multilingual Bridge (INVENTED 25)",
    module: "F",
    description: "Synchronous concept-mapping tool showing local mother tongue structures next to professional global standards.",
    whyUnique: "Acknowledges natively wired logic instead of assuming users can think purely in English on day one.",
    emotion: "Integration",
    tier: "Premium"
  },

  // MODULE G (Credibility)
  {
    id: "FEAT-053",
    name: "LinkedIn Verbal Proof Badge",
    module: "G",
    description: "Verifiable speech badge embedding certified communication performance scores directly into profiles.",
    whyUnique: "Offers absolute proof of client-readiness to talent acquisitions and recruiters.",
    emotion: "Validation",
    tier: "Free"
  },
  {
    id: "FEAT-054",
    name: "Resume Audio-QR Generator",
    module: "G",
    description: "Creates custom QR codes for printed resumes that stream the candidate's verified elevator pitch instantly.",
    whyUnique: "Transforms static resumes into immediate, compelling auditory showcases.",
    emotion: "Impact",
    tier: "Premium"
  },
  {
    id: "FEAT-055",
    name: "The Skillony Communication Index (SCI)",
    module: "G",
    description: "A comprehensive speaking standard equivalent to IELTS, but built entirely for business scenarios.",
    whyUnique: "Highly practical, outcome-focused evaluation replaces expensive academic testing.",
    emotion: "Authority",
    tier: "Premium"
  },
  {
    id: "FEAT-056",
    name: "Recruiter-Direct Auditory Portfolio",
    module: "G",
    description: "Instantly forwards certified vocal samples directly to BPO and major service partner HR networks.",
    whyUnique: "Acts as a placement accelerator, completely bypassing standard resume screening.",
    emotion: "Triumph",
    tier: "Pro"
  },

  // MODULE H (Enterprise / B2B)
  {
    id: "FEAT-057",
    name: "Campus Placement Dean Dashboard",
    module: "H",
    description: "Enables college deans to monitor placement readiness metrics across all final-year students.",
    whyUnique: "Empowers institutions with actionable, live employability analytics.",
    emotion: "Sovereignty",
    tier: "Enterprise"
  },
  {
    id: "FEAT-058",
    name: "Corporate Alignment Key",
    module: "H",
    description: "Allows enterprise clients to configure custom project alignment criteria for on-bench developers.",
    whyUnique: "Dramatically reduces bench costs and speeds up billable resource mobilization.",
    emotion: "Efficiency",
    tier: "Enterprise"
  },
  {
    id: "FEAT-059",
    name: "White-Labeled Placement Portal",
    module: "H",
    description: "A custom-branded dashboard showcasing placement-ready communicators to target hiring partners.",
    whyUnique: "Accelerates college-to-corporate recruitment pipelines.",
    emotion: "Trust",
    tier: "Enterprise"
  },
  {
    id: "FEAT-060",
    name: "Outcome-Linked Placement Escrow",
    module: "H",
    description: "Deploys institutional license collections that mature only upon verifiable placement metrics.",
    whyUnique: "Perfectly aligns cash flows with actual student career placement outcomes.",
    emotion: "Partnership",
    tier: "Enterprise"
  }
];

export const TECH_STACK = {
  voicePipeline: {
    stt: "Whisper Large V3 (via localized server-side container). High noise-robustness for Tier 2/3 India surroundings; latency latency benchmark optimized to <180ms via TensorRT-LLM.",
    tts: "ElevenLabs / Cartesia. Cartesia Sonic-Multilingual outputs dynamic real-time voice with high naturalness score (4.8/5) and <120ms latency.",
    pronunciationAssessment: "Custom relative acoustic-phone alignment network mapped on standard Wav2Vec2, scoring alignment against reference native phonetic charts.",
    streaming: "WebSockets. Chosen over WebRTC for its extreme firewall-bypassing simplicity across poor, high-jitter 4G/5G setups in rural Indian setups."
  },
  aiModels: {
    conversation: "Gemini 3.5 Flash server-side. Highly cost-effective, extremely low-latency, and pre-fluent in multi-modal speech context.",
    personalization: "SentenceTransformers (all-MiniLM-L6-v2) hosting lightweight vector profile maps indexing user pin-code accent errors and targeting contextual goals.",
    interview: "Dynamic Context RAG using structured company guidelines. Restricts responses to realistic situational technical structures. Generates ~₹0.14 per session.",
    emotion: "Acoustic Pitch modulation + Sentiment tracking. Analyzes frequency variability and linguistic pacing patterns to measure and boost speaking confidence state."
  },
  infrastructure: {
    frontend: "React + Tailwind CSS. Exceptionally lightweight, modular, and optimized for poor web performance and older Android-based webviews.",
    backend: "Node.js (TypeScript) + Express. Perfect for small fast teams, easy concurrency, and clean server-side Gemini SDK execution.",
    database: "Primary: Firebase Firestore (Durable persistent user schemas, fast live client synchronization). Secondary: Redis (rapid session cache to sustain audio stream blocks).",
    cdn: "Cloudflare CDN with robust edge cache. Fully optimized for Indian metro and Tier 2 tier routes (e.g. Mumbai, Bangalore, Chennai, Patna, Indore).",
    costEstimate: {
      "10k": "₹42,000 / month (approx $500 USD). Driven by standard developer keys & light database reads/writes.",
      "100k": "₹3,70,000 / month (approx $4,400 USD). Shifted to reserved instance VMs with edge-rendered content caching.",
      "1m": "₹29,50,000 / month (approx $35,000 USD). Massively optimized using offline relative TTS rendering and localized model endpoints."
    }
  },
  dataMoat: {
    description: "By capturing over 10 million distinct, localized speech samples from Tier 2/3 Indian job-seekers, Skillony compiles an unbreachable auditory training database. Each sample maps localized native phonetic markers (MTI) directly to career progression outcomes (verifiable CTC hikes). By Year 2, no competitor on Earth has a dataset capable of aligning Indian accents to global hiring readiness with this precision."
  }
};

export const MONETIZATION_TIERS = [
  {
    name: "FREE TIER",
    price: "₹0",
    features: [
      "Access to 'Swara Accent Adaptor' & 'Filler Word Eliminator'",
      "Basic 'Daily Standup Status Streamliner' scenario (Module D)",
      "3 minutes of active AI Speaking Coaching / day",
      "Standard access to the Global Speaking Leaderboard"
    ],
    growthStrategy: "Acts as a viral organic loop. Users check their speaking score, get humbled by high filler detection, and share their rating screenshots to peer study networks, driving rapid word-of-mouth."
  },
  {
    name: "PREMIUM (Individual)",
    price: "₹499/mo",
    features: [
      "Unlimited AI speaking time (accent + pausology + decibel feedback)",
      "Access to 'The Indian Idiom Upgrader' & 'The Desi Shame De-Conditioner'",
      "Interactive practice for TCS, Infosys, and Startup readiness",
      "Full community Speaking Battles & Whisper Mentoring rooms",
      "Skillony Communication Index (SCI) speaking scorecard"
    ],
    upgradeMoment: "The moment an individual schedules a real recruiter call and realizes their career prospects depend on fluid, powerful communication. ₹499 is worth more than a single mock trial."
  },
  {
    name: "PRO (Individual)",
    price: "₹1,499/mo",
    features: [
      "Everything in Premium plus 1v1 resume-specialized simulation",
      "The 'Critical HR Poker-Face' simulated stress negotiator",
      "Auditory Resume QR Generator + direct recruiter portfolio sync",
      "Outcome negotiation engine (leverage calculations on offer letters)",
      "Monthly 30-min mentor endorsement check with an industry leader"
    ],
    valueProposition: "It is an immediate investment in salary leverage. Upgrading to Pro has an expected return of an extra ₹30,000/month starting CTC Hike."
  },
  {
    name: "ENTERPRISE / CAMPUS",
    price: "Custom Contract",
    features: [
      "White-labeled institution employability portals",
      "Deans Placement dashboard tracking communication levels of 5000+ students",
      "Project competency matching mapping for IT benches",
      "Outcome-linked Escrow placement guarantee"
    ],
    salesMotion: "We target Tier 2 engineering and business schools holding poor historical placement rosters. We close 50 partnerships in Year 1 by matching our fee directly to final placement salaries in Escrow, removing institutional cash risks entirely."
  }
];

export const ADDITIONAL_REVENUE = [
  {
    name: "Salary Negotiation Escrow Fee (2% of first CTC Hike)",
    concept: "We help users mock-negotiate their offers. If the user successfully negotiates their CTC up by an extra ₹1.5LPA, we collect a small success fee. EdTech charges upfront; we charge based on real wealth creation.",
    impact: "Aligns our profit motive entirely with user economic success, creating a trusted elite brand identity."
  },
  {
    name: "Recruiter Fast-Track Placement Bounties (Commission paid by Hiring partners)",
    concept: "Service companies pay extensive BPO/hiring agency commissions. We feed verified, 'Client-Ready' (BCI 8.5+) communicators straight into their pipelines, saving them massive recruitment overhead and collecting standard bounties.",
    impact: "Provides the enterprise a zero-cost pre-screened pipeline of elite verbal talent."
  },
  {
    name: "The 'Speech Repair' Fast-Track Placement Insurance",
    concept: "A package where colleges buy placement 'insurance'. For students who fail company accent/readiness cuts twice, the portal launches targeted daily accent/breathing repairs to clear the third onshore attempt.",
    impact: "Guarantees placement rates for struggling deans, protecting the college's public rating."
  }
];
