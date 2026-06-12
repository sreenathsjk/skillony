import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, 
  ChevronRight, 
  Mic, 
  Send, 
  Award, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Play, 
  Volume2, 
  User, 
  AlertCircle, 
  Globe, 
  Filter, 
  Share2, 
  Coins, 
  Linkedin,
  ExternalLink,
  Smartphone,
  Cpu,
  Star,
  Flame,
  UserCheck,
  Plus,
  Minus,
  Calendar,
  Check,
  Info
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Firebase imports
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Import structured blueprints and lists
import { 
  STRATEGY_ANSWERS, 
  PRODUCT_IDENTITY, 
  MODULES_LIST, 
  FEATURES_DATA, 
  TECH_STACK, 
  MONETIZATION_TIERS, 
  ADDITIONAL_REVENUE,
  Feature
} from "./data";

const MISSION_PRO_TIPS: Record<string, string> = {
  resonance: "Lower your larynx slightly and speak from your diaphragm. Deeper chest resonance sounds more balanced and projects executive authority during high-stakes reviews.",
  fillers: "Embrace comfortable silent gaps. Pausing for 1.5 seconds instead of saying 'uh' or 'basically' projects intellectual composure under crisis conditions.",
  assertive: "Acknowledge engineering trade-offs instantly, and pivot immediately to concrete solutions. Replace passive wording like 'we tried to fix it' with active verbs like 'we mitigated.'",
  elevator: "Maintain a pace of under 135 words per minute. Pacing is key to retention—over-rushing your pitch dilutes the perceived value of your technical wins.",
  rebuttal: "Slightly over-articulate trailing plosive consonants (like 't', 'd', 'k', 'p'). This simple phonetic practice naturally scales down mother tongue influence."
};

const CAREER_LEVELS = [
  {
    id: "associate",
    name: "Associate SDE & Consultant",
    bciMin: 6.0,
    missionsRequired: 1,
    salaryMin: "3.5 LPA",
    salaryMax: "6 LPA",
    badge: "BRONZE TIER",
    skills: ["Basic Technical Articulation", "Clear Pausing & Pacing", "Simple STAR Framework Answer Formulation"],
    recruiterStatus: "Standard Recruiter Discovery Active",
    unlockedDescription: "Basic professional standard. Possesses foundational speaking clarity, ready for domestic technical roles."
  },
  {
    id: "specialist",
    name: "Global Delivery Specialist",
    bciMin: 7.2,
    missionsRequired: 2,
    salaryMin: "6 LPA",
    salaryMax: "12 LPA",
    badge: "SILVER TIER",
    skills: ["Vocal Resonance Calibration", "Pausology (Filler-word mitigation)", "Recruiter Cold-Q Composure"],
    recruiterStatus: "Priority Recruitment Flag Added",
    unlockedDescription: "Global delivery standard. Capable of presenting to internal stakeholders with minimal speech-anxiety."
  },
  {
    id: "consultant",
    name: "Technical Champion & Consultant",
    bciMin: 8.0,
    missionsRequired: 4,
    salaryMin: "12 LPA",
    salaryMax: "22 LPA",
    badge: "GOLD TIER",
    skills: ["Assertive Posture Calibration", "Mother-Tongue Dialect Neutralization", "Elevator Pitch Fluidity"],
    recruiterStatus: "Direct Engineering Manager Shortlist",
    unlockedDescription: "Corporate leadership grade. Leads client meetings, handles stress questions, and structures strategic answers."
  },
  {
    id: "keynote",
    name: "Bharat Keynote Principal Architect",
    bciMin: 9.0,
    missionsRequired: 5,
    salaryMin: "22 LPA",
    salaryMax: "45+ LPA",
    badge: "PLATINUM TIER",
    skills: ["Executive-Level Impromptu Cadence", "Flawless Multi-Million Pitch Delivery", "Supreme Dialect & Tone Adaptation"],
    recruiterStatus: "Founder Inner-Circle Endorsement",
    unlockedDescription: "Elite standard. Reserved for primary community leaders and multi-billion global tech keynotes."
  }
];

export default function App() {
  // Navigation State
  // "product-demo" represents the active 7-screen interactive app simulator.
  // "strategic-blueprint" represents the full founder strategic presentation (Answers Q1-Q4, Identity, 60 Features, Tech Stack, Monetization)
  const [activeTab, setActiveTab] = useState<"product-demo" | "strategic-blueprint">("product-demo");
  
  // Demo - Current Active Simulated Screen (1 to 7)
  const [currentScreen, setCurrentScreen] = useState<number>(1);

  // --- PERSISTENT USER STATE & ONBOARDING DATA ---
  const [onboarding, setOnboarding] = useState({
    dream: "Lead Software Architect",
    salary: "12 LPA",
    field: "Tech Startups",
    anxiety: "Speech-anxiety / freezing under direct pressure"
  });
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

  const [daysTilInterview, setDaysTilInterview] = useState<number>(18);
  const [dailyMissions, setDailyMissions] = useState([
    { id: "resonance", label: "Vocal resonance calibration", completed: true },
    { id: "fillers", label: "Zero-filler STAR drill (Client delay crisis)", completed: false },
    { id: "assertive", label: "Calibrate assertion quotient under stress", completed: false },
    { id: "elevator", label: "60-second elevator pitch rehearsal", completed: true },
    { id: "rebuttal", label: "Reframe regional mother-tongue markers", completed: false }
  ]);
  const [activeStreak, setActiveStreak] = useState<number>(5);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [expandedProTipMissionId, setExpandedProTipMissionId] = useState<string | null>(null);
  const [newMissionLabel, setNewMissionLabel] = useState<string>("");
  const [showWeeklyBreakdown, setShowWeeklyBreakdown] = useState<boolean>(false);
  
  // Subscription / Premium State (gates premium features, simulates UPI checkout)
  const [premiumTier, setPremiumTier] = useState<"free" | "premium" | "pro">("free");
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState<"premium" | "pro">("premium");
  const [speakingCount, setSpeakingCount] = useState<number>(0);
  const [interviewCount, setInterviewCount] = useState<number>(0);
  const [showPaymentCheckoutModal, setShowPaymentCheckoutModal] = useState<boolean>(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [paymentUpiId, setPaymentUpiId] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<"upi-confirm" | "gateway-animation" | "success">("upi-confirm");
  
  // Career Value Calculator State (LPA)
  const [calcCurrentSalary, setCalcCurrentSalary] = useState<number>(6);
  const [calcTargetSalary, setCalcTargetSalary] = useState<number>(15);
  const [showLinkedinModal, setShowLinkedinModal] = useState<boolean>(false);
  const [copiedLinkedinText, setCopiedLinkedinText] = useState<boolean>(false);
  const [customLinkedinText, setCustomLinkedinText] = useState<string>("");

  // Ensure target salary remains at least 1 unit above current salary
  useEffect(() => {
    if (calcTargetSalary < calcCurrentSalary + 1) {
      setCalcTargetSalary(calcCurrentSalary + 1);
    }
  }, [calcCurrentSalary, calcTargetSalary]);
  
  // Confidence rating modal & score tracking
  const [ratingMission, setRatingMission] = useState<{ id: string; label: string } | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(4);
  const [missionConfidenceScores, setMissionConfidenceScores] = useState<Record<string, number>>({
    resonance: 4,
    elevator: 5
  });

  const [hoveredCell, setHoveredCell] = useState<{
    dayName: string;
    weekNum: number;
    completedCount: number;
    description: string;
    isCurrentWeek: boolean;
  } | null>(null);

  // --- INTERACTIVE CAREER ROADMAP STATE ---
  const [profileSubTab, setProfileSubTab] = useState<"certificate" | "roadmap">("roadmap");
  const [selectedRoadmapLevel, setSelectedRoadmapLevel] = useState<number>(1);
  const [bciSliderOverride, setBciSliderOverride] = useState<number | null>(null);
  const [missionsOverride, setMissionsOverride] = useState<number | null>(null);

  const completedMissionsCountActual = dailyMissions.filter(m => m.completed).length;
  
  // Calculate confidence-based bonus growth impact (each completed star rating adds a dynamic bonus)
  const confidenceBonus = dailyMissions.reduce((acc, m) => {
    if (!m.completed) return acc;
    const rating = missionConfidenceScores[m.id] || 3;
    return acc + (rating - 1) * 0.05; // rating 1->0.0, 5->0.20 max bonus points
  }, 0);

  const currentBciScoreActual = Number(Math.min(10.0, 6.2 + (completedMissionsCountActual * 0.4) + (activeStreak * 0.06) + confidenceBonus).toFixed(2));
  const currentBciScore = bciSliderOverride !== null ? bciSliderOverride : currentBciScoreActual;
  const completedMissionsCount = missionsOverride !== null ? missionsOverride : completedMissionsCountActual;

  const getUnlockedLevelIndex = () => {
    let matchedIndex = 0; // Associate/Bronze by default
    for (let i = CAREER_LEVELS.length - 1; i >= 0; i--) {
      const level = CAREER_LEVELS[i];
      if (currentBciScore >= level.bciMin && completedMissionsCount >= level.missionsRequired) {
        return i;
      }
    }
    return 0; // Associate index as fallback
  };

  const makeCellData = (dayIdx: number, weekIdx: number) => {
    const daysNameFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayName = daysNameFull[dayIdx];
    const isCurrentWeek = weekIdx === 5; // totalWeeks is 6, so indices 0 to 5. 5 is current week.
    
    let completedCount = 0;
    let description = "";

    if (isCurrentWeek) {
      if (dayIdx === 0) {
        const met = dailyMissions.find(m => m.id === "resonance")?.completed;
        completedCount = met ? 4 : 0;
        description = met 
          ? "Vocal resonance calibration drill completed! 🎯"
          : "Vocal resonance calibration drill - Pending";
      } else if (dayIdx === 1) {
        const met = dailyMissions.find(m => m.id === "fillers")?.completed;
        completedCount = met ? 4 : 0;
        description = met 
          ? "Zero-filler STAR drill completed! 🎯"
          : "Zero-filler STAR drill - Pending";
      } else if (dayIdx === 2) {
        const met = dailyMissions.find(m => m.id === "assertive")?.completed;
        completedCount = met ? 4 : 0;
        description = met 
          ? "Calibrate assertion quotient drill completed! 🎯"
          : "Calibrate assertion quotient drill - Pending";
      } else if (dayIdx === 3) {
        const met = dailyMissions.find(m => m.id === "elevator")?.completed;
        completedCount = met ? 4 : 0;
        description = met 
          ? "60-second elevator pitch rehearsal completed! 🎯"
          : "60-second elevator pitch rehearsal - Pending";
      } else if (dayIdx === 4) {
        const met = dailyMissions.find(m => m.id === "rebuttal")?.completed;
        completedCount = met ? 4 : 0;
        description = met 
          ? "Reframe regional dialect drill completed! 🎯"
          : "Reframe regional dialect drill - Pending";
      } else if (dayIdx === 5) {
        const actualCount = completedMissionsCountActual;
        completedCount = actualCount >= 3 ? 3 : 0;
        description = actualCount >= 3 
          ? "Weekend speaking habit locked! 🤝" 
          : "Incomplete (complete 3+ weekday drills to auto-activate)";
      } else if (dayIdx === 6) {
        const actualCount = completedMissionsCountActual;
        completedCount = actualCount === 5 ? 4 : 0;
        description = actualCount === 5 
          ? "Elite Weekly Streak Achieved! 🏆" 
          : "Incomplete (complete all 5 weekday drills to activate Sunday streak bonus)";
      }
    } else {
      const seedVal = (dayIdx * 3 + weekIdx * 7 + 2) % 5;
      completedCount = seedVal;
      if (seedVal === 0) {
        description = "Rest Day - No active drills logged.";
      } else if (seedVal === 1) {
        description = "1 Drill completed (Light practice day)";
      } else if (seedVal === 2) {
        description = "2 Drills completed (Standard habits maintained)";
      } else if (seedVal === 3) {
        description = "3 Drills completed (Excellent momentum)";
      } else {
        description = "5 Drills completed (Full streak locked!) 🌟";
      }
    }

    return { dayName, weekNum: weekIdx + 1, completedCount, description, isCurrentWeek };
  };

  // --- AUTHENTICATION & CLOUD STORAGE ---
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Sign in and sign out handlers
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        try {
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.onboarding) setOnboarding(data.onboarding);
            if (data.daysTilInterview !== undefined) setDaysTilInterview(data.daysTilInterview);
            if (data.dailyMissions) setDailyMissions(data.dailyMissions);
            if (data.activeStreak !== undefined) setActiveStreak(data.activeStreak);
            if (data.hasCompletedOnboarding !== undefined) setHasCompletedOnboarding(data.hasCompletedOnboarding);
            if (data.missionConfidenceScores) setMissionConfidenceScores(data.missionConfidenceScores);
            if (data.premiumTier) setPremiumTier(data.premiumTier);
            if (data.speakingCount !== undefined) setSpeakingCount(data.speakingCount);
            if (data.interviewCount !== undefined) setInterviewCount(data.interviewCount);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Synchronize state changes to Firestore with a debounce guard
  useEffect(() => {
    if (!user) return;
    
    const isEquivalent = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
    
    const syncToCloud = async () => {
      const docRef = doc(db, "users", user.uid);
      try {
        const snapshot = await getDoc(docRef);
        let shouldWrite = false;
        
        if (!snapshot.exists()) {
          shouldWrite = true;
        } else {
          const cloudData = snapshot.data();
          if (
            !isEquivalent(cloudData.onboarding, onboarding) ||
            cloudData.daysTilInterview !== daysTilInterview ||
            !isEquivalent(cloudData.dailyMissions, dailyMissions) ||
            cloudData.activeStreak !== activeStreak ||
            cloudData.hasCompletedOnboarding !== hasCompletedOnboarding ||
            !isEquivalent(cloudData.missionConfidenceScores, missionConfidenceScores) ||
            cloudData.premiumTier !== premiumTier ||
            cloudData.speakingCount !== speakingCount ||
            cloudData.interviewCount !== interviewCount
          ) {
            shouldWrite = true;
          }
        }
        
        if (shouldWrite) {
          await setDoc(docRef, {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            onboarding,
            daysTilInterview,
            dailyMissions,
            activeStreak,
            hasCompletedOnboarding,
            missionConfidenceScores,
            premiumTier,
            speakingCount,
            interviewCount,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    };

    const timeoutId = setTimeout(syncToCloud, 600);
    return () => clearTimeout(timeoutId);
  }, [onboarding, daysTilInterview, dailyMissions, activeStreak, hasCompletedOnboarding, missionConfidenceScores, premiumTier, speakingCount, interviewCount, user]);

  // --- ENGINE HEALTH & STATUS STATE ---
  const [isUsingRealAI, setIsUsingRealAI] = useState<boolean>(true); // Checks status of Gemini API

  // --- SCREEN 3: AI SPEAKING COACH CONTEXT ---
  const [speakingInput, setSpeakingInput] = useState<string>("");
  const [isSpeakingLoading, setIsSpeakingLoading] = useState<boolean>(false);
  const [speakingStats, setSpeakingStats] = useState({
    score: 75,
    pace: "Moderate (130 words/min)",
    fillers: 3,
    analysis: "Excellent sentence formulation. Practice replacing vocal hesitancy with silent authority.",
    suggestions: [
      { original: "I want to do a job in your company", better: "I am eager to contribute to your company's growth" },
      { original: "My English is not very good", better: "I am actively mastering high-stakes business communication" }
    ]
  });
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: "Hello! Ready for today's high-stakes speaking drills? Say something or explain a project you spearheaded." }
  ]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const speakingInputRef = useRef<string>("");
  const recognitionRef = useRef<any>(null);

  // Sync state with ref to avoid closure issues in SpeechRecognition handlers
  useEffect(() => {
    speakingInputRef.current = speakingInput;
  }, [speakingInput]);

  // Check browser speech support on mount
  useEffect(() => {
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSpeechSupported(!!SpeechLib);
  }, []);

  // Web Speech API Integration
  useEffect(() => {
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechLib) {
      return;
    }

    if (isRecording) {
      try {
        const rec = new SpeechLib();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        let finalTranscript = "";

        rec.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullText = finalTranscript + interimTranscript;
          if (fullText.trim()) {
            setSpeakingInput(fullText);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition error:", event.error);
          if (event.error !== 'aborted') {
            setIsRecording(false);
          }
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("Failed to start Speech Recognition:", err);
        setIsRecording(false);
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping speech recognition:", e);
        }
        recognitionRef.current = null;

        // Auto-send speaking input once the user stops recording
        const speechText = speakingInputRef.current;
        if (speechText.trim()) {
          handleSendSpeakingInput(speechText);
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isRecording]);

  // --- SCREEN 4: INTERVIEW SIMULATOR CONTEXT ---
  const [selectedCompany, setSelectedCompany] = useState<string>("TCS");
  const [selectedRole, setSelectedRole] = useState<string>("System Engineer");
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(3);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [interviewAnswerInput, setInterviewAnswerInput] = useState<string>("");
  const [userAnswersAndQuestions, setUserAnswersAndQuestions] = useState<Array<{ question: string; answer: string }>>([]);
  const [interviewLoading, setInterviewLoading] = useState<boolean>(false);
  const [interviewFinished, setInterviewFinished] = useState<boolean>(false);
  const [interviewFeedback, setInterviewFeedback] = useState<any>(null);

  // --- GRAPH PLOTTING FOR CONFIDENCE TRENDS ---
  const confidenceData = [
    { day: "Day 1", core: 42, assertiveness: 35, clarity: 40 },
    { day: "Day 3", core: 50, assertiveness: 48, clarity: 45 },
    { day: "Day 5", core: 62, assertiveness: 55, clarity: 60 },
    { day: "Day 7", core: 71, assertiveness: 68, clarity: 69 },
    { day: "Day 10", core: 84, assertiveness: 80, clarity: 85 },
  ];

  // --- STRATEGIC PRESENTATION STATES ---

  const [featureSearch, setFeatureSearch] = useState<string>("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("ALL");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("ALL");

  // Check backend Gemini availability on boot
  useEffect(() => {
    // Ping/test ping or just verify API standard
    fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "init test check" })
    })
    .then(res => {
      setIsUsingRealAI(res.ok);
    })
    .catch(() => {
      setIsUsingRealAI(false);
    });
  }, []);

  // Submit Active Speaking reply to local server API
  const handleSendSpeakingInput = async (forcedText?: string) => {
    const textToUse = forcedText !== undefined ? forcedText : speakingInput;
    if (!textToUse.trim()) return;

    if (premiumTier === "free" && speakingCount >= 2) {
      setChatHistory(prev => [...prev, { 
        role: 'model' as const, 
        text: "🔒 [TRIAL LIMIT EXCEEDED] You have utilized your 2 daily free speaking drills under the Free Tier.\n\nTo unlock infinite continuous drills, corporate roleplay modules, executive pausology trackers, and custom STAR salary negotiation simulators, upgrade your Skillony account now!" 
      }]);
      setSpeakingInput("");
      return;
    }

    const userText = textToUse;
    setSpeakingInput("");
    setIsSpeakingLoading(true);

    const updatedHistory = [...chatHistory, { role: 'user' as const, text: userText }];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedHistory,
          profile: onboarding
        })
      });

      if (!response.ok) throw new Error("API call failed.");
      const result = await response.json();

      setChatHistory(prev => [...prev, { role: 'model', text: result.reply }]);
      setSpeakingStats({
        score: result.score || 78,
        pace: result.pace || "Moderate (135 WPM)",
        fillers: result.fillers !== undefined ? result.fillers : 2,
        analysis: result.analysis || "Superb poise. Try to maintain consistent eye contact in high pressure.",
        suggestions: result.suggestions || []
      });
      setSpeakingCount(prev => prev + 1);
    } catch (e) {
      console.error(e);
      // Fallback fallback simulated speech responses if API down
      const mockResult = {
        reply: `Interesting point. To truly excel at ${selectedRole || 'a tech role'} at ${selectedCompany || 'major firms'}, highlight how you engineered scalable architectural solutions, rather than saying you 'just did coding'.`,
        score: 82,
        pace: "Perfect (128 words/min)",
        fillers: 1,
        analysis: "Your vocabulary is showing immediate upgrades. Strive to open speaking milestones with strong metric goals.",
        suggestions: [
          { original: "We worked on a React website", better: "We engineered a highly robust, secure React application boosting performance by 35%." }
        ]
      };
      setChatHistory(prev => [...prev, { role: 'model', text: mockResult.reply }]);
      setSpeakingStats(mockResult);
      setSpeakingCount(prev => prev + 1);
    } finally {
      setIsSpeakingLoading(false);
    }
  };

  // Launch simulated or real server interview
  const handleStartInterview = async () => {
    const premiumCompanies = ["Wipro", "Accenture", "Startups", "Google", "Amazon", "Microsoft", "Meta", "McKinsey", "Goldman Sachs"];
    if (premiumTier === "free" && premiumCompanies.includes(selectedCompany)) {
      alert(`🔒 Target Firm "${selectedCompany}" is an elite Premium evaluator board.\n\nUnder your Free tier, you can practice with TCS (Tata Consultancy) and Infosys. Upgrade to Premium/Pro to practice dynamic roleplays for all 20+ elite multinational corporate panels.`);
      setCurrentScreen(7); // Redirect to Pricing Screen
      return;
    }

    setInterviewLoading(true);
    setInterviewFinished(false);
    setInterviewFeedback(null);
    setUserAnswersAndQuestions([]);
    setCurrentQuestionIndex(0);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          role: selectedRole,
          questionCount: totalQuestions,
          userAnswers: [],
          currentQuestionIndex: 0,
          onboarding
        })
      });

      if (!response.ok) throw new Error("Server error");
      const result = await response.json();
      setCurrentQuestion(result.question || `Welcome. Tell me why you want to join ${selectedCompany} as a ${selectedRole}?`);
      setInterviewStarted(true);
      setInterviewCount(prev => prev + 1);
    } catch (e) {
      // Fallback
      setCurrentQuestion(`Welcome to your high-stakes recruiter round for ${selectedCompany} as a ${selectedRole}. Can you describe a complex production bug you solved under extreme deadlines?`);
      setInterviewStarted(true);
      setInterviewCount(prev => prev + 1);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Move to next interview question
  const handleNextInterviewQuestion = async () => {
    if (!interviewAnswerInput.trim()) return;

    const currentAnswer = interviewAnswerInput;
    setInterviewAnswerInput("");
    setInterviewLoading(true);

    const updatedAnswers = [...userAnswersAndQuestions, { question: currentQuestion, answer: currentAnswer }];
    setUserAnswersAndQuestions(updatedAnswers);

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    if (premiumTier === "free" && nextIndex >= 2) {
      setInterviewFinished(true);
      setInterviewFeedback({
        score: 65,
        strengths: ["Excellent structural framework (utilizing STAR technique)"],
        weakSpots: ["Locked - Upgrade to Premium/Pro to evaluate full multi-round behavioral simulations"],
        salaryNegotiationScore: 4,
        corporateNeutralityScore: 70,
        feedbackHtml: `### 🔒 Trial Panel Terminated Early
        
You have completed the **Free Trial limits** for ${selectedCompany}. 

To unlock full 3-item, 5-item, or 8-item behavioral pressure-room boards, get continuous accent calibration, and receive certified performance reports, please upgrade your account to **Skillony Premium/Pro**!`,
        upgrades: [
          { original: "Please upgrade", better: "Subscribe to premium to unlock high-impact vocabulary upgrades", why: "Exclusive premium coaching content." }
        ]
      });
      setInterviewLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          role: selectedRole,
          questionCount: totalQuestions,
          userAnswers: updatedAnswers,
          currentQuestionIndex: nextIndex,
          onboarding
        })
      });

      if (!response.ok) throw new Error("API failed");
      const result = await response.json();

      if (result.completed) {
        setInterviewFinished(true);
        setInterviewFeedback(result.feedback);
      } else {
        setCurrentQuestion(result.question);
      }
    } catch (e) {
      // Offline mock evaluation if server down or timeout matches
      if (nextIndex >= totalQuestions) {
        setInterviewFinished(true);
        setInterviewFeedback({
          score: 84,
          strengths: ["Excellent structural framework (utilizing STAR technique)", "High technical confidence"],
          weakSpots: ["Some regional mother-tongue markers on key vowels", "Fast articulation speed under initial question pressure"],
          salaryNegotiationScore: 8,
          corporateNeutralityScore: 89,
          feedbackHtml: "You demonstrated solid technical delivery. However, when addressing conflict, avoid apologetic modifiers like 'maybe I was wrong' and replace them with peer-calibration metrics.",
          upgrades: [
            { original: "I solved the bug in code", better: "I spearheaded the database query optimizations, eliminating peak-hour latencies.", why: "Aligns your verbal profile directly with high-stakes leadership roles." }
          ]
        });
      } else {
        setCurrentQuestion(`Insightful reply. Now, how do you handle situations where business deadlines run completely counter to clean system architecture practices?`);
      }
    } finally {
      setInterviewLoading(false);
    }
  };

  const filteredFeatures = FEATURES_DATA.filter((feat) => {
    const matchesSearch = feat.name.toLowerCase().includes(featureSearch.toLowerCase()) || 
                          feat.description.toLowerCase().includes(featureSearch.toLowerCase());
    const matchesModule = selectedModuleFilter === "ALL" || feat.module === selectedModuleFilter;
    const matchesTier = selectedTierFilter === "ALL" || feat.tier === selectedTierFilter;
    return matchesSearch && matchesModule && matchesTier;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col items-center justify-center p-3 md:p-6 overflow-x-hidden">
      
      {/* VIRTUAL SCREEN CASING */}
      <div className="w-full max-w-2xl bg-zinc-950 rounded-3xl border-4 border-slate-800 shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col min-h-[650px] relative">
                
                {/* STATUS BAR BAR */}
                <div className="bg-slate-950 px-6 py-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-900/60">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-500" />
                    Skillony App Client Sandbox v2.0.4
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold animate-pulse">● LIVE</span>
                    <span>100% SIGNAL</span>
                    <span>11:59PM</span>
                  </div>
                </div>

                {/* CLOUD AUTHENTICATION HUD */}
                <div className="bg-slate-900 border-b border-slate-905/30 px-6 py-2.5 flex justify-between items-center text-xs relative z-30">
                  {user ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || ""} className="w-5 h-5 rounded-full border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.15)]" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[9px] border border-cyan-500/30">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                          </div>
                        )}
                        <span className="text-slate-300 text-[10px] sm:text-xs font-mono truncate">
                          Synced: <span className="text-cyan-400 font-semibold">{user.displayName || user.email}</span>
                        </span>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="text-[9px] font-mono tracking-wider text-slate-400 hover:text-cyan-400 font-bold bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 px-2.5 py-1 rounded transition-all cursor-pointer uppercase"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 uppercase tracking-wide">
                        <Lock className="w-3.5 h-3.5 text-cyan-500/40" /> progress unsynced
                      </span>
                      <button 
                        onClick={handleSignIn}
                        className="text-[10px] font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Sign In with Google
                      </button>
                    </div>
                  )}
                </div>

                {/* DYNAMIC SCREEN CONTENT INJECTOR */}
                <div className="flex-1 p-6 relative flex flex-col justify-between bg-gradient-to-b from-slate-950 to-zinc-950">
                  
                  {/* --- SCREEN 1: DEEP ONBOARDING FLOW --- */}
                  {currentScreen === 1 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-onboarding">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-400 border border-slate-800 uppercase font-mono font-bold tracking-wider">
                            ONBOARDING STEP {onboardingStep} OF 4
                          </span>
                          <span className="text-xs text-slate-500 font-mono">Streak Safe</span>
                        </div>
                        
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                            style={{ width: `${(onboardingStep / 4) * 100}%` }}
                          ></div>
                        </div>

                        {onboardingStep === 1 && (
                          <div className="space-y-4 pt-2">
                            <h2 className="font-display font-medium text-xl leading-snug tracking-tight text-white">
                              Welcome to Skillony. First: What is your actual, high-stakes career dream?
                            </h2>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                              No generic grammar tests here. We customize everything around high-stakes career breakthroughs where salary and self-worth double.
                            </p>
                            <div className="space-y-2 pt-2">
                              {[
                                "BPO International Customer Lead",
                                "Lead Software Architect",
                                "Global Consulting Consultant",
                                "Venture-Backed Startup Founder",
                                "Business Development Lead (MNCs)"
                              ].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setOnboarding((p) => ({ ...p, dream: option }))}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                    onboarding.dream === option
                                      ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md"
                                      : "bg-slate-900/35 border-slate-800/80 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span>{option}</span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${onboarding.dream === option ? 'bg-cyan-400' : 'bg-slate-800'}`}></span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {onboardingStep === 2 && (
                          <div className="space-y-4 pt-2">
                            <h2 className="font-display font-medium text-xl leading-snug tracking-tight text-white">
                              Understood. To reach <span className="text-cyan-400">{onboarding.dream}</span>, what is your salary aspiration?
                            </h2>
                            <p className="text-xs text-slate-400 font-light leading-relaxed font-mono">
                              English is your economic tool. Tell us your clear baseline metric target.
                            </p>
                            <div className="grid grid-cols-2 gap-2.5 pt-2">
                              {["4-6 LPA", "8-12 LPA", "15-20 LPA", "25 LPA+"].map((salary) => (
                                <button
                                  key={salary}
                                  onClick={() => setOnboarding((p) => ({ ...p, salary: salary }))}
                                  className={`p-4 rounded-xl border text-center transition-all flex flex-col justify-center items-center gap-2 ${
                                    onboarding.salary === salary
                                      ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md font-bold"
                                      : "bg-slate-900/35 border-slate-800/80 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <Coins className="w-5 h-5 text-slate-500" />
                                  <span className="text-xs font-mono tracking-wider">{salary}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {onboardingStep === 3 && (
                          <div className="space-y-4 pt-2">
                            <h2 className="font-display font-medium text-xl leading-snug tracking-tight text-white">
                              Which of these critical corporate groups are you targeting for interviews?
                            </h2>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                              Each company ecosystem utilizes distinct language patterns and client-readiness measures.
                            </p>
                            <div className="space-y-2 pt-2 pb-1">
                              {[
                                "Tech Giants (Amazon, Microsoft, Google)",
                                "Service Majors (TCS, Infosys, Accenture, Wipro)",
                                "Fast-Growth Indian Startups (Ola, Swiggy, Razorpay)",
                                "Leading Investment Banks & MNCs"
                              ].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setOnboarding((p) => ({ ...p, field: option }))}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                    onboarding.field === option
                                      ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md"
                                      : "bg-slate-900/35 border-slate-800/80 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span>{option}</span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${onboarding.field === option ? 'bg-cyan-400' : 'bg-slate-800'}`}></span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {onboardingStep === 4 && (
                          <div className="space-y-4 pt-2">
                            {/* GOAL MANIFESTATION: CAREER DESTINATION CARD */}
                            <motion.div 
                              initial={{ opacity: 0, y: 15, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="relative overflow-hidden bg-gradient-to-r from-cyan-950/30 to-slate-900/40 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-4"
                            >
                              {/* Ambient glowing blob */}
                              <div className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
                              
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                                      Career Destination Locked
                                    </span>
                                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2 py-0.5 rounded flex items-center gap-1">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                      Target Connected
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-slate-900/60">
                                    <div>
                                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Dream Role</span>
                                      <span className="text-xs font-semibold text-slate-200">{onboarding.dream}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Ecosystem</span>
                                      <span className="text-xs font-semibold text-slate-200 truncate block max-w-[200px]" title={onboarding.field}>
                                        {onboarding.field}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center pt-1.5">
                                    <div>
                                      <span className="text-[9px] text-slate-500 block uppercase font-mono text-left">Target Package</span>
                                      <span className="text-xs font-bold text-cyan-400 font-mono">{onboarding.salary} Target</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-900/80">
                                      <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
                                      />
                                      <span className="text-[9px] text-slate-400 font-mono">Linking Outcomes to Drills</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            <h2 className="font-display font-medium text-xl leading-snug tracking-tight text-white">
                              Finally, what feels like your deepest communication bottleneck?
                            </h2>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                              This calibrates our deep physical pausology patterns & shame de-conditioning drills.
                            </p>
                            <div className="space-y-2 pt-2">
                              {[
                                "I freeze under intense direct recruiter questions",
                                "Heavy regional mother-tongue influence (MTI)",
                                "Unsure of how to structure high-stakes client pitches",
                                "Excessive filler words (uhm, actually, basically)"
                              ].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setOnboarding((p) => ({ ...p, anxiety: option }))}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                    onboarding.anxiety === option
                                      ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md"
                                      : "bg-slate-900/35 border-slate-800/80 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span>{option}</span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${onboarding.anxiety === option ? 'bg-cyan-400' : 'bg-slate-800'}`}></span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 flex justify-between gap-3">
                        {onboardingStep > 1 ? (
                          <button
                            onClick={() => setOnboardingStep((s) => s - 1)}
                            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold"
                          >
                            Back
                          </button>
                        ) : (
                          <div></div>
                        )}

                        <button
                          onClick={() => {
                            if (onboardingStep < 4) {
                              setOnboardingStep((s) => s + 1);
                            } else {
                              setHasCompletedOnboarding(true);
                              setSelectedRole(onboarding.dream || "Senior Software Engineer");
                              setCurrentScreen(2); // Auto proceed to Dashboard
                            }
                          }}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                        >
                          {onboardingStep === 4 ? "Unlock Mission Control" : "Proceed"}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- SCREEN 2: MISSION CONTROL / DASHBOARD --- */}
                  {currentScreen === 2 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-dashboard">
                      <div className="space-y-4">
                        
                        {/* HIGH-VALUE CONVERSION PROMO BANNER OR ACTIVE premiumTier BADGE */}
                        {premiumTier === "free" ? (
                          <div id="free-tier-dashboard-banner" className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl p-3 flex justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 text-cyan-500">
                              <Zap className="w-16 h-16" />
                            </div>
                            <div className="relative z-10 flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse block shrink-0" />
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider uppercase block">PRO ACTIVE TRIAL LIMIT ACTIVE</span>
                                <p className="text-[10px] text-slate-400 leading-normal">
                                  Running on free level. Upgrade plan to unlock <strong className="text-white">Unlimited Speaking AI workouts</strong> + LinkedIn Badge.
                                </p>
                              </div>
                            </div>
                            <button
                              id="btn-inline-dashboard-upgrade"
                              onClick={() => setCurrentScreen(7)}
                              className="relative z-10 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all tracking-wider cursor-pointer"
                            >
                              Upgrade
                            </button>
                          </div>
                        ) : (
                          <div id="premium-tier-dashboard-banner" className="bg-gradient-to-r from-cyan-950/30 via-slate-950 to-cyan-950/30 border border-emerald-500/25 rounded-2xl p-3 flex justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 text-emerald-500">
                              <ShieldCheck className="w-16 h-16" />
                            </div>
                            <div className="relative z-10 flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider uppercase block flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                                  VERIFIED SKILLONY {premiumTier.toUpperCase()} ACTIVE
                                </span>
                                <p className="text-[10px] text-slate-300">
                                  Enjoy unlimited speaking sessions, custom job profiles, and direct HR recruiter pathways.
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold">
                              {premiumTier}
                            </span>
                          </div>
                        )}

                        {/* Upper Stats Row */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="bg-slate-900/60 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between">
                            <span className="text-[10px] text-slate-500 font-mono tracking-wider">BC COMMUNICATIONS INDEX</span>
                            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5">{currentBciScoreActual} / 10</span>
                          </div>
                          <div id="dashboard-active-streak" className="bg-slate-900/60 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between">
                            <span className="text-[10px] text-slate-500 font-mono tracking-wider">ACTIVE STREAK</span>
                            <span className="text-base font-bold text-orange-400 font-mono mt-0.5 flex items-center gap-1">
                              <Flame className="w-4 h-4 text-orange-500 fill-current" />
                              {activeStreak} Days
                            </span>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between">
                            <span className="text-[10px] text-slate-500 font-mono tracking-wider flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-rose-500" /> DAYS TIL GOAL
                            </span>
                            <span className="text-base font-bold text-rose-400 font-mono mt-0.5 flex items-center gap-1.5">
                              {daysTilInterview} Days
                            </span>
                          </div>
                        </div>

                        {/* COUNTDOWN & DAILY MISSIONS PROGRESS HUB */}
                        <div className="bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-900/10 border border-slate-900 rounded-2xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.03)] relative overflow-hidden">
                          {/* Top ambient glow */}
                          <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                            
                            {/* Left Col: Circular Progress indicator & countdown */}
                            <div className="flex flex-col items-center justify-center shrink-0 bg-slate-950/40 p-4 rounded-xl border border-slate-900/80 w-36 h-36">
                              <div className="relative w-24 h-24 flex items-center justify-center">
                                {/* SVG Circular track feedback */}
                                <svg className="w-full h-full transform -rotate-90">
                                  {/* Base track */}
                                  <circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    className="stroke-slate-900"
                                    strokeWidth="6"
                                    fill="transparent"
                                  />
                                  {/* Completed missions track of standard length (R = 38, Circum = 2 * PI * 38 ≈ 238.76) */}
                                  <circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    className="stroke-cyan-500 transition-all duration-500"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray="238.76"
                                    strokeDashoffset={238.76 - (238.76 * (dailyMissions.filter(m => m.completed).length / dailyMissions.length))}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                
                                {/* Inner labels of countdown */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-2xl font-bold font-mono text-white tracking-tighter">
                                    {daysTilInterview}
                                  </span>
                                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                                    Days Left
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 mt-1.5">
                                <button 
                                  onClick={() => setDaysTilInterview(p => Math.max(0, p - 1))}
                                  className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-all text-xs font-bold"
                                  title="Decrease days target"
                                >
                                  -
                                </button>
                                <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Target</span>
                                <button 
                                  onClick={() => setDaysTilInterview(p => Math.min(99, p + 1))}
                                  className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all text-xs font-bold"
                                  title="Increase days target"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Right Col: Missions list & progress dashboard stats */}
                            <div className="flex-1 w-full space-y-2">
                              <div className="flex justify-between items-center bg-slate-950/20 pb-1 border-b border-slate-900/80">
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-200">Interview Readiness Board</h4>
                                  <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">
                                    Complete drills to expand the countdown readiness loop
                                  </p>
                                </div>
                                <span className="text-[9px] bg-cyan-950/60 text-cyan-400 border border-cyan-900/50 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                                  {Math.round((dailyMissions.filter(m => m.completed).length / dailyMissions.length) * 100)}% DETECTED
                                </span>
                              </div>

                              <div className="space-y-1.5 pt-1.5">
                                {dailyMissions.map((m) => {
                                  const isExpanded = expandedProTipMissionId === m.id;
                                  return (
                                    <div key={m.id} className="flex flex-col gap-1">
                                      <div 
                                        onClick={() => {
                                          setDailyMissions(prev => {
                                            const togglingToComplete = !prev.find(item => item.id === m.id)?.completed;
                                            const next = prev.map(item => item.id === m.id ? { ...item, completed: !item.completed } : item);
                                            const wasAllCompleted = prev.every(item => item.completed);
                                            const isNowAllCompleted = next.every(item => item.completed);
                                            
                                            if (togglingToComplete) {
                                              setRatingValue(4); // Default to a positive starting point
                                              setRatingMission({ id: m.id, label: m.label });
                                              
                                              if (!wasAllCompleted && isNowAllCompleted) {
                                                setShowCelebration(true);
                                                setActiveStreak(curr => curr + 1);
                                              }
                                            } else {
                                              // Clear confidence rating score if toggled off
                                              setMissionConfidenceScores(curr => {
                                                const copy = { ...curr };
                                                delete copy[m.id];
                                                return copy;
                                              });
                                            }
                                            return next;
                                          });
                                        }}
                                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all ${
                                          m.completed 
                                            ? "bg-cyan-950/15 border-cyan-500/20 text-slate-300"
                                            : "bg-slate-950/20 border-slate-900/40 text-slate-400 hover:text-slate-300 hover:border-slate-800"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 overflow-hidden mr-1">
                                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 transition-all ${
                                            m.completed 
                                              ? "bg-cyan-500/25 border-cyan-400 text-cyan-400"
                                              : "border-slate-800 text-transparent"
                                          }`}>
                                            {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                          </div>
                                          <span className={`truncate text-left ${m.completed ? "line-through text-slate-500" : ""}`}>
                                            {m.label}
                                          </span>
                                        </div>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedProTipMissionId(prev => prev === m.id ? null : m.id);
                                          }}
                                          className={`p-1 rounded transition-all shrink-0 hover:bg-slate-800 ${
                                            isExpanded 
                                              ? "text-cyan-400 bg-slate-900" 
                                              : m.completed
                                                ? "text-slate-500 hover:text-cyan-400"
                                                : "text-slate-500 hover:text-cyan-400"
                                          }`}
                                          title="Show Career Pro Tip"
                                        >
                                          <Info className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      {isExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-2.5 ml-6 text-[10px] text-cyan-300 leading-relaxed font-sans"
                                        >
                                          <div className="flex items-start gap-1.5">
                                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                                            <div>
                                              <span className="font-bold text-cyan-200 uppercase font-mono tracking-wider block text-[9px]">CAREER PRO TIP</span>
                                              <p className="mt-0.5 text-slate-300 leading-normal font-sans">{MISSION_PRO_TIPS[m.id] || "Tailor this custom speaking target to your current career objectives. Deliberate practice is the key to vocal mastery."}</p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <form 
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newMissionLabel.trim()) return;
                                  const id = "custom_" + Date.now();
                                  setDailyMissions(prev => [
                                    ...prev,
                                    { id, label: newMissionLabel.trim(), completed: false }
                                  ]);
                                  setNewMissionLabel("");
                                }}
                                className="flex gap-2 pt-2 border-t border-slate-950/40"
                              >
                                <input
                                  id="input-new-mission"
                                  type="text"
                                  value={newMissionLabel}
                                  onChange={(e) => setNewMissionLabel(e.target.value)}
                                  placeholder="Add custom daily speaking goal..."
                                  maxLength={80}
                                  className="flex-1 min-w-0 bg-slate-1000/95 bg-slate-950 border border-slate-900/80 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                                />
                                <button
                                  id="btn-add-mission"
                                  type="submit"
                                  disabled={!newMissionLabel.trim()}
                                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.1)] hover:shadow-[0_0_16px_rgba(6,182,212,0.2)]"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  ADD
                                </button>
                              </form>
                            </div>
                            
                          </div>
                        </div>

                        {/* SPEAKING DRILLS CONSISTENCY HEATMAP */}
                        <div id="speaking-consistency-heatmap" className="bg-slate-900/50 border border-slate-900/80 rounded-2xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                Speaking Drill Consistency Heatmap
                              </h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Real-time dynamic recording indicators mapped to your active daily metrics
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                id="btn-heatmap-analysis"
                                onClick={() => setShowWeeklyBreakdown(true)}
                                className="text-[9px] bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.1)] hover:shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                              >
                                <TrendingUp className="w-3 h-3 text-cyan-400 animate-pulse" />
                                4-Week Analysis
                              </button>
                              <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                                {activeStreak >= 5 ? "Elite Streak Active" : "Streak Maintained"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/45 p-3 rounded-xl border border-slate-900/40">
                            {/* The Grid */}
                            <div className="flex items-center gap-3">
                              {/* Y-axis days */}
                              <div className="grid grid-rows-7 gap-1 text-[8px] font-mono text-slate-500 select-none pb-[1px] text-right w-6">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span className="text-slate-600">Sat</span>
                                <span className="text-slate-600">Sun</span>
                              </div>

                              {/* Matrix columns */}
                              <div className="flex gap-1.5">
                                {Array.from({ length: 6 }).map((_, weekIdx) => {
                                  return (
                                    <div key={weekIdx} className="flex flex-col gap-1">
                                      {/* Week indicator top label */}
                                      {weekIdx === 5 ? (
                                        <span className="text-[7.5px] text-cyan-400 font-bold font-mono tracking-tight uppercase text-center -mt-3.5 mb-0.5 select-none animate-pulse">
                                          NOW
                                        </span>
                                      ) : weekIdx === 0 ? (
                                        <span className="text-[7.5px] text-slate-600 font-mono text-center -mt-3.5 mb-0.5 select-none">
                                          W-5
                                        </span>
                                      ) : (
                                        <span className="text-[7.5px] text-slate-600 font-mono text-center -mt-3.5 mb-0.5 select-none opacity-0">
                                          -
                                        </span>
                                      )}

                                      {/* Main Days array top-to-bottom */}
                                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                                        const cell = makeCellData(dayIdx, weekIdx);
                                        
                                        // Dynamic styling class based on level of completion
                                        let bgClass = "bg-slate-950 border-slate-900/80 hover:border-slate-700/60";
                                        if (cell.completedCount === 1) {
                                          bgClass = "bg-cyan-950/20 border-cyan-900/35 hover:border-cyan-500/30";
                                        } else if (cell.completedCount === 2) {
                                          bgClass = "bg-cyan-900/30 border-cyan-800/40 hover:border-cyan-500/40";
                                        } else if (cell.completedCount === 3) {
                                          bgClass = "bg-cyan-800/50 border-cyan-600/50 hover:border-cyan-400/50";
                                        } else if (cell.completedCount === 4) {
                                          bgClass = "bg-cyan-500 border-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.25)] hover:bg-cyan-400 hover:scale-105";
                                        }

                                        return (
                                          <div
                                            key={dayIdx}
                                            id={`heatmap-cell-day-${dayIdx}-week-${weekIdx}`}
                                            onMouseEnter={() => setHoveredCell(cell)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                            className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 cursor-crosshair ${bgClass}`}
                                          />
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Legend and explanation info */}
                            <div className="flex-1 flex flex-col justify-between self-stretch py-0.5 max-w-xs md:border-l md:border-slate-900/50 md:pl-4">
                              <div className="text-[10px] leading-relaxed">
                                <span className="font-semibold text-slate-400 block font-mono text-[9px] uppercase tracking-wider">
                                  {hoveredCell ? (
                                    <>
                                      Week {hoveredCell.weekNum} • {hoveredCell.dayName}
                                      {hoveredCell.isCurrentWeek && <span className="text-cyan-400 ml-1 font-bold">(Current)</span>}
                                    </>
                                  ) : (
                                    "Interactive Insight Hub"
                                  )}
                                </span>
                                <p className={`mt-0.5 min-h-[28px] ${hoveredCell ? "text-cyan-300 font-medium" : "text-slate-500 font-sans"}`}>
                                  {hoveredCell ? hoveredCell.description : "Hover over any day grid cell to dissect historical metrics and active drill updates."}
                                </p>
                              </div>

                              {/* Less to More indicator keys */}
                              <div className="flex items-center gap-1 mt-2 md:mt-0 select-none">
                                <span className="text-[8px] text-slate-600 font-mono font-bold">Less</span>
                                <div className="w-2.5 h-2.5 rounded-sm bg-slate-950 border border-slate-900" />
                                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-950/20 border border-cyan-900/35" />
                                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-900/30 border border-cyan-800/40" />
                                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-800/50 border border-cyan-600/50" />
                                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500 border border-cyan-400" />
                                <span className="text-[8px] text-slate-600 font-mono font-bold">More</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TODAY'S MISSION CARD */}
                        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border border-cyan-500/35 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                          <div className="absolute right-0 top-0 translate-x-1 translate-y-1 text-slate-800 opacity-20">
                            <Zap className="w-32 h-32" />
                          </div>
                          <div className="relative space-y-2">
                            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-900/60 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                              TODAY&apos;S CAREER MISSION
                            </span>
                            <h3 className="text-sm font-semibold text-white">De-escalating a Client Delay Conflict</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
                              We simulating an overseas stakeholder upset about a 4-day database pipeline deployment delay. You must speak clearly, avoid submissive excuses, and offer structured, assertive milestones under 60-seconds.
                            </p>
                            <div className="pt-1.5 flex items-center gap-3">
                              <button 
                                onClick={() => setCurrentScreen(3)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                              >
                                <Mic className="w-3.5 h-3.5" />
                                Initiate Session
                              </button>
                              <span className="text-[10px] text-slate-500 font-mono">Est: 5 mins • Recharts analytics calibrated</span>
                            </div>
                          </div>
                        </div>

                        {/* CONFIDENCE TREND CHART GRID */}
                        <div className="bg-slate-900/50 border border-slate-900/80 rounded-2xl p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-xs font-semibold text-white">Confidence Growth Metric Timeline</h4>
                              <p className="text-[10px] text-slate-500 font-mono">Measuring voice resonance, pause control, and lexical pacing</p>
                            </div>
                            <span className="text-xs text-cyan-400 font-mono font-bold">+24.3% YoY</span>
                          </div>
                          <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={confidenceData}>
                                <defs>
                                  <linearGradient id="colorCore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#475569" fontSize={9} />
                                <YAxis stroke="#475569" fontSize={9} domain={[0, 100]} />
                                <Tooltip contentStyle={{ background: '#020617', border: '1px solid #1e293b' }} labelStyle={{ fontSize: 10, color: '#94a3b8' }} />
                                <Area type="monotone" dataKey="core" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCore)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* PEER CHALLENGE HUD CONTAINER */}
                        <div className="bg-slate-900/40 border border-slate-900/90 rounded-2xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-950/20 border border-orange-800/40 flex items-center justify-center">
                              <Users className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-200">Speaking Duel Waiting</h4>
                              <p className="text-[10px] text-slate-500 leading-relaxed">Rohan (9.1 BCI Score) issued a 1v1 Product Pitch confrontation!</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setCurrentScreen(6)}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-lg text-xs font-bold border border-slate-800/85 transition-all text-nowrap"
                          >
                            Enter Arena
                          </button>
                        </div>

                        {/* --- CAREER VALUE & SKILLONY ROI CALCULATOR --- */}
                        <div id="career-value-calculator-widget" className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-cyan-500/35 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.08)]">
                          {/* Inner tech ambient grid overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
                          <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400 pointer-events-none">
                            <Coins className="w-24 h-24" />
                          </div>

                          <div className="relative z-10 flex gap-2 items-start justify-between">
                            <div>
                              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                                PROJECTIONS MODULE
                              </span>
                              <h4 className="text-sm font-bold text-white mt-1 flex items-center gap-1.5 font-display">
                                <Coins className="w-4 h-4 text-cyan-400" />
                                Skillony Career ROI Calculator
                              </h4>
                              <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-light">
                                Compute how improving your BCI score triggers hiring probability & Lakhs Per Annum (LPA) salary package bumps.
                              </p>
                            </div>
                            {premiumTier !== "free" ? (
                              <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                                ROI MULTIPLIER SUNK
                              </span>
                            ) : (
                              <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase animate-pulse">
                                PROJECTION ACTIVE
                              </span>
                            )}
                          </div>

                          {/* Inputs Panel */}
                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-900/60" id="calculator-inputs-grid">
                            {/* Input 1: Current Salary */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-400">CURRENT SALARY (LPA)</span>
                                <span className="text-amber-400 font-bold font-mono">₹{calcCurrentSalary} LPA</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCalcCurrentSalary(prev => Math.max(2, prev - 1))}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-bold"
                                  title="Decrease Current Salary"
                                >
                                  -
                                </button>
                                <input
                                  type="range"
                                  min="2"
                                  max="40"
                                  value={calcCurrentSalary}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setCalcCurrentSalary(val);
                                    if (calcTargetSalary <= val) {
                                      setCalcTargetSalary(val + 1);
                                    }
                                  }}
                                  className="flex-1 accent-cyan-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = Math.min(40, calcCurrentSalary + 1);
                                    setCalcCurrentSalary(val);
                                    if (calcTargetSalary <= val) {
                                      setCalcTargetSalary(val + 1);
                                    }
                                  }}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-bold"
                                  title="Increase Current Salary"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Input 2: Target Salary */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-400">TARGET SALARY ASPIRATION</span>
                                <div className="flex items-center gap-1.5">
                                  {calcTargetSalary <= calcCurrentSalary + 1 && (
                                    <span className="text-[9px] text-amber-500 font-bold animate-pulse font-sans">Must exceed base (+1 LPA)</span>
                                  )}
                                  <span className="text-cyan-400 font-bold font-mono">₹{calcTargetSalary} LPA</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCalcTargetSalary(prev => Math.max(calcCurrentSalary + 1, prev - 1))}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-bold"
                                  title="Decrease Target Salary"
                                >
                                  -
                                </button>
                                <input
                                  type="range"
                                  min={calcCurrentSalary + 1}
                                  max="80"
                                  value={calcTargetSalary}
                                  onChange={(e) => setCalcTargetSalary(Math.max(calcCurrentSalary + 1, Number(e.target.value)))}
                                  className="flex-1 accent-cyan-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                                />
                                <button
                                  type="button"
                                  onClick={() => setCalcTargetSalary(prev => Math.min(80, prev + 1))}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-bold"
                                  title="Increase Target Salary"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* 3-Year Growth Trend Chart */}
                            <motion.div 
                              animate={(calcTargetSalary - calcCurrentSalary) > 5 ? {
                                boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 15px rgba(6,182,212,0.25)", "0 0 0px rgba(6,182,212,0)"],
                                borderColor: ["rgba(30,41,59,0.8)", "rgba(6,182,212,0.5)", "rgba(30,41,59,0.8)"]
                              } : {}}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                              }}
                              className={`md:col-span-2 bg-slate-900/40 border rounded-xl p-3.5 space-y-2.5 mt-2 transition-all duration-500 ${
                                (calcTargetSalary - calcCurrentSalary) > 5 ? "border-cyan-500/30" : "border-slate-800/80"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                                <div className="space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h4 className="text-[10px] sm:text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                                      3-Year Compounding Leverage Curve
                                    </h4>
                                    {(calcTargetSalary - calcCurrentSalary) > 5 && (
                                      <span className="text-[8px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1 animate-pulse">
                                        ⚡ HIGH LEVERAGE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[9px] text-slate-400">
                                    Compounded growth comparison of BCI-driven negotiation vs. standard corporate appraisal
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-mono">
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
                                    <span className="text-cyan-400 font-bold">Skillony Accelerated</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                                    <span className="text-slate-500">Standard Growth</span>
                                  </div>
                                </div>
                              </div>

                              <div className="h-32 w-full">
                                {(() => {
                                  const trendData = [
                                    {
                                      year: "Year 0",
                                      "Standard": Number(calcCurrentSalary.toFixed(1)),
                                      "Accelerated": Number(calcCurrentSalary.toFixed(1))
                                    },
                                    {
                                      year: "Yr 1",
                                      "Standard": Number((calcCurrentSalary * 1.08).toFixed(1)),
                                      "Accelerated": Number(calcTargetSalary.toFixed(1))
                                    },
                                    {
                                      year: "Yr 2",
                                      "Standard": Number((calcCurrentSalary * 1.166).toFixed(1)),
                                      "Accelerated": Number((calcTargetSalary * 1.12).toFixed(1))
                                    },
                                    {
                                      year: "Yr 3",
                                      "Standard": Number((calcCurrentSalary * 1.259).toFixed(1)),
                                      "Accelerated": Number((calcTargetSalary * 1.254).toFixed(1))
                                    }
                                  ];
                                  
                                  const CustomTooltip = ({ active, payload, label }: any) => {
                                    if (active && payload && payload.length) {
                                      const stdVal = payload.find((p: any) => p.dataKey === "Standard")?.value ?? 0;
                                      const accVal = payload.find((p: any) => p.dataKey === "Accelerated")?.value ?? 0;
                                      const diff = Math.max(0, accVal - stdVal);
                                      return (
                                        <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-[10px] space-y-1.5 font-mono min-w-[170px]">
                                          <p className="text-slate-400 font-bold border-b border-slate-800/60 pb-1">{label}</p>
                                          <div className="space-y-1">
                                            <div className="flex justify-between items-center gap-4">
                                              <span className="text-slate-500">Standard:</span>
                                              <span className="text-slate-300 font-bold">₹{stdVal} LPA</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-4">
                                              <span className="text-cyan-400">Accelerated:</span>
                                              <span className="text-cyan-400 font-bold">₹{accVal} LPA</span>
                                            </div>
                                          </div>
                                          {diff > 0 ? (
                                            <div className="pt-1 border-t border-slate-800/80 flex justify-between items-center gap-4 text-emerald-400 font-bold">
                                              <span>Leverage Gap:</span>
                                              <span>+₹{diff.toFixed(1)} LPA</span>
                                            </div>
                                          ) : (
                                            <div className="pt-1 border-t border-slate-800/80 text-[9px] text-slate-500 text-center">
                                              Base alignment point
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  };

                                  return (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                          </linearGradient>
                                          <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                                        <XAxis dataKey="year" stroke="#475569" fontSize={8} />
                                        <YAxis stroke="#475569" fontSize={8} width={25} unit="L" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="Standard" stroke="#64748b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorStd)" />
                                        <Area type="monotone" dataKey="Accelerated" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                                      </AreaChart>
                                    </ResponsiveContainer>
                                  );
                                })()}
                              </div>
                            </motion.div>

                            {/* Reset Button */}
                            <div className="md:col-span-2 flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCalcCurrentSalary(6);
                                  setCalcTargetSalary(15);
                                }}
                                className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                                </svg>
                                <span>Reset Values</span>
                              </button>
                            </div>
                          </div>

                          {/* Output Projections & ROI Results */}
                          {(() => {
                            const salaryJump = Math.max(0, calcTargetSalary - calcCurrentSalary);
                            
                            // Dynamic target BCI threshold
                            let requiredBci = 6.5;
                            if (calcTargetSalary > 30) requiredBci = 9.4;
                            else if (calcTargetSalary > 20) requiredBci = 8.8;
                            else if (calcTargetSalary > 12) requiredBci = 8.2;
                            else if (calcTargetSalary > 7) requiredBci = 7.5;

                            const bciGap = Math.max(0.1, Number((requiredBci - currentBciScoreActual).toFixed(1)));
                            
                            // Cost of Premium per year: ₹499 * 12 = 5988
                            // Net absolute package increase in Rupees
                            const absoluteSalaryIncreaseRupees = salaryJump * 100000;
                            const premiumAnnualCostRupees = 5988;
                            const roiMultiplier = absoluteSalaryIncreaseRupees > 0 ? (absoluteSalaryIncreaseRupees / premiumAnnualCostRupees) : 0;

                            return (
                              <div className="relative z-10 space-y-4" id="calculator-results-wrapper">
                                {/* Outputs grid cards */}
                                <div className="grid grid-cols-2 gap-3">
                                  {/* ROI card */}
                                  <div className="bg-gradient-to-r from-slate-950 to-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 flex flex-col justify-between">
                                    <span className="text-[8px] text-cyan-400 font-mono tracking-widest uppercase block">SKILLONY PREMIUM ROI</span>
                                    <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                                      {roiMultiplier > 0 ? `${roiMultiplier.toFixed(0)}x` : '0x'}
                                      <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">yield</span>
                                    </span>
                                    <p className="text-[9px] text-slate-500 mt-1">
                                      Returns ₹{salaryJump * 100000} package growth yearly on a standard college / regional base.
                                    </p>
                                  </div>

                                  {/* Required BCI Target */}
                                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex flex-col justify-between">
                                    <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase block">REQUIRED TARGET BCI</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                      <span className="text-xl font-bold font-mono text-white">
                                        {requiredBci} <span className="text-[10px] text-slate-500 font-sans font-normal">pts</span>
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-1">
                                      Your current score: <strong className="text-cyan-400">{currentBciScoreActual}</strong>. Need <strong className="text-amber-400 font-mono">+{bciGap}</strong> BCI points increase to confidently clear these panels.
                                    </p>
                                  </div>
                                </div>

                                {/* Free vs Premium Visual Acceleration bar graph */}
                                <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 space-y-3">
                                  <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-slate-400 uppercase tracking-tight">Time to bridge the ₹{salaryJump} LPA Gap:</span>
                                    <div className="flex items-center gap-3">
                                      <span className="text-red-400 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 block" /> Free: 18mo
                                      </span>
                                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" /> Premium: 3mo
                                      </span>
                                    </div>
                                  </div>

                                  {/* Timeline visual representation */}
                                  <div className="space-y-1.5">
                                    {/* Row 1: Free Tier */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                                        <span>Free level (Restricted 2 daily mock limits & generic static answers)</span>
                                        <span className="font-bold">18-24 Mo</span>
                                      </div>
                                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                                        <div className="bg-slate-700 h-full rounded-full transition-all" style={{ width: '20%' }} />
                                      </div>
                                    </div>

                                    {/* Row 2: Premium Tier */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[8.5px] text-cyan-400 font-mono font-bold">
                                        <span>♕ Skillony Premium (Unlimited workouts, active accent adaptation & HR routing)</span>
                                        <span className="text-emerald-400 font-black animate-pulse">3 Mo</span>
                                      </div>
                                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900/80">
                                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all shadow-[0_0_8px_rgba(6,182,212,0.6)]" style={{ width: '100%' }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Call to action panel promoting conversions */}
                                {premiumTier === "free" ? (
                                  <div className="pt-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedPlanUpgrade("premium");
                                        setCurrentScreen(7);
                                      }}
                                      className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white py-3 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer"
                                    >
                                      <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                                      Unlock {roiMultiplier > 0 ? `${roiMultiplier.toFixed(0)}x` : "150x"} Annual Placement ROI - Upgrade to Premium Now
                                    </button>
                                  </div>
                                ) : (
                                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-center text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    ✓ PREMIUM ACTIVE: {roiMultiplier > 0 ? roiMultiplier.toFixed(0) : "150"}x ROI ACCELERATION IS OFFICIALLY ACTIVE ON YOUR PROFILE!
                                  </div>
                                )}

                                <div className="pt-2 border-t border-slate-900/60 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const targetDream = onboarding?.dream || selectedRole || "Professional Leader";
                                      const currentBci = currentBciScoreActual || 6.2;
                                      const targetSalary = calcTargetSalary;
                                      const currentSalary = calcCurrentSalary;
                                      const salaryIncrease = Math.max(0, targetSalary - currentSalary);
                                      
                                      let targetRequiredBci = 6.5;
                                      if (targetSalary > 30) targetRequiredBci = 9.4;
                                      else if (targetSalary > 20) targetRequiredBci = 8.8;
                                      else if (targetSalary > 12) targetRequiredBci = 8.2;
                                      else if (targetSalary > 7) targetRequiredBci = 7.5;

                                      const defaultPost = `🚀 Just analyzed my career trajectory and communication impact loop with Skillony!

📊 BCI Score Level: Currently calibrated at ${currentBci}/10.0 Behavioural Communication Index.
🎯 Executive Target: Progressing from current position to a ₹${targetSalary} LPA package as an elite ${targetDream}.
💡 Communication Impact: Bridging a ₹${salaryIncrease} LPA annual leverage gap by mastering executive pausology, accent consistency, and high-pressure system evaluation models on corporate boards.

In high-stakes roles, speech confidence delivers actual, measurable career leverage. Excited to unlock the next level of structured verbal mastery.

Level up your verbal credentials with Skillony at skillony.ai! ♕

#CareerGrowth #SalaryNegotiation #Skillony #Leadership #SpeechConfidence #EffectiveCommunication`;

                                      setCustomLinkedinText(defaultPost);
                                      setShowLinkedinModal(true);
                                      setCopiedLinkedinText(false);
                                    }}
                                    className="w-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white py-2.5 px-4 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                  >
                                    <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
                                    <span>Share Brand & Salary Goal to LinkedIn</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                      </div>

                      <div className="pt-6 flex justify-between items-center text-xs text-slate-500 border-t border-slate-900/80">
                        <span>Calibration: {onboarding.dream} targeting {onboarding.salary} Target Package</span>
                        <button 
                          onClick={() => setCurrentScreen(1)}
                          className="hover:text-cyan-400 font-bold transition-all text-[11px]"
                        >
                          Modify Onboarding
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- SCREEN 3: AI SPEAKING SESSION WITH REAL-TIME FEEDBACK --- */}
                  {currentScreen === 3 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-speaking-session">
                      <div className="space-y-4">
                        
                        {/* Header Details */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">ACTIVE PRACTICE MODE</span>
                          </div>
                          {premiumTier === "free" ? (
                            <button
                              onClick={() => setCurrentScreen(7)}
                              className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold hover:bg-cyan-900 transition-all cursor-pointer"
                            >
                              ♕ UPGRADE TO PRO (UNLIMITED)
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-bold uppercase flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                              {premiumTier} Active
                            </span>
                          )}
                        </div>

                        {/* FEEDBACK OVERLAYS */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-slate-900/50 border border-slate-900/85 rounded-xl p-2.5 text-center flex flex-col justify-center">
                            <span className="text-[9px] text-slate-500 font-mono">FLOW SCORE</span>
                            <span className="text-lg font-bold font-mono text-cyan-400">{speakingStats.score}%</span>
                          </div>
                          <div className="col-span-2 bg-slate-900/50 border border-slate-900/85 rounded-xl p-2.5 text-center flex flex-col justify-center">
                            <span className="text-[9px] text-slate-500 font-mono">lexical pace</span>
                            <span className="text-xs font-semibold text-white text-nowrap truncate">{speakingStats.pace}</span>
                          </div>
                          <div className="bg-slate-900/50 border border-slate-900/85 rounded-xl p-2.5 text-center flex flex-col justify-center">
                            <span className="text-[9px] text-slate-500 font-mono">filler count</span>
                            <span className="text-lg font-bold font-mono text-amber-500">{speakingStats.fillers}</span>
                          </div>
                        </div>

                        {/* REAL-TIME SPEAKING CONTEXT DISPLAY */}
                        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto space-y-3 flex flex-col">
                          {chatHistory.map((h, i) => (
                            <div 
                              key={i} 
                              className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                                h.role === 'user' 
                                  ? 'bg-cyan-600/15 text-cyan-200 self-end border border-cyan-500/20' 
                                  : 'bg-slate-900/70 text-slate-300 self-start border border-slate-900'
                              }`}
                            >
                              <div className="text-[9px] font-mono text-slate-500 mb-1">
                                {h.role === 'user' ? 'YOU (Audio input)' : 'ELITE SPEAKING COACH'}
                              </div>
                              <p className="whitespace-pre-line">{h.text}</p>
                            </div>
                          ))}
                          {isSpeakingLoading && (
                            <div className="bg-slate-900 text-slate-400 p-3 rounded-xl max-w-[85%] text-xs self-start border border-slate-900 animate-pulse flex items-center gap-2">
                              <span className="inline-block w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></span>
                              Evaluating vocal resonance...
                            </div>
                          )}
                        </div>

                        {/* WAVY VOICE ANIMATION OR SUGGESTION */}
                        {speakingStats.suggestions.length > 0 && (
                          <div className="bg-cyan-950/20 border border-cyan-900/60 rounded-xl p-3">
                            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-300" /> Executive Vocab Upgrades:
                            </span>
                            <div className="space-y-1.5 text-[11px]">
                              {speakingStats.suggestions.map((s, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-4">
                                  <span className="text-slate-400 line-through">“{s.original}”</span>
                                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3 text-cyan-500 shrink-0" /> “{s.better}”
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Simulated audio waveforms */}
                        <div className="flex justify-center items-center gap-1.5 py-1 bg-slate-900/20 rounded-xl border border-slate-900/60">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div 
                              key={i} 
                              className={`w-1 rounded-full bg-cyan-400 transition-all duration-300 ${
                                isRecording 
                                  ? 'animate-pulse' 
                                  : 'opacity-40'
                              }`}
                              style={{ 
                                height: isRecording 
                                  ? `${Math.max(10, Math.floor(Math.random() * 45))}px` 
                                  : '12px' 
                              }}
                            ></div>
                          ))}
                          <span className="text-[10px] text-slate-500 font-mono ml-4">
                            {!isSpeechSupported 
                              ? "SPEECH UNSUPPORTED IN THIS BROWSER (PLEASE TYPE)" 
                              : isRecording 
                                ? "MIC ONLINE - RECORDING (SPEAK NOW...)" 
                                : "MIC STANDBY (TAP MIC BUTTON TO INITIATE)"}
                          </span>
                        </div>

                        {/* SPEECH AND MIC INPUT PANEL */}
                        <div className="flex gap-2.5">
                          <button
                            onClick={() => isSpeechSupported && setIsRecording(prev => !prev)}
                            disabled={!isSpeechSupported}
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                              !isSpeechSupported
                                ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed opacity-55'
                                : isRecording 
                                  ? 'bg-red-950/40 border-red-500 text-red-500 animate-pulse' 
                                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                            }`}
                            title={isSpeechSupported ? "Toggle microphone state and speak" : "Speech Recognition not supported in this browser"}
                          >
                            <Mic className="w-5 h-5" />
                          </button>
                          
                          <div className="flex-1 flex gap-2 relative">
                            <input 
                              type="text" 
                              value={speakingInput}
                              onChange={(e) => setSpeakingInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendSpeakingInput()}
                              placeholder="Type what you want to practice speaking..."
                              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 hover:border-slate-700 p-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                            />
                            <button 
                              onClick={handleSendSpeakingInput}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] shrink-0 flex items-center justify-center"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900">
                        <span>Pausology module active • Decibel tracking running</span>
                        <button 
                          onClick={() => {
                            setCurrentScreen(5); // Go View Speaking Resume
                          }}
                          className="text-cyan-400 hover:underline font-bold"
                        >
                          View Growth Certificate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- SCREEN 4: INTERVIEW SIMULATOR --- */}
                  {currentScreen === 4 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-interview-simulator">
                      {!interviewStarted ? (
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                          <div className="text-center space-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-md">
                              <Sparkles className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h2 className="font-display font-medium text-xl leading-snug tracking-tight text-white pt-2">
                              Elite System Integrator / Startup Interview Simulation
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                              Practice roles tailored around genuine system structures of multinational and local tech majors.
                            </p>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-3">
                            <h4 className="text-xs font-bold text-slate-300">CONFIGURE MOCK INTERVIEW</h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-500 font-mono block mb-1">TARGET FIRM</label>
                                <select 
                                  value={selectedCompany} 
                                  onChange={(e) => {
                                    setSelectedCompany(e.target.value);
                                    if (e.target.value === "Startups") {
                                      setSelectedRole("Product developer");
                                    } else {
                                      setSelectedRole("System Engineer");
                                    }
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
                                >
                                  <option value="TCS">TCS (Tata Consultancy)</option>
                                  <option value="Infosys">Infosys Technologies</option>
                                  <option value="Wipro">Wipro Limited (Premium 🔒)</option>
                                  <option value="Accenture">Accenture Digital (Premium 🔒)</option>
                                  <option value="Goldman Sachs">Goldman Sachs (Premium 🔒)</option>
                                  <option value="Google">Google India (Premium 🔒)</option>
                                  <option value="Amazon">Amazon AWS (Premium 🔒)</option>
                                  <option value="Microsoft">Microsoft IDC (Premium 🔒)</option>
                                  <option value="Meta">Meta Tech (Pro Elite 🔒)</option>
                                  <option value="McKinsey">McKinsey & Co. (Pro Elite 🔒)</option>
                                  <option value="Startups">Indian Early-Stage Startup (Pro-Elite 🔒)</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-500 font-mono block mb-1">INTELLIGENT ROLE</label>
                                <select 
                                  value={selectedRole} 
                                  onChange={(e) => setSelectedRole(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none"
                                >
                                  {onboarding.dream && (
                                    <option value={onboarding.dream}>{onboarding.dream} (Your Interest ✨)</option>
                                  )}
                                  <option value="System Engineer">System Engineer</option>
                                  <option value="Client Relationship Lead">Client Relationship Lead</option>
                                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                                  <option value="Product developer">Product developer</option>
                                  <option value="Project Delivery Specialist">Project Delivery Specialist</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-500 font-mono block mb-1">DURATION / INTENSITY</label>
                              <div className="grid grid-cols-3 gap-2">
                                {[3, 5, 8].map((qCount) => (
                                  <button
                                    key={qCount}
                                    onClick={() => setTotalQuestions(qCount)}
                                    className={`p-2 rounded-lg text-xs font-mono border transition-all ${
                                      totalQuestions === qCount
                                        ? "bg-cyan-950 border-cyan-500 text-white"
                                        : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200"
                                    }`}
                                  >
                                    {qCount} {qCount === 3 ? "Q (Express)" : "Questions"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleStartInterview}
                            id="btn-trigger-mock-interview"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3.5 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)] w-full"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            Initiate Interview Panel
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between">
                          
                          {/* Active Interview Progress */}
                          {!interviewFinished ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-900/80">
                                <div>
                                  <span className="text-[10px] text-slate-500 font-mono block">LIVE RECRUITER CASE PANEL</span>
                                  <h4 className="text-xs font-bold text-slate-200">{selectedCompany} • {selectedRole}</h4>
                                </div>
                                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900/50">
                                  CONVERSATION {currentQuestionIndex + 1} OF {totalQuestions}
                                </span>
                              </div>

                              {/* INTERVIEWER PANEL VISUAL */}
                              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex gap-3.5 items-start">
                                <div className="w-12 h-12 bg-slate-800/80 border border-slate-700 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-white text-base">
                                  {selectedCompany.slice(0, 2)}
                                </div>
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-900/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider inline-block">
                                    {selectedCompany} Senior Evaluator
                                  </span>
                                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                                    {currentQuestion || "Evaluating question indices..."}
                                  </p>
                                </div>
                              </div>

                              {/* USER ANSWER ENTRY */}
                              <div className="space-y-2.5">
                                <label className="text-[10px] text-slate-500 font-mono block">YOUR RESPONSE (Try to structure your answer using STAR method)</label>
                                <textarea
                                  value={interviewAnswerInput}
                                  onChange={(e) => setInterviewAnswerInput(e.target.value)}
                                  placeholder="Type or dictate your reply here..."
                                  rows={4}
                                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 p-3.5 rounded-xl text-xs text-slate-200 focus:outline-none placeholder-slate-600 leading-relaxed font-sans"
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => setInterviewStarted(false)}
                                  className="bg-slate-900 text-slate-400 px-4 py-3 rounded-xl border border-slate-800 text-xs hover:text-slate-200 hover:border-slate-700 transition-all font-semibold"
                                >
                                  Quit Trial
                                </button>
                                <button
                                  onClick={handleNextInterviewQuestion}
                                  disabled={interviewLoading || !interviewAnswerInput.trim()}
                                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] disabled:opacity-50"
                                >
                                  {interviewLoading ? "Analyzing Communication Delivery..." : currentQuestionIndex + 1 >= totalQuestions ? "Finalize Interview" : "Submit Answer & Continue"}
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* INTERVIEW SUMMARY PERFORMANCE OVERLAY */
                            <div className="space-y-4">
                              <div className="text-center pb-2 border-b border-slate-900">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-900/60 font-bold uppercase tracking-wider">
                                  MOCK ASSESSMENT SIGNED OFF
                                </span>
                                <h3 className="font-display font-medium text-lg text-white mt-1.5">Your Performance Assessment</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Analytic reports mapped straight to client readiness markers</p>
                              </div>

                              {/* SCORE CARDS ROW */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3 text-center">
                                  <span className="text-[10px] text-slate-500 font-mono block uppercase">employability SCORE</span>
                                  <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 inline-block">
                                    {interviewFeedback?.score || 82}%
                                  </span>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3 text-center">
                                  <span className="text-[10px] text-slate-500 font-mono block uppercase">SALARY LEVERAGE</span>
                                  <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 inline-block">
                                    {(interviewFeedback?.salaryNegotiationScore || 8)}/10
                                  </span>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3 text-center">
                                  <span className="text-[10px] text-slate-500 font-mono block uppercase">MTI FLEXIBILITY</span>
                                  <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 inline-block">
                                    {interviewFeedback?.corporateNeutralityScore || 88}%
                                  </span>
                                </div>
                              </div>

                              {/* SUGGESTED TEXT-FEEDBACK SUMMARY */}
                              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-3">
                                <div>
                                  <span className="text-[10px] text-slate-500 font-mono block">ACCREDITATIONS & CRITIQUE</span>
                                  <p className="mt-1 font-sans">{interviewFeedback?.feedbackHtml}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3">
                                  <div>
                                    <span className="text-[10px] text-emerald-400 font-mono font-bold block">✓ KEY STRENGTHS</span>
                                    <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400 text-[11px]">
                                      {(interviewFeedback?.strengths || ["Crisp professional vocabulary structures", "STAR presentation frameworks"]).map((st: string) => (
                                        <li key={st}>{st}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-amber-500 font-mono font-bold block">✗ BLIND SPOTS</span>
                                    <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400 text-[11px]">
                                      {(interviewFeedback?.weakSpots || ["Filler count triggers (saying 'actually' to fill pauses)"]).map((wk: string) => (
                                        <li key={wk}>{wk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* WORD COMPILING DECK */}
                              {interviewFeedback?.upgrades?.length > 0 && (
                                <div className="bg-cyan-950/15 border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                                  <span className="text-[10px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">
                                    RECOMMENDED LEXICAL UP-LEVELS FOR COGENT IMPACT
                                  </span>
                                  <div className="space-y-2">
                                    {interviewFeedback.upgrades.map((upg: any, ind: number) => (
                                      <div key={ind} className="bg-slate-950 p-2.5 rounded-lg text-xs space-y-1 border border-slate-900">
                                        <div className="flex justify-between items-center">
                                          <span className="text-slate-500 line-through">“{upg.original}”</span>
                                          <span className="text-cyan-300 font-bold">→ “{upg.better}”</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">{upg.why}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => setInterviewStarted(false)}
                                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl hover:bg-slate-800 transition-all font-semibold text-xs"
                                >
                                  Restart Panel
                                </button>
                                <button
                                  onClick={() => setCurrentScreen(5)}
                                  className="flex-1 bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-500 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  Add to Speaking Resumé
                                </button>
                              </div>

                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  )}

                  {/* --- SCREEN 5: CONFIDENCE SCORE / SPEAKING PROFILE --- */}
                  {currentScreen === 5 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-confidence-profile">
                      <div className="space-y-4">
                        <div className="text-center space-y-1">
                          <div className="w-12 h-12 bg-cyan-950/20 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                            <Award className="w-6 h-6" />
                          </div>
                          <h3 className="font-display font-medium text-lg text-white">Your Speaking Profile Badge</h3>
                          <p className="text-xs text-slate-500">Continuous employment indicators tracking over corporate metrics</p>
                        </div>

                        {/* SUB-TAB BAR */}
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900/60 w-full mb-1">
                          <button
                            id="tab-profile-roadmap"
                            onClick={() => setProfileSubTab("roadmap")}
                            className={`flex-1 text-center py-2 text-[10px] font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                              profileSubTab === "roadmap"
                                ? "bg-slate-900 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            CAREER ROADMAP
                          </button>
                          <button
                            id="tab-profile-certificate"
                            onClick={() => setProfileSubTab("certificate")}
                            className={`flex-1 text-center py-2 text-[10px] font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                              profileSubTab === "certificate"
                                ? "bg-slate-900 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            VERIFIED CREDENTIAL
                          </button>
                        </div>

                        {profileSubTab === "certificate" ? (
                          <div className="space-y-3.5">
                            {/* BULAND SCORECARD SUMMARY */}
                            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-4 space-y-3.5 animate-fadeIn">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Verifying Authority:</span>
                                <span className="text-cyan-400 font-mono font-bold tracking-wider">SKILLONY AI ACCREDITED</span>
                              </div>

                              <div className="pt-2 border-t border-slate-950 space-y-2">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-500">Candidate Target LPA:</span>
                                  <span className="text-slate-200">{onboarding.salary} Target (Hiring Matrix: Ready)</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-500">Corporate Target Field:</span>
                                  <span className="text-slate-200">{onboarding.field}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-500">Speech-anxiety Resiliency:</span>
                                  <span className="text-emerald-400">89% COMPOSURE LEVEL (High-stakes cleared)</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-slate-500">Mother Tongue Influence:</span>
                                  <span className="text-emerald-400">Dialect Neutralized / Dynamic Adapt</span>
                                </div>
                              </div>

                              <div className="border-t border-slate-950 pt-3 relative overflow-hidden flex justify-between items-center bg-slate-950/70 p-3 rounded-xl">
                                <div>
                                  <span className="text-[10px] text-slate-500 block font-mono">BCI SCORE</span>
                                  <span className="text-sm font-bold text-white font-mono">Verified BCI {currentBciScoreActual} / 10.0</span>
                                </div>
                                <div className="bg-cyan-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider">
                                  {currentBciScoreActual >= 9.0 ? "PLATINUM GRADE" : currentBciScoreActual >= 8.0 ? "GOLD GRADE" : currentBciScoreActual >= 7.2 ? "SILVER GRADE" : "BRONZE GRADE"}
                                </div>
                              </div>
                            </div>

                            {/* THE DIGITAL CERTIFICATE FRAME */}
                            {premiumTier === "free" ? (
                              <div className="border-2 border-dashed border-red-500/20 rounded-2xl p-5 bg-slate-950 text-center space-y-3 relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex flex-col justify-center items-center p-4 text-center z-10 space-y-3">
                                  <div className="w-10 h-10 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center text-red-400">
                                    <Lock className="w-5 h-5" />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-white">SKILLONY VERIFICATION LOCKED</h4>
                                    <p className="text-[10px] text-slate-400 leading-normal max-w-xs">
                                      Generating verified auditive QR credentials and professional certificates requires an active subscription tier (Skillony Premium/Pro).
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => setCurrentScreen(7)}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                                  >
                                    Get Verified Credentials Now
                                  </button>
                                </div>
                                <div className="opacity-20 blur-sm">
                                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest inline-block">
                                    SHARE TO LINKEDIN PORTFOLIO
                                  </span>
                                  <h4 className="text-xs font-semibold text-white">Dynamic Vocal QR Verification Badge</h4>
                                  <p className="text-[10px] text-slate-500 tracking-wide leading-relaxed">
                                    Embeds directly as a verified speaking credential. Recruiter analytics scan your highest rated standup records directly.
                                  </p>
                                  <div className="bg-slate-900 border border-slate-800 p-2 text-xs font-mono text-cyan-300 inline-block rounded-lg">
                                    skillony.ai/verify/c-982-fdb01
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-solid border-emerald-500/40 rounded-2xl p-5 bg-slate-950 text-center space-y-3.5 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <div className="absolute right-0 top-0 opacity-15 scale-150 text-emerald-400">
                                  <Award className="w-24 h-24" />
                                </div>
                                
                                <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest inline-block">
                                  ✓ ACTIVE VERIFIED PORTFOLIO
                                </span>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic BCI Speaking credential</h4>
                                <p className="text-[10px] text-slate-400 tracking-wide leading-relaxed">
                                  This credential confirms candidate status ready to present within high-stakes panels. Embed anywhere on resume or LinkedIn profile.
                                </p>
                                
                                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-left">
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-slate-500 font-mono block">VERIFICATION SERIAL CODE</span>
                                    <span className="text-xs font-mono font-bold text-emerald-400">
                                      SKILLONY-{premiumTier.toUpperCase()}-{(user?.uid || "MOCK").substring(0,8).toUpperCase()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => alert("Verified credentials PDF summary generated successfully! Download has started automatically.")}
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-mono tracking-wider transition-all"
                                  >
                                    EXPORT PDF
                                  </button>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-2.5 text-[11px] font-mono text-emerald-400 block rounded-lg select-all cursor-pointer">
                                  skillony.ai/verify/c-{(user?.uid || "MOCK").substring(0,6)}-{(activeStreak * 123)}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3.5 animate-fadeIn">
                            {/* OVERALL PROGRESS COMPILER */}
                            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-3.5 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="text-[9px] text-slate-500 font-mono uppercase block">CURRENT GRADED RANK</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[11px] font-bold text-white leading-tight">
                                      {CAREER_LEVELS[getUnlockedLevelIndex()].name}
                                    </span>
                                    <span className="text-[8px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.2 rounded font-mono font-bold">
                                      {CAREER_LEVELS[getUnlockedLevelIndex()].badge}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] text-slate-500 font-mono uppercase block">METRICS IN USE</span>
                                  <span className="text-[10px] font-bold text-orange-400 font-mono">
                                    {currentBciScore} BCI • {completedMissionsCount}/5 Drills
                                  </span>
                                </div>
                              </div>
                              
                              {/* Visual Progress Bar */}
                              <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex p-[1px]">
                                {CAREER_LEVELS.map((lvl, index) => {
                                  const isUnlocked = currentBciScore >= lvl.bciMin && completedMissionsCount >= lvl.missionsRequired;
                                  return (
                                    <div 
                                      key={lvl.id}
                                      style={{ width: "25%" }}
                                      className={`h-full first:rounded-l-full last:rounded-r-full border-r border-slate-950/40 transition-all ${
                                        isUnlocked 
                                          ? "bg-gradient-to-r from-cyan-500 to-emerald-400" 
                                          : "bg-slate-800/40"
                                      }`}
                                    />
                                  );
                                })}
                              </div>
                            </div>

                            {/* INTERACTIVE LEVEL LISTING */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex flex-col">
                              {CAREER_LEVELS.map((level, idx) => {
                                const isUnlocked = currentBciScore >= level.bciMin && completedMissionsCount >= level.missionsRequired;
                                const isSelected = selectedRoadmapLevel === idx;
                                
                                return (
                                  <div 
                                    key={level.id}
                                    onClick={() => setSelectedRoadmapLevel(idx)}
                                    className={`border p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 relative overflow-hidden ${
                                      isUnlocked 
                                        ? isSelected 
                                          ? "bg-slate-900 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                                          : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80"
                                        : isSelected
                                          ? "bg-slate-950 border-slate-900 opacity-80"
                                          : "bg-slate-950/60 border-slate-900/30 opacity-50 hover:opacity-75"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                            isUnlocked 
                                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40" 
                                              : "bg-slate-900 text-slate-500 border border-slate-800"
                                          }`}>
                                            {level.badge}
                                          </span>
                                          <span className="text-[9px] text-slate-500 font-mono">
                                            {level.salaryMin} - {level.salaryMax}
                                          </span>
                                        </div>
                                        <h4 className="text-[11px] font-bold text-white mt-0.5">{level.name}</h4>
                                      </div>

                                      <div className="text-right">
                                        {isUnlocked ? (
                                          <span className="text-[9px] text-emerald-400 font-bold font-mono flex items-center gap-0.5 justify-end">
                                            <CheckCircle2 className="w-2.5 h-2.5" /> READY
                                          </span>
                                        ) : (
                                          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5 justify-end">
                                            <Lock className="w-2.5 h-2.5 text-slate-600" /> LOCKED
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Detailed View Expanded */}
                                    {isSelected && (
                                      <div className="border-t border-slate-950 mt-1.5 pt-2 space-y-2 text-[10px]">
                                        <div className="bg-slate-950/80 p-2 rounded-lg space-y-1">
                                          <span className="text-[8px] text-slate-500 font-mono uppercase block">Tier Criteria requirements</span>
                                          <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400">Verifiable BCI Score:</span>
                                            <span className={`font-mono font-bold ${currentBciScore >= level.bciMin ? "text-emerald-400" : "text-amber-500"}`}>
                                              {currentBciScore} / {level.bciMin}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400">Competency Drills:</span>
                                            <span className={`font-mono font-bold ${completedMissionsCount >= level.missionsRequired ? "text-emerald-400" : "text-amber-500"}`}>
                                              {completedMissionsCount} / {level.missionsRequired}
                                            </span>
                                          </div>
                                        </div>

                                        {!isUnlocked && (
                                          <div className="bg-amber-950/10 border border-amber-900/30 rounded-lg p-2 text-amber-500/90 text-[9px] space-y-0.5">
                                            <span className="font-bold font-mono text-[8px] uppercase block tracking-wider">🔒 Missing Prerequisites</span>
                                            <div className="space-y-0.5 leading-normal">
                                              {currentBciScore < level.bciMin && (
                                                <div>• BCI score deficient by <span className="font-bold underline text-white">{(level.bciMin - currentBciScore).toFixed(1)}</span> points.</div>
                                              )}
                                              {completedMissionsCount < level.missionsRequired && (
                                                <div>• Needs <span className="font-bold underline text-white">{level.missionsRequired - completedMissionsCount}</span> more completed daily drill(s).</div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        <div>
                                          <span className="text-[8px] text-slate-500 font-mono uppercase block mb-1">Target competencies</span>
                                          <div className="flex flex-wrap gap-1 hover:brightness-110">
                                            {level.skills.map((s, si) => (
                                              <span key={si} className="text-[8px] bg-slate-950 text-slate-400 border border-slate-900 px-1.5 py-0.2 rounded font-sans">
                                                🛡️ {s}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[10px]">
                                          <span className="text-slate-500 block uppercase text-[8px] font-mono">Recruiter Discovery Level</span>
                                          <span className="text-cyan-400 font-mono font-bold mt-0.5 block">{level.recruiterStatus}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* INTERACTIVE ROADMAP SIMULATOR CONTROLS */}
                            <div className="bg-slate-950 border border-slate-900/60 rounded-2xl p-3.5 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-widest block flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                  ROADMAP INTENT SIMULATOR
                                </span>
                                {(bciSliderOverride !== null || missionsOverride !== null) && (
                                  <button 
                                    onClick={() => {
                                      setBciSliderOverride(null);
                                      setMissionsOverride(null);
                                    }}
                                    className="text-[9px] font-mono text-cyan-400 hover:underline cursor-pointer"
                                  >
                                    Reset Simulator
                                  </button>
                                )}
                              </div>
                              <p className="text-[9px] text-slate-500 leading-normal">
                                Override scores and drill completes below to preview unlocking elite Indian career opportunities immediately.
                              </p>

                              <div className="space-y-2.5">
                                {/* BCI Slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono">
                                    <span className="text-slate-400">Simulate BCI Score:</span>
                                    <span className="text-cyan-400 font-bold">{currentBciScore} / 10.0</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="5.0" 
                                    max="10.0" 
                                    step="0.1" 
                                    value={currentBciScore} 
                                    onChange={(e) => setBciSliderOverride(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                  />
                                </div>

                                {/* Completes Counter */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono mb-1">
                                    <span className="text-slate-400">Simulate Drill Completions:</span>
                                    <span className="text-orange-400 font-bold">{completedMissionsCount} Drills</span>
                                  </div>
                                  <div className="flex gap-1.5">
                                    {[0, 1, 2, 3, 4, 5].map((val) => (
                                      <button
                                        key={val}
                                        onClick={() => setMissionsOverride(val)}
                                        className={`flex-1 text-[9px] font-mono font-bold py-1 rounded transition-all cursor-pointer ${
                                          completedMissionsCount === val
                                            ? "bg-orange-500 text-white border border-orange-400"
                                            : "bg-slate-950 text-slate-400 border border-slate-900"
                                        }`}
                                      >
                                        {val}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="pt-6 flex justify-between gap-3">
                        <button
                          onClick={() => setCurrentScreen(2)}
                          className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 py-3 rounded-xl text-xs hover:text-slate-200 transition-all font-bold"
                        >
                          Return Home
                        </button>
                        <button
                          onClick={() => setCurrentScreen(7)}
                          className="flex-1 bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-500 text-xs transition-all flex items-center justify-center gap-1 shadow-md"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Premium Access
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- SCREEN 6: COMMUNITY / BATTLE ARENA --- */}
                  {currentScreen === 6 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-community">
                      <div className="space-y-4">
                        
                        {/* Title and stats heading */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-orange-400 font-mono block">MULTIPLAYER MATCH ROOMS</span>
                            <h3 className="text-base font-semibold text-white tracking-tight">The Skillony Speaking Arena</h3>
                          </div>
                          <span className="text-[11px] bg-orange-950/40 text-orange-400 border border-orange-900 px-2.5 py-0.5 rounded-lg font-mono flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-current" />
                            1,480 Online
                          </span>
                        </div>

                        {/* COHORT BATTLE MATCHUPS PANEL */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] text-slate-500 font-mono block uppercase">ACTIVE PEER WAGER SHOWDOWNS</span>
                          
                          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-3.5 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-100">Live 1v1 Elevator Pitch Battle</span>
                              <span className="text-[10px] text-orange-450 bg-orange-950/20 px-1.5 py-0.2 rounded font-mono font-bold">Wager: 100 XP</span>
                            </div>

                            {/* Match profile structures */}
                            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-900/80">
                              <div className="text-center flex-1">
                                <span className="text-xs font-semibold text-cyan-400 block">YOU</span>
                                <span className="text-[10px] text-slate-500 font-mono">BCI 8.4</span>
                              </div>
                              <div className="text-center font-mono font-bold text-slate-600 px-3">VS</div>
                              <div className="text-center flex-1">
                                <span className="text-xs font-semibold text-rose-400 block">Rohan K. (Noida)</span>
                                <span className="text-[10px] text-slate-500 font-mono">BCI 9.1</span>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-relaxed text-center italic">
                              Goal: Pitch an AI automated logistics product to US retail deciders in 45-seconds.
                            </p>

                            <button 
                              onClick={() => {
                                alert("Entering speaking battle lobby... microphone synchronizing.");
                                setCurrentScreen(3);
                              }}
                              className="bg-orange-600 hover:bg-orange-500 text-white w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                            >
                              Commence Battle
                            </button>
                          </div>
                        </div>

                        {/* LEADERBOARD LIST */}
                        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 space-y-3.5">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                            <span>COHORT PLACEMENT LEADERBOARD</span>
                            <span className="text-cyan-400">BATCH #14</span>
                          </div>

                          <div className="space-y-2">
                            {[
                              { rank: 1, name: "Prerna M. (Indore)", score: "BCI 9.6", salary: "18 LPA Target" },
                              { rank: 2, name: "Siddharth D. (Patna)", score: "BCI 9.4", salary: "12 LPA Target" },
                              { rank: 3, name: "Amit S. (Indore)", score: "BCI 9.2", salary: "15 LPA Target" }
                            ].map((user) => (
                              <div key={user.rank} className="flex justify-between items-center text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-900/40">
                                <div className="flex items-center gap-3">
                                  <span className={`font-mono font-bold ${user.rank === 1 ? 'text-yellow-400' : 'text-slate-400'}`}>#{user.rank}</span>
                                  <div>
                                    <span className="text-slate-200 block">{user.name}</span>
                                    <span className="text-[9px] text-slate-500">{user.salary}</span>
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-cyan-400">{user.score}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 text-center text-[10px] text-slate-500 border-t border-slate-900">
                        <span>Cohort peer-grading system audited in real-time</span>
                      </div>
                    </div>
                  )}

                  {/* --- SCREEN 7: PREMIUM UPGRADE / CONVERSION --- */}
                  {currentScreen === 7 && (
                    <div className="flex-1 flex flex-col justify-between" id="screen-sub-upgrade">
                      <div className="space-y-4">
                        <div className="text-center space-y-1">
                          <div className="w-12 h-12 bg-cyan-950/20 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                          </div>
                          <h3 className="font-display font-medium text-lg text-white">Unlock Skillony Professional Access</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Stop doing grammar drills. Invest in the absolute transactional tools of wealth escalation.
                          </p>
                        </div>

                        {/* STREAK REMINDER SHIELD */}
                        <div id="premium-streak-reminder-shield" className="bg-slate-900/40 border border-slate-900/60 rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden">
                          <div className="w-12 h-12 rounded-xl bg-orange-950/25 border border-orange-900/50 flex flex-col justify-center items-center text-orange-400 shrink-0">
                            <Flame className="w-6 h-6 fill-current animate-pulse text-orange-500" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-orange-400 font-mono block uppercase font-bold tracking-wider">YOUR ACCUMULATED CAPITAL PROGRESS</span>
                            <h4 className="text-xs font-bold text-white">{activeStreak}-Day Active Streak Safe</h4>
                            <p className="text-[10px] text-slate-400">You are already ahead of 92% of local applicants. Secure your edge.</p>
                          </div>
                          {premiumTier !== "free" && (
                            <span className="absolute top-2 right-2 text-[8px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900 font-bold font-mono">
                              PREMIUM ACTIVE
                            </span>
                          )}
                        </div>

                        {/* HIGH CONVERSION PRICING SELECTOR CARDS */}
                        <div className="grid grid-cols-2 gap-3" id="premium-plans-cards-holder">
                          {/* BULAND PREMIUM */}
                          <button
                            type="button"
                            onClick={() => setSelectedPlanUpgrade("premium")}
                            className={`text-left rounded-2xl p-4 relative flex flex-col justify-between transition-all cursor-pointer ${
                              selectedPlanUpgrade === "premium"
                                ? "bg-slate-950 border-2 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                : "bg-slate-900/30 border border-slate-900 hover:border-slate-800"
                            }`}
                          >
                            {selectedPlanUpgrade === "premium" && (
                              <span className="absolute top-0 right-3 -translate-y-1/2 bg-cyan-500 text-slate-950 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                SELECTED
                              </span>
                            )}
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">★ SKILLONY PREMIUM</span>
                              <span className="text-lg font-bold text-white font-mono block mt-1">₹499 <span className="text-[10px] text-slate-500 font-sans font-normal">/ mo</span></span>
                              <p className="text-[9px] text-slate-400 leading-relaxed mt-1.5">
                                Perfect for entry level professionals seeking service major readiness.
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPlanUpgrade === "premium" ? "border-cyan-400 bg-cyan-950 text-cyan-400" : "border-slate-700"}`}>
                                {selectedPlanUpgrade === "premium" && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span className="text-[10.5px] text-cyan-400 font-bold font-mono uppercase tracking-wider">Standard Plan</span>
                            </div>
                          </button>

                          {/* BULAND PRO */}
                          <button
                            type="button"
                            onClick={() => setSelectedPlanUpgrade("pro")}
                            className={`text-left rounded-2xl p-4 relative flex flex-col justify-between transition-all cursor-pointer ${
                              selectedPlanUpgrade === "pro"
                                ? "bg-slate-950 border-2 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                                : "bg-slate-900/30 border border-slate-900 hover:border-slate-800"
                            }`}
                          >
                            {selectedPlanUpgrade === "pro" && (
                              <span className="absolute top-0 right-3 -translate-y-1/2 bg-amber-500 text-slate-950 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                LORDS OF CAREER
                              </span>
                            )}
                            <div>
                              <span className="text-[9px] text-amber-500 block uppercase font-mono font-bold">💎 SKILLONY PRO ELITE</span>
                              <span className="text-lg font-bold text-white font-mono block mt-1">₹1,499 <span className="text-[10px] text-slate-500 font-sans font-normal">/ mo</span></span>
                              <p className="text-[9px] text-slate-400 leading-relaxed mt-1.5">
                                Advanced salary negotiation drills, direct HR audio CV routing, verified QR badges.
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPlanUpgrade === "pro" ? "border-amber-400 bg-amber-950 text-amber-400" : "border-slate-700"}`}>
                                {selectedPlanUpgrade === "pro" && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span className="text-[10.5px] text-amber-400 font-bold font-mono uppercase tracking-wider">Elite Placement</span>
                            </div>
                          </button>
                        </div>

                        {/* PLAN COMPARISON MATRIX */}
                        <div className="bg-slate-950/80 border border-slate-900/80 rounded-2xl p-4 space-y-3">
                          <h4 className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider text-center border-b border-slate-900 pb-2">
                            Subscription Benefits Comparison Matrix
                          </h4>
                          <div className="space-y-2 text-[10.5px] font-mono">
                            {/* Comparison Row 1 */}
                            <div className="flex justify-between items-center bg-slate-900/10 p-1.5 rounded">
                              <span className="text-slate-400">Daily Speaking Drills:</span>
                              <span className="text-slate-300">Free: 2 Limit • <strong className="text-cyan-400">Premium/Pro: UNLIMITED</strong></span>
                            </div>
                            {/* Comparison Row 2 */}
                            <div className="flex justify-between items-center bg-slate-900/10 p-1.5 rounded">
                              <span className="text-slate-400">Company Mock Panels:</span>
                              <span className="text-slate-300">Free: 2 Companies • <strong className="text-cyan-400">Premium/Pro: ALL 20+</strong></span>
                            </div>
                            {/* Comparison Row 3 */}
                            <div className="flex justify-between items-center bg-slate-900/10 p-1.5 rounded">
                              <span className="text-slate-400">Direct Recruiter Routing:</span>
                              <span className="text-slate-300">Free: Locked • Premium: Trailing Review • <strong className="text-amber-400">Pro: DIRECT SYNC</strong></span>
                            </div>
                            {/* Comparison Row 4 */}
                            <div className="flex justify-between items-center bg-slate-900/10 p-1.5 rounded">
                              <span className="text-slate-400">LinkedIn Certificate QR:</span>
                              <span className="text-slate-300">Free: Locked • Premium: Active Badge • <strong className="text-amber-400">Pro: Verified PDF Serial</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* CURRENT ACCOUNT STATUS BLOCK */}
                        <div className="text-center">
                          <p className="text-[10.5px] text-slate-500">
                            Current level: <strong className="text-slate-300 uppercase font-mono">{premiumTier} Access</strong> • {premiumTier === "free" ? "Highly limited features" : "High-impact verified status active"}
                          </p>
                        </div>

                      </div>

                      {/* PAYMENT ACTIONS AND SIMULATORS */}
                      <div className="pt-6 space-y-4">
                        {premiumTier !== "free" && (
                          <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-center text-emerald-400 text-xs">
                            ✓ Your account is already upgraded to <strong className="uppercase">{premiumTier}</strong>. Enjoy unlimited cognitive speaking workouts!
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentUpiId(user ? `${user.email?.split('@')[0]}@okaxis` : "career_dreamer@okicici");
                            setPaymentStep("upi-confirm");
                            setShowPaymentCheckoutModal(true);
                          }}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white w-full py-3.5 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-cyan-100" />
                          Proceed to UPI / Razorpay Payment (₹{selectedPlanUpgrade === "premium" ? "499" : "1,499"})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- INTERACTIVE BHIM UPI / RAZORPAY CHECKOUT SIMULATOR DIALOG --- */}
                  {showPaymentCheckoutModal && (
                    <div 
                      id="payment-checkout-modal"
                      className="absolute inset-0 bg-slate-950/96 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] max-w-sm w-full space-y-4 relative overflow-hidden text-left"
                      >
                        {/* High tech visual border background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />

                        {/* Dismiss payment */}
                        <button
                          onClick={() => setShowPaymentCheckoutModal(false)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-all p-1.5 rounded-full hover:bg-slate-800/80 z-20"
                          title="Cancel payment"
                          disabled={isVerifyingPayment}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="relative z-10 space-y-4">
                          {/* Top Payment logo and header */}
                          <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                            <div>
                              <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                                SECURE GATEWAY (BHIM)
                              </span>
                              <h3 className="font-display font-bold text-sm text-white mt-1">
                                Razorpay Instant Collect API
                              </h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-500 font-mono block">PLAN PRICE</span>
                              <span className="text-sm font-bold text-cyan-400 font-mono">
                                ₹{selectedPlanUpgrade === "premium" ? "499.00" : "1,499.00"}
                              </span>
                            </div>
                          </div>

                          {paymentStep === "upi-confirm" && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                Complete your subscription to <strong className="text-white capitalize">{selectedPlanUpgrade}</strong>. Enter your personal Virtual Payment Address (VPA) below or scan the generated secure QR code.
                              </p>

                              {/* Simulated Procedural QR Code */}
                              <div className="flex justify-center flex-col items-center gap-1.5 py-1">
                                <div className="border border-cyan-500/30 p-2.5 rounded-2xl bg-white flex justify-center items-center shadow-[0_0_20px_rgba(6,182,212,0.1)] relative">
                                  {/* Beautiful schematic QR Representation CSS */}
                                  <div className="w-28 h-28 bg-slate-950 flex flex-wrap p-1.5 rounded-lg gap-1 border-4 border-white">
                                    {/* Procedural grid pixels */}
                                    <div className="w-8 h-8 border-4 border-cyan-500 m-0.5 rounded"></div>
                                    <div className="flex-1 flex flex-wrap gap-0.5 p-0.5 justify-end">
                                      <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
                                      <div className="w-4 h-4 bg-slate-800 rounded-sm"></div>
                                      <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
                                    </div>
                                    <div className="w-full flex justify-between">
                                      <div className="w-4 h-4 bg-cyan-400 rounded-sm"></div>
                                      <div className="w-6 h-6 border-2 border-dashed border-cyan-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
                                      </div>
                                    </div>
                                    <div className="w-8 h-8 border-4 border-cyan-500 m-0.5 rounded self-end"></div>
                                  </div>
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider text-center">
                                  scan upi qr code count: 04:59
                                </span>
                              </div>

                              {/* UPI Input Field */}
                              <div className="space-y-1.5" id="upi-input-container">
                                <label className="text-[9px] text-slate-400 font-mono tracking-wider block uppercase">
                                  YOUR VPA / UPI ID REFERENCE
                                </label>
                                <input
                                  type="text"
                                  value={paymentUpiId}
                                  onChange={(e) => setPaymentUpiId(e.target.value)}
                                  placeholder="username@okaxis"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono"
                                />
                              </div>

                              {/* Action controls */}
                              <div className="pt-2 border-t border-slate-900 flex gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setShowPaymentCheckoutModal(false)}
                                  className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-500 hover:text-slate-400 font-mono text-xs py-2.5 rounded-xl transition-all"
                                >
                                  CANCEL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!paymentUpiId.trim()) return;
                                    setPaymentStep("gateway-animation");
                                    setIsVerifyingPayment(true);
                                    // Smoothly animate transition mimicking high-fidelity bank API latency
                                    setTimeout(() => {
                                      setPremiumTier(selectedPlanUpgrade);
                                      setPaymentStep("success");
                                      setIsVerifyingPayment(false);
                                      setShowCelebration(true);
                                    }, 2400);
                                  }}
                                  className="flex-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold font-mono text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                >
                                  <ShieldCheck className="w-4 h-4 text-cyan-200" />
                                  CONFIRM & SIM PAY
                                </button>
                              </div>
                            </div>
                          )}

                          {paymentStep === "gateway-animation" && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                              <div className="relative w-16 h-16">
                                <motion.div 
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                  className="absolute inset-0 border-4 border-solid border-cyan-500 border-t-transparent rounded-full"
                                />
                                <div className="absolute inset-2 bg-slate-950 rounded-full flex items-center justify-center">
                                  <ShieldCheck className="w-6 h-6 text-cyan-400 animate-pulse" />
                                </div>
                              </div>
                              <div className="text-center space-y-1">
                                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                                  Processing Transaction
                                </h4>
                                <p className="text-[10px] text-slate-400 animate-pulse font-mono">
                                  Handshaking UPI secure key verification parameters...
                                </p>
                              </div>
                            </div>
                          )}

                          {paymentStep === "success" && (
                            <div className="space-y-4 text-center py-2">
                              <div className="w-14 h-14 bg-emerald-950/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                                <Check className="w-8 h-8 stroke-[2.5]" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white font-mono">
                                  TRANSACTION COMPLETED
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  Excellent check verification! Your Skillony account has been officially synced with <strong className="text-cyan-400 capitalize">{premiumTier}</strong> benefits. Unlimited training is now initialized!
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => setShowPaymentCheckoutModal(false)}
                                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                >
                                  LAUNCH UNLIMITED BENIFITS NOW
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* --- CELEBRATION OVERLAY FOR COMPLETING DAILY MISSIONS --- */}
                  {showCelebration && (
                    <div 
                      id="celebration-overlay"
                      className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] max-w-sm w-full space-y-5"
                      >
                        {/* Radial Glow and Animated Icon */}
                        <div className="relative flex justify-center py-2">
                          <div className="absolute inset-x-0 top-3 h-16 bg-orange-500/10 blur-xl rounded-full" />
                          <motion.div 
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="bg-orange-950/40 border-2 border-orange-500 rounded-2xl w-16 h-16 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                          >
                            <Flame className="w-10 h-10 fill-current animate-pulse text-orange-500" />
                          </motion.div>
                        </div>

                        {/* Title and Badge */}
                        <div className="space-y-1">
                          <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
                            EXEC-LEVEL SYNCED
                          </span>
                          <h3 className="font-display font-medium text-lg text-white leading-tight">
                            READINESS MATRIX COMPLETE!
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-[280px] mx-auto font-sans font-light">
                          All 5 high-stakes communications drills are calibrated! Your filler-free posture is secured and synced directly to the cloud.
                        </p>

                        {/* Streak Progression visualization */}
                        <div id="toast-celebration" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex justify-between items-center max-w-[280px] mx-auto">
                          <div className="text-left">
                            <span className="text-[8px] text-slate-500 font-mono block uppercase">ACCUMULATOR METRIC</span>
                            <span className="text-xs font-bold text-white uppercase tracking-tight">Active Streak Escalated</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                            <span className="text-slate-500">{activeStreak - 1}</span>
                            <span className="text-cyan-400">→</span>
                            <span className="text-orange-400 animate-bounce">{activeStreak} Days</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-2 pt-2">
                          <button 
                            id="btn-celebration-dismiss"
                            onClick={() => setShowCelebration(false)}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold font-mono text-xs py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> KEEP DRILLING
                          </button>
                          
                          <button 
                            id="btn-celebration-simulate"
                            onClick={() => {
                              setDailyMissions([
                                { id: "resonance", label: "Vocal resonance calibration", completed: false },
                                { id: "fillers", label: "Zero-filler STAR drill (Client delay crisis)", completed: false },
                                { id: "assertive", label: "Calibrate assertion quotient under stress", completed: false },
                                { id: "elevator", label: "60-second elevator pitch rehearsal", completed: false },
                                { id: "rebuttal", label: "Reframe regional mother-tongue markers", completed: false }
                              ]);
                              setShowCelebration(false);
                            }}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 font-mono text-[10px] py-2 rounded-xl border border-slate-800 text-center transition-all cursor-pointer"
                          >
                            SIMULATE NEXT RECONSTRUCTIONS (RESET)
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* --- CONFIDENCE RATING MODAL (MISSION SUCCESS AND BCI CALIBRATION) --- */}
                  {ratingMission && (
                    <div 
                      id="confidence-rating-modal"
                      className="absolute inset-0 bg-slate-950/92 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] max-w-sm w-full space-y-5 relative overflow-hidden"
                      >
                        {/* Elegant background grid overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

                        {/* Top corner close button */}
                        <button
                          onClick={() => setRatingMission(null)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-all p-1.5 rounded-full hover:bg-slate-800/80 z-20"
                          title="Skip calibration"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="relative z-10 space-y-4">
                          {/* Radial Glow and Animated Icon */}
                          <div className="relative flex justify-center py-2 h-20">
                            {/* Spinning glow ring */}
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                              className="absolute w-20 h-20 border-2 border-dashed border-cyan-500/30 rounded-full"
                            />
                            {/* Interactive bouncing core */}
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.15, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                              className="bg-cyan-950/40 border-2 border-cyan-500 rounded-full w-16 h-16 flex items-center justify-center text-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.4)] relative z-10"
                            >
                              <Award className="w-9 h-9 text-cyan-400" />
                            </motion.div>
                          </div>

                          {/* Title and Badge */}
                          <div className="space-y-1">
                            <span className="text-[9px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-3 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                              MISSION SUCCESS
                            </span>
                            <h3 className="font-display font-semibold text-base text-white leading-tight mt-1 px-4">
                              {ratingMission.label}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">
                              Active Drills Sync Matrix Status: Calibrated
                            </p>
                          </div>

                          {/* Confidence Scale Rating Instruction */}
                          <div className="bg-slate-950/70 border border-slate-900/80 rounded-2xl p-4 space-y-3">
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase select-none">
                              Rate speaking confidence level (1-5)
                            </span>

                            {/* 5 Star / Numeric Indicator bar */}
                            <div className="flex justify-center gap-2" id="star-rating-container">
                              {[1, 2, 3, 4, 5].map((val) => {
                                const isActive = val <= ratingValue;
                                return (
                                  <motion.button
                                    key={val}
                                    type="button"
                                    onClick={() => setRatingValue(val)}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                      isActive 
                                        ? "bg-cyan-950/45 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                        : "bg-slate-950/45 border-slate-900 text-slate-600 hover:text-slate-400 hover:border-slate-800"
                                    }`}
                                  >
                                    <Star className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Dynamic descriptive feedback details label */}
                            <div className="min-h-[22px] flex items-center justify-center">
                              <span className="text-[11px] font-medium text-cyan-300 font-sans">
                                {ratingValue === 1 && "1/5: Speech-anxious / freeze markers detected"}
                                {ratingValue === 2 && "2/5: Hesitant cadence / minor filler hesitation"}
                                {ratingValue === 3 && "3/5: Standard composture / neutral vocal state"}
                                {ratingValue === 4 && "4/5: Highly fluent presentation / assertive posture"}
                                {ratingValue === 5 && "5/5: Peak confidence & fluent leadership cadence"}
                              </span>
                            </div>

                            {/* Explanatory description demonstrating BCI score growth impact */}
                            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono leading-normal">
                              BCI Competence Delta Premium: <span className="text-cyan-400 font-bold">+{(ratingValue - 1) * 0.05} BCI</span> Points. Completion bonus of <span className="text-emerald-400 font-bold">+0.40 BCI</span> will sync immediately.
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex gap-2.5 pt-1.5">
                            <button
                              id="btn-confidence-skip"
                              onClick={() => setRatingMission(null)}
                              className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-400 font-mono text-xs py-2.5 rounded-xl transition-all border border-slate-900 font-bold cursor-pointer"
                            >
                              SKIP
                            </button>
                            <button 
                              id="btn-confidence-save"
                              onClick={() => {
                                setMissionConfidenceScores(curr => ({
                                  ...curr,
                                  [ratingMission.id]: ratingValue
                                }));
                                setRatingMission(null);
                              }}
                              className="flex-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold font-mono text-xs py-2.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              SAVE & SYNC BCI
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* --- 4-WEEK WEEKLY BREAKDOWN ANALYSIS MODAL --- */}
                  {showWeeklyBreakdown && (
                    <div 
                      id="weekly-breakdown-modal"
                      className="absolute inset-0 bg-slate-950/94 backdrop-blur-md z-50 flex flex-col justify-center items-center p-4 md:p-6 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-cyan-500/30 rounded-3xl p-5 md:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] max-w-lg w-full space-y-4 relative overflow-hidden text-left"
                      >
                        {/* High-tech radial background and grids */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

                        {/* Top right escape button */}
                        <button
                          id="btn-weekly-breakdown-close-top"
                          onClick={() => setShowWeeklyBreakdown(false)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-all p-1.5 rounded-full hover:bg-slate-800/80 z-20"
                          title="Close panel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="relative z-10 space-y-4">
                          {/* Title Area */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
                              <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-widest uppercase">
                                Verified Speaking Performance Audit
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-lg text-white leading-tight">
                              4-Week Analytics & Speech Synthesis
                            </h3>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Biometric Cognitive Index (BCI) historical telemetry over trailing periods
                            </p>
                          </div>

                          {/* Historical Performance Cards */}
                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                            
                            {/* WEEK 4 / Current */}
                            <div className="bg-slate-950/70 border border-cyan-500/20 p-3 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                  Week 4 (Current Week)
                                </span>
                                <span className="text-[10px] font-mono font-bold text-cyan-400">
                                  {completedMissionsCountActual}/5 Drills Active
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-normal">
                                Focus on <strong className="text-white">Assertive Project Communication</strong>. Current progress demonstrates high completion markers with {completedMissionsCountActual} logged exercises. Your calculated confidence score is <strong className="text-cyan-300 font-mono">{((Object.values(missionConfidenceScores) as number[]).reduce((acc: number, val: number) => acc + val, 0) / (Object.keys(missionConfidenceScores).length || 1)).toFixed(1)}/5</strong>.
                              </p>
                              <div className="grid grid-cols-3 gap-1.5 text-[8.5px] font-mono text-slate-500 bg-slate-1000/20 p-1.5 rounded-lg border border-slate-900/60">
                                <div>DIAPHRAGMATIC: <span className="text-cyan-400 font-bold">EXCELLENT</span></div>
                                <div>PAUSING RATE: <span className="text-cyan-400 font-bold">1.4SEC</span></div>
                                <div>ASSERTION: <span className="text-cyan-400 font-bold">8.8/10</span></div>
                              </div>
                            </div>

                            {/* WEEK 3 */}
                            <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                  Week 3 (Trailing W-1)
                                </span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400">
                                  5/5 Drills Completed
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Mastered the <strong className="text-slate-300">Zero-Filler STAR drill structures</strong>. Effectively eliminated redundant phrase headers. Pauses dropped into stable 1.5-second slots, which eliminated typical high-stress verbal rushing.
                              </p>
                              <div className="grid grid-cols-3 gap-1.5 text-[8.5px] font-mono text-slate-600 bg-slate-1000/20 p-1.5 rounded-lg border border-slate-950">
                                <div>DIAPHRAGMATIC: <span className="text-slate-400">STABLE</span></div>
                                <div>PAUSING RATE: <span className="text-emerald-400 font-bold">1.5SEC</span></div>
                                <div>ASSERTION: <span className="text-slate-400">8.2/10</span></div>
                              </div>
                            </div>

                            {/* WEEK 2 */}
                            <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                  Week 2 (Trailing W-2)
                                </span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400 text-opacity-80">
                                  4/5 Drills Completed
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Focused on <strong className="text-slate-300">Vocal Resonance Calibration</strong>. Lower larynx pacing was introduced to increase baseline pitch projection. Reduced squeaky high-stress vocal patterns during 60-second elevator scenarios.
                              </p>
                              <div className="grid grid-cols-3 gap-1.5 text-[8.5px] font-mono text-slate-600 bg-slate-1000/20 p-1.5 rounded-lg border border-slate-950">
                                <div>DIAPHRAGMATIC: <span className="text-emerald-400 font-bold">OPTIMIZED</span></div>
                                <div>PAUSING RATE: <span className="text-slate-400">1.8SEC</span></div>
                                <div>ASSERTION: <span className="text-slate-400">7.5/10</span></div>
                              </div>
                            </div>

                            {/* WEEK 1 */}
                            <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                  Week 1 (Trailing W-3)
                                </span>
                                <span className="text-[10px] font-mono font-bold text-amber-500">
                                  3/5 Drills Completed
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Base level onboarding and vocal fluency metrics established. Addressed regional mother-tongue markers and high speed rushing. Baseline cognitive load was high, and larynx tension was moderate.
                              </p>
                              <div className="grid grid-cols-3 gap-1.5 text-[8.5px] font-mono text-slate-600 bg-slate-1000/20 p-1.5 rounded-lg border border-slate-950">
                                <div>DIAPHRAGMATIC: <span className="text-amber-500">INITIATED</span></div>
                                <div>PAUSING RATE: <span className="text-slate-400">2.1SEC</span></div>
                                <div>ASSERTION: <span className="text-slate-400">6.0/10</span></div>
                              </div>
                            </div>

                          </div>

                          {/* Overall Metric Assessment Box */}
                          <div className="bg-gradient-to-r from-cyan-950/30 to-slate-950/80 border border-cyan-500/25 p-3 rounded-2xl relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 text-cyan-500 opacity-10">
                              <Sparkles className="w-16 h-16" />
                            </div>
                            <div className="relative space-y-1.5">
                              <span className="text-[8.5px] font-bold font-mono text-cyan-400 tracking-widest uppercase">
                                Biometric Synthesis Analysis
                              </span>
                              <p className="text-[10.5px] text-slate-300 leading-normal">
                                Overall speaking poise has improved by <strong className="text-white font-mono">+18.2%</strong>. Consistent abdominal breathing has stabilized pitch variation, and your overall BCI score has successfully unlocked additional recruitment tiers. 
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2">
                            <button
                              id="btn-weekly-breakdown-close"
                              onClick={() => setShowWeeklyBreakdown(false)}
                              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              CLOSE PERIODIC ANALYSIS
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* --- LINKEDIN BRANDING SHARE INTENT MODAL --- */}
                  {showLinkedinModal && (
                    <div 
                      id="linkedin-share-modal"
                      className="absolute inset-0 bg-slate-950/94 backdrop-blur-md z-50 flex flex-col justify-center items-center p-4 md:p-6 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-slate-900 to-zinc-950 border border-[#0a66c2]/40 rounded-3xl p-5 md:p-6 shadow-[0_0_60px_rgba(10,102,194,0.25)] max-w-lg w-full space-y-4 relative overflow-hidden text-left"
                      >
                        {/* Interactive professional grid background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

                        {/* Top corner close button */}
                        <button
                          onClick={() => setShowLinkedinModal(false)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-all p-1.5 rounded-full hover:bg-slate-800/80 z-20"
                          title="Close modal"
                          type="button"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="relative z-10 space-y-4">
                          {/* Title and Icon */}
                          <div className="space-y-1">
                            <span className="text-[9px] bg-slate-900 text-sky-400 border border-sky-500/30 px-3 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase inline-flex items-center gap-1.5">
                              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
                              LinkedIn Brand Amplifier
                            </span>
                            <h3 className="font-display font-bold text-lg text-white mt-1">
                              Promote Your Professional Salary Leverage
                            </h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                              Communication confidence is the #1 asset employers bid for. Share your verified BCI development goals on LinkedIn to amplify your professional status.
                            </p>
                          </div>

                          {/* Post Preview Box */}
                          <div className="bg-slate-950 border border-slate-900/90 rounded-2xl p-4 space-y-3 shadow-inner">
                            {/* Dummy Profile Header */}
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-[#0a66c2]/20 border border-[#0a66c2]/40 flex items-center justify-center text-[#1275d8] font-bold text-xs select-none">
                                {user?.email ? user.email.slice(0, 2).toUpperCase() : "BC"}
                              </div>
                              <div className="leading-tight">
                                <h4 className="text-xs font-bold text-slate-200">{user?.email || "Skillony Candidate"}</h4>
                                <span className="text-[9px] text-slate-500 font-mono">Professional Brand Post • Just now</span>
                              </div>
                            </div>

                            {/* Editing Textarea */}
                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-500 font-mono block uppercase">
                                Edit Copy Post Content:
                              </label>
                              <textarea
                                value={customLinkedinText}
                                onChange={(e) => setCustomLinkedinText(e.target.value)}
                                className="w-full min-h-[160px] max-h-[220px] bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 font-sans focus:outline-none focus:border-[#0a66c2]/50 leading-relaxed placeholder-slate-700 resize-y"
                                placeholder="Generating your custom branding post..."
                              />
                            </div>

                            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                              <span>Character count: {customLinkedinText.length}</span>
                              <span className="text-emerald-400 font-bold">✓ Calibrated Metrics Included</span>
                            </div>
                          </div>

                          {/* Control action buttons */}
                          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(customLinkedinText);
                                setCopiedLinkedinText(true);
                                setTimeout(() => setCopiedLinkedinText(false), 3000);
                              }}
                              className={`flex-1 ${
                                copiedLinkedinText 
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                                  : "bg-[#0a66c2] hover:bg-[#004182] text-white"
                              } font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm`}
                            >
                              {copiedLinkedinText ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>COPIED TO CLIPBOARD! ✓</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14L21 10V19C21 20.1046 20.1046 21 19 21ZM12 5H5V19H19V12H14V5H12ZM16 7.17157V10H18.8284L16 7.17157Z"/>
                                  </svg>
                                  <span>COPY POST TEXT 📋</span>
                                </>
                              )}
                            </button>
                            
                            <a
                              href="https://www.linkedin.com/feed/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                            >
                              <span>OPEN LINKEDIN FEED</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                </div>

                {/* BOTTOM NAVIGATION HUD CONTAINER: INSTAGRAM-STYLE FOOTER */}
                <div className="bg-slate-950/95 backdrop-blur-md border-t border-slate-900/90 py-2.5 px-3 flex justify-between items-center relative z-20">
                  <div className="w-full grid grid-cols-7 gap-1">
                    {[
                      { screen: 1, label: "Setup", icon: User },
                      { screen: 2, label: "Home", icon: Briefcase },
                      { screen: 3, label: "Coach", icon: Mic },
                      { screen: 4, label: "Panel", icon: Sparkles },
                      { screen: 5, label: "Profile", icon: Award },
                      { screen: 6, label: "Arena", icon: Users },
                      { screen: 7, label: "Go Pro", icon: Zap },
                    ].map((item) => {
                      const isActive = currentScreen === item.screen;
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.screen}
                          id={`instagram-nav-btn-${item.screen}`}
                          onClick={() => {
                            if (item.screen > 1 && !hasCompletedOnboarding) {
                              setHasCompletedOnboarding(true);
                            }
                            setCurrentScreen(item.screen);
                          }}
                          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative ${
                            isActive 
                              ? "text-cyan-400 bg-cyan-950/15" 
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/20"
                          }`}
                        >
                          {/* Mini dynamic glow marker */}
                          {isActive && (
                            <motion.span 
                              layoutId="activeFooterIndicator"
                              className="absolute top-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          
                          <IconComponent className={`w-4.5 h-4.5 transition-transform duration-200 mt-0.5 ${isActive ? 'scale-110 drop-shadow-[0_0_6px_rgba(34,211,238,0.35)]' : 'hover:scale-105'}`} />
                          
                          <span className={`text-[9px] font-mono mt-1 tracking-tight text-center ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

    </div>
  );
}
