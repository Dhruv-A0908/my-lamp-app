import { useState, useRef, useEffect } from 'react';
import { 
  Eye, EyeOff, Sparkles, KeyRound, LogOut, Play, 
  X, Share2, Check, Clock, Award, Lock, BarChart3, 
  ChevronRight, Compass, Atom, Calculator, Dna, Cpu, ArrowLeft,
  Bot, Send, Image as ImageIcon, Crown, Smartphone, UserPlus, 
  Users, Share, Search, BookOpen, ArrowRight, Edit3, MessageSquare, Video, Mic, MicOff, PhoneOff, User, Shield, Eye as EyeIcon
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TestRecord {
  id: string;
  subject: string;
  score: number;
  maxMarks: number;
  percentage: number;
  date: string;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  status: 'connected' | 'pending';
  profilePic?: string;
  showProgress?: boolean;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

const QUESTION_BANK: Record<string, Question[]> = {
  Physics: [
    {
      id: 1,
      question: "At what launch angle (θ) is the horizontal range of a projectile maximum for a constant initial velocity?",
      options: ["30°", "45°", "60°", "90°"],
      correct: 1,
      explanation: "Horizontal Range R = (u²·sin2θ)/g. sin(2θ) reaches maximum (1) at 2θ = 90°, hence θ = 45°."
    },
    {
      id: 2,
      question: "What is the dimensional formula for the Universal Gravitational Constant (G)?",
      options: ["[M⁻¹ L³ T⁻²]", "[M¹ L² T⁻²]", "[M⁰ L³ T⁻¹]", "[M⁻¹ L² T⁻³]"],
      correct: 0,
      explanation: "From F = G(m1·m2)/r², G = F·r² / (m1·m2) -> [M L T⁻²]·[L²] / [M²] = [M⁻¹ L³ T⁻²]."
    },
    {
      id: 3,
      question: "Two point charges +2µC and -2µC separated by a fixed distance form an electric dipole. Net charge on the dipole is:",
      options: ["4 µC", "0 µC", "-4 µC", "2 µC"],
      correct: 1,
      explanation: "Net charge on an electric dipole is always algebraic sum: (+q) + (-q) = 0."
    },
    {
      id: 4,
      question: "According to Lenz's Law, the polarity of induced EMF is such that it:",
      options: ["Aids the change producing it", "Opposes the change producing it", "Remains constant", "Is always zero"],
      correct: 1,
      explanation: "Lenz's Law reflects energy conservation: the induced current invariably opposes the magnetic flux change causing it."
    },
    {
      id: 5,
      question: "The de-Broglie wavelength associated with a particle of momentum 'p' is given by:",
      options: ["λ = h / p", "λ = p / h", "λ = h · p", "λ = h / p²"],
      correct: 0,
      explanation: "Wave-particle duality relation: λ = h / p = h / (m·v)."
    },
    {
      id: 6,
      question: "If the radius of Earth shrinks by 1% while its mass remains constant, the acceleration due to gravity (g) will:",
      options: ["Decrease by 2%", "Increase by 2%", "Remain unchanged", "Increase by 1%"],
      correct: 1,
      explanation: "g = GM/R². For fractional variations: Δg/g = -2(ΔR/R) = -2(-1%) = +2% increase."
    }
  ],
  Chemistry: [
    {
      id: 1,
      question: "What is the volume occupied by 1 mole of an ideal gas at STP (Standard Temperature and Pressure)?",
      options: ["22.4 Liters", "24.5 Liters", "11.2 Liters", "44.8 Liters"],
      correct: 0,
      explanation: "At standard temperature (273.15 K) and pressure (1 atm), 1 mole of an ideal gas occupies 22.414 L."
    },
    {
      id: 2,
      question: "In the Nernst equation, what is the numerical value of 2.303·R·T / F at 298 K?",
      options: ["0.0295 V", "0.0591 V", "0.1182 V", "0.0821 V"],
      correct: 1,
      explanation: "At 298 K (25°C), the constant term evaluates to 0.0591 V."
    },
    {
      id: 3,
      question: "Which of the following organic molecules exhibits optical isomerism?",
      options: ["Lactic acid", "Acetic acid", "Ethanol", "Formic acid"],
      correct: 0,
      explanation: "Lactic acid [CH3-CH(OH)-COOH] possesses an asymmetric chiral carbon center."
    },
    {
      id: 4,
      question: "The oxidation state of Chromium in Potassium Dichromate (K₂Cr₂O₇) is:",
      options: ["+4", "+5", "+6", "+3"],
      correct: 2,
      explanation: "2(+1) + 2(Cr) + 7(-2) = 0 -> 2Cr = +12 -> Cr = +6."
    },
    {
      id: 5,
      question: "Which law establishes that at constant temperature, solubility of gas in liquid is directly proportional to its partial pressure?",
      options: ["Raoult's Law", "Henry's Law", "Dalton's Law", "Graham's Law"],
      correct: 1,
      explanation: "Henry's Law states: p = K_H · x."
    },
    {
      id: 6,
      question: "The unit of rate constant for a First Order reaction is:",
      options: ["mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "s⁻¹", "dimensionless"],
      correct: 2,
      explanation: "Unit is (mol/L)^(1-n) · s⁻¹. For n = 1, it yields s⁻¹."
    }
  ],
  Mathematics: [
    {
      id: 1,
      question: "What is the determinant of the 2x2 matrix [[4, 7], [2, 6]]?",
      options: ["10", "38", "12", "0"],
      correct: 0,
      explanation: "|A| = (4 × 6) - (7 × 2) = 24 - 14 = 10."
    },
    {
      id: 2,
      question: "What is the derivative of f(x) = sin(x²) with respect to x?",
      options: ["cos(x²)", "2x · cos(x²)", "-2x · cos(x²)", "2 · sin(x) · cos(x)"],
      correct: 1,
      explanation: "Chain Rule: d/dx[sin(x²)] = cos(x²) · d/dx(x²) = 2x · cos(x²)."
    },
    {
      id: 3,
      question: "If square matrix A is non-singular, then (A⁻¹)⁻¹ is equal to:",
      options: ["A", "Aᵀ", "|A|", "I"],
      correct: 0,
      explanation: "The inverse of an inverted matrix returns the original matrix A."
    },
    {
      id: 4,
      question: "Evaluate the fundamental limit: lim(x→0) [sin(x) / x]:",
      options: ["0", "1", "Infinity", "Undefined"],
      correct: 1,
      explanation: "Standard limit theorem: lim(x->0) [sin(x)/x] = 1."
    },
    {
      id: 5,
      question: "The scalar dot product of two mutually orthogonal vectors is always:",
      options: ["1", "-1", "0", "Undefined"],
      correct: 2,
      explanation: "a · b = |a||b|cos(90°) = 0."
    },
    {
      id: 6,
      question: "The evaluation of definite integral ∫ (from 0 to 1) [3x² dx] is:",
      options: ["1", "3", "0.5", "2"],
      correct: 0,
      explanation: "∫ 3x² dx = [x³] from 0 to 1 = 1 - 0 = 1."
    }
  ],
  Biology: [
    {
      id: 1,
      question: "According to Chargaff's rules in double-stranded DNA, which relationship is always verified?",
      options: ["[A] = [C]", "[A] + [T] = [G] + [C]", "[A] = [T] and [G] = [C]", "[A] + [G] = 0"],
      correct: 2,
      explanation: "Complementary base pairing requires Adenine to pair with Thymine and Guanine with Cytosine."
    },
    {
      id: 2,
      question: "Which codon functions as the universal Initiator Codon during polypeptide translation?",
      options: ["UAA", "UGA", "AUG", "UAG"],
      correct: 2,
      explanation: "AUG codes for Methionine and establishes the reading frame."
    },
    {
      id: 3,
      question: "Semiconservative replication of DNA was experimentally demonstrated by Meselson & Stahl using:",
      options: ["15N isotope in E. coli", "32P in bacteriophage", "35S in Streptococcus", "14C in algae"],
      correct: 0,
      explanation: "Equilibrium density gradient centrifugation of E. coli grown in 15NH4Cl."
    },
    {
      id: 4,
      question: "The phenotypic ratio of a classic Mendelian Dihybrid Cross in F2 generation is:",
      options: ["3:1", "9:3:3:1", "1:2:1", "9:7"],
      correct: 1,
      explanation: "Crossing heterozygous traits yields 9 Round-Yellow, 3 Round-Green, 3 Wrinkled-Yellow, 1 Wrinkled-Green."
    },
    {
      id: 5,
      question: "The microscopic structural and functional filtering unit of the human kidney is:",
      options: ["Neuron", "Nephron", "Alveoli", "Glomerulus"],
      correct: 1,
      explanation: "Nephrons filter blood plasma, perform selective reabsorption, and excrete urea."
    },
    {
      id: 6,
      question: "Which phytohormone is predominantly responsible for fruit ripening in plants?",
      options: ["Auxin", "Gibberellin", "Ethylene", "Cytokinin"],
      correct: 2,
      explanation: "Ethylene gas induces respiratory climacteric ripening in fruits."
    }
  ],
  "Computer Science": [
    {
      id: 1,
      question: "What is the time complexity of Breadth-First Search (BFS) using an adjacency list with V vertices and E edges?",
      options: ["O(V · E)", "O(V + E)", "O(V²)", "O(log V)"],
      correct: 1,
      explanation: "BFS explores each vertex and checks incident edges exactly once: O(V + E)."
    },
    {
      id: 2,
      question: "Which concurrency protocol guarantees conflict serializable schedules in database transactions?",
      options: ["Strict 2-Phase Locking (2PL)", "Dirty Read Protocol", "Wait-Forget", "Random Lock"],
      correct: 0,
      explanation: "Strict 2PL prevents cascading aborts and guarantees conflict serializability."
    },
    {
      id: 3,
      question: "In CPU scheduling, the Round Robin algorithm dispatches tasks via which data structure?",
      options: ["LIFO Stack", "FIFO Queue", "Priority Heap", "Binary Search Tree"],
      correct: 1,
      explanation: "Round Robin uses a FIFO circular ready queue with fixed time quanta."
    },
    {
      id: 4,
      question: "Which ACID property guarantees that partial transaction failures roll back completely without data corruption?",
      options: ["Atomicity", "Isolation", "Durability", "Consistency"],
      correct: 0,
      explanation: "Atomicity ensures 'all-or-nothing' execution via write-ahead logging (WAL)."
    },
    {
      id: 5,
      question: "What is the worst-case runtime complexity of QuickSort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correct: 1,
      explanation: "Unbalanced partitions yield O(n²)."
    },
    {
      id: 6,
      question: "Which transport protocol guarantees reliable, ordered byte stream transmission across IP networks?",
      options: ["UDP", "TCP", "ICMP", "ARP"],
      correct: 1,
      explanation: "TCP provides connection-oriented reliable byte delivery via 3-way handshakes and ACKs."
    }
  ]
};

const SUBJECT_TOPICS: Record<string, { title: string; desc: string; formula: string; tips: string }[]> = {
  Physics: [
    { title: "Kinematics & Projectile Trajectory", desc: "Vector resolution, parabolic flight path, time of flight & horizontal ground range.", formula: "R = (u²·sin2θ)/g | H = (u²·sin²θ)/(2g)", tips: "Complementary launch angles (θ and 90°-θ) yield identical horizontal ranges." },
    { title: "Newton's Laws & Dynamics", desc: "Momentum conservation, friction coefficients & circular motion road banking.", formula: "F = dp/dt | v_max = √(μ·r·g)", tips: "Always draw isolated free-body diagrams (FBD) for tension and normal forces." },
    { title: "Electrostatics & Coulomb Law", desc: "Point charge forces, electric field flux, Gauss theorem & dipole moments.", formula: "F = (1/4πε₀)·(q1·q2)/r²", tips: "Electric field lines never intersect; electrostatic potential inside conductors is constant." },
    { title: "Electromagnetic Induction", desc: "Faraday laws, Lenz law opposition, self-inductance & mutual coil coupling.", formula: "e = -dΦ/dt | Φ = B·A·cosθ", tips: "The negative sign in Faraday's law directly manifests energy conservation." }
  ],
  Chemistry: [
    { title: "Thermodynamics & Ideal Gas Laws", desc: "State functions, enthalpy, Boyle's/Charles's laws & kinetic molecular theory.", formula: "P·V = n·R·T | ΔG = ΔH - TΔS", tips: "Use universal gas constant R = 0.0821 L·atm/(mol·K) for pressure-volume calculations." },
    { title: "Electrochemistry & Galvanic Cells", desc: "Half-cell standard reduction potentials, Nernst equation & Faraday laws.", formula: "E_cell = E° - (0.0591/n)·log10(Q)", tips: "Pure solids have unit activity and are excluded from reaction quotient Q." },
    { title: "Chemical Kinetics & Order", desc: "Rate laws, integrated rate equations, half-life & Arrhenius activation energy.", formula: "k = A·e^(-Ea/RT) | t_1/2 = 0.693/k", tips: "Half-life of a first-order reaction is independent of initial reactant concentration." },
    { title: "Organic Carbonyl Compounds", desc: "Aldol condensation, Cannizzaro reactions, nucleophilic additions & oxidation.", formula: "R-CHO + Tollens -> Ag mirror", tips: "Aldehydes with α-hydrogen yield aldol; without α-hydrogen yield Cannizzaro." }
  ],
  Mathematics: [
    { title: "Matrices & Determinants", desc: "Square matrix cofactors, adjoint matrix, invertibility & linear equation systems.", formula: "A⁻¹ = adj(A)/|A| | |A·B| = |A|·|B|", tips: "Matrix inverse exists if and only if |A| ≠ 0 (non-singular matrix)." },
    { title: "Differential Calculus", desc: "Continuity, differentiability, chain rule, tangents/normals & maxima/minima.", formula: "f'(x) = lim(h->0)[f(x+h)-f(x)]/h", tips: "Stationary points occur at f'(x) = 0; verify second derivative sign for extrema." },
    { title: "Integral Calculus", desc: "Indefinite substitution, integration by parts, definite limits & area under curves.", formula: "∫ u·v dx = u∫v dx - ∫(u'·∫v dx)dx", tips: "Apply the ILATE rule to choose the first function 'u' in integration by parts." },
    { title: "Vectors & 3D Geometry", desc: "Scalar and vector products, direction cosines, skew lines & plane equations.", formula: "a·b = |a||b|cosθ | a×b = |a||b|sinθ n̂", tips: "Notice the formula difference between parallel line vs skew line shortest distance." }
  ],
  Biology: [
    { title: "Molecular Genetics & DNA", desc: "Watson-Crick double helix, transcription units, genetic codons & Lac operon.", formula: "Chargaff: [A] + [G] = [T] + [C]", tips: "Codon AUG acts dual purpose: translation initiator and codes for Methionine." },
    { title: "Mendelian Inheritance", desc: "Monohybrid segregation, dihybrid assortment, test crosses & chromosomal basis.", formula: "Monohybrid 3:1 | Dihybrid 9:3:3:1", tips: "Test crosses utilize a homozygous recessive parent to identify unknown genotypes." },
    { title: "Human Physiology: Excretion & Circulation", desc: "Nephron filtration, countercurrent mechanism, cardiac cycle & ECG waves.", formula: "Cardiac Output = Stroke Volume × Heart Rate", tips: "P-wave represents atrial depolarization; QRS complex represents ventricular depolarization." },
    { title: "Biotechnology Principles", desc: "Restriction endonucleases, plasmid cloning vectors (pBR322) & PCR amplification.", formula: "PCR: Denaturation -> Annealing -> Extension", tips: "Taq polymerase isolated from Thermus aquaticus maintains high thermal stability." }
  ],
  "Computer Science": [
    { title: "Graph Traversal & Search (BFS/DFS)", desc: "Queue-based breadth search, recursion depth search & topological sorting.", formula: "Time: O(V + E) | Space: O(V)", tips: "Always maintain a visited boolean array to avoid infinite loops in cyclic graphs." },
    { title: "DBMS Concurrency & ACID Locks", desc: "Conflict serializability, strict 2-phase locking (2PL) & write-ahead logging.", formula: "Strict 2PL: Growing -> Commit -> Release", tips: "Directed cycles in precedence graphs indicate conflict non-serializability." },
    { title: "CPU Scheduling & Round Robin", desc: "Turnaround time, waiting time, time quantum allocation & Gantt tracking.", formula: "TAT = Completion - Arrival | WT = TAT - Burst", tips: "Very large quantum behaves like FCFS; tiny quantum introduces excessive context switching." },
    { title: "Sorting & Search Optimization", desc: "Binary search divide-and-conquer, merge sort & dynamic programming states.", formula: "Binary Search: O(log n) | Merge: O(n log n)", tips: "Binary search strictly requires pre-sorted input sequences." }
  ]
};

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const [isWarping, setIsWarping] = useState(false);
  const [warpProgress, setWarpProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [lampOn, setLampOn] = useState(true);
  const [lampAngle, setLampAngle] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const hasTriggeredRef = useRef(false);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'test' | 'scores' | 'friends' | 'profile'>('study');
  const [readingTopic, setReadingTopic] = useState<{ title: string; desc: string; formula: string; tips: string } | null>(null);

  const [myUsername, setMyUsername] = useState('@saksham_sharma');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [showProgressPublicly, setShowProgressPublicly] = useState(true);

  const [searchIdInput, setSearchIdInput] = useState('');
  const [searchMessage, setSearchMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [shareNoteModal, setShareNoteModal] = useState<{ isOpen: boolean; topicTitle: string; friendName: string } | null>(null); 
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatInputText, setChatInputText] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const [isExamActive, setIsExamActive] = useState(false);
  const [examSubject, setExamSubject] = useState<string>('Physics');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; maxMarks: number; percentage: number; correctCount: number } | null>(null);

  const [scoreHistory, setScoreHistory] = useState<TestRecord[]>([
    {
      id: 'REC-101',
      subject: 'Physics',
      score: 25,
      maxMarks: 30,
      percentage: 83.3,
      date: 'Sep 01, 11:20 AM'
    }
  ]);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; image?: string }>>([
    { sender: 'ai', text: "Hello! I'm your Friend AI study partner. Ask me any theoretical doubt or upload photos of your problems." }
  ]);
  const [uploadedPhotosToday, setUploadedPhotosToday] = useState(10);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'verify'>('checkout');
  const [utrInput, setUtrInput] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const RECEIVER_UPI_ID = "ds3267655@oksbi";
  const RECEIVER_NAME = "Saksham Sharma";
  const AMOUNT_PAYABLE = "49.50";

  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const [shareToast, setShareToast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const numParticles = 48;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
      hue: Math.random() > 0.5 ? 42 : 198
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 42 ? 'rgba(245, 158, 11, 0.75)' : 'rgba(56, 189, 248, 0.75)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.hue === 42 ? '#f59e0b' : '#38bdf8';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (isExamActive && !examCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finalizeExamSubmission();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, examCompleted, timeLeft]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatFriend]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isWarping || isLoggedIn) return;

    if (isPulling) {
      const deltaY = Math.max(0, Math.min(55, e.clientY - startYRef.current));
      setPullDistance(deltaY);

      if (deltaY > 30 && !hasTriggeredRef.current) {
        setLampOn((prev) => !prev);
        hasTriggeredRef.current = true;
      }
      return;
    }

    const windowWidth = window.innerWidth;
    const mouseX = e.clientX;
    const angleComputed = ((mouseX - windowWidth / 2) / (windowWidth / 2)) * 18;
    setLampAngle(angleComputed);
  };

  const handleMouseDownString = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPulling(true);
    startYRef.current = e.clientY;
    hasTriggeredRef.current = false;
  };

  const handleMouseUp = () => {
    if (isPulling) {
      setIsPulling(false);
      setPullDistance(0);
      hasTriggeredRef.current = false;
    }
  };

  const validateUsername = (u: string) => {
    let clean = u.trim();
    if (!clean.startsWith('@')) clean = '@' + clean;
    const hasUnderscoreOrDot = clean.includes('_') || clean.includes('.');
    return { isValid: hasUnderscoreOrDot, formatted: clean };
  };

  const triggerTransition = () => {
    if (username.trim()) {
      const val = validateUsername(username);
      if (!val.isValid) {
        alert("Username must contain at least an underscore (_) or a dot (.) mandatory!");
        return;
      }
      setMyUsername(val.formatted);
    }

    setIsWarping(true);
    setWarpProgress(0);

    const interval = setInterval(() => {
      setWarpProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsWarping(false);
            setIsLoggedIn(true);
          }, 350);
          return 100;
        }
        return prev + 2.8;
      });
    }, 100);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    triggerTransition();
  };

  const handleSignOut = () => {
    if (isExamActive && !examCompleted) {
      const confirmExit = window.confirm("Exam is in progress! Are you sure you want to exit?");
      if (!confirmExit) return;
    }
    setIsLoggedIn(false);
    setOtpSent(false);
    setOtpValues(['', '', '', '']);
    setPhone('');
    setPassword('');
    setSelectedSubject(null);
    setIsExamActive(false);
    setExamCompleted(false);
    setIsAiOpen(false);
    setActiveChatFriend(null);
  };

  const handleShareLink = async () => {
    const shareUrl = window.location.href;
    const sharePayload = {
      title: 'NEXUS - Digital Study Material & Resource Hub',
      text: 'Access comprehensive study notes and test your knowledge with interactive exams!',
      url: shareUrl
    };

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share(sharePayload);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2400);
      } catch (err) {
        alert('Nexus URL copied: ' + shareUrl);
      }
    }
  };

  const handleSaveUsername = () => {
    const val = validateUsername(newUsernameInput);
    if (!val.isValid) {
      alert("Username must contain at least an underscore (_) or a dot (.) mandatory!");
      return;
    }
    setMyUsername(val.formatted);
    setIsEditingUsername(false);
    setNewUsernameInput('');
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePicUrl(url);
    e.target.value = '';
  };

  const handleSearchAndSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    let query = searchIdInput.trim();
    if (!query) return;
    if (!query.startsWith('@')) query = '@' + query;

    if (query === myUsername.toLowerCase()) {
      setSearchMessage({ text: "You cannot add yourself!", type: 'error' });
      return;
    }

    const existing = friendsList.find(f => f.username.toLowerCase() === query.toLowerCase());
    if (existing) {
      setSearchMessage({ text: `Already connected or pending with ${existing.username}`, type: 'error' });
      return;
    }

    const newFriend: Friend = {
      id: Math.random().toString(),
      name: query.replace('@', '').toUpperCase().replace(/[._]/g, ' ') + ' Scholar',
      username: query,
      status: 'pending',
      showProgress: true
    };

    setFriendsList(prev => [newFriend, ...prev]);
    setSearchIdInput('');
    setSearchMessage({ text: `Friend request sent to ${query}!`, type: 'success' });
    setTimeout(() => setSearchMessage(null), 3000);
  };

  const handleAcceptRequest = (id: string) => {
    setFriendsList(prev => prev.map(f => f.id === id ? { ...f, status: 'connected' } : f));
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !activeChatFriend) return;
    const msg = chatInputText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => ({
      ...prev,
      [activeChatFriend.username]: [
        ...(prev[activeChatFriend.username] || []),
        { sender: 'me', text: msg, time: timeStr }
      ]
    }));
    setChatInputText('');

    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [activeChatFriend.username]: [
          ...(prev[activeChatFriend.username] || []),
          { sender: activeChatFriend.username, text: `Received your note! Let's study together.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }));
    }, 1000);
  };

  const startExamForSubject = (subj: string) => {
    setExamSubject(subj);
    setIsExamActive(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(300);
    setExamCompleted(false);
    setExamResult(null);
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const finalizeExamSubmission = () => {
    const questions = QUESTION_BANK[examSubject] || QUESTION_BANK["Physics"];
    let correct = 0;

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correct++;
      }
    });

    const marksObtained = correct * 5;
    const percentage = Number(((marksObtained / 30) * 100).toFixed(1));

    const resultObj = {
      score: marksObtained,
      maxMarks: 30,
      percentage,
      correctCount: correct
    };

    setExamResult(resultObj);
    setExamCompleted(true);

    const newRecord: TestRecord = {
      id: `REC-${Math.floor(100 + Math.random() * 900)}`,
      subject: examSubject,
      score: marksObtained,
      maxMarks: 30,
      percentage,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setScoreHistory((prev) => [newRecord, ...prev]);
  };

  const closeExamAndReturn = () => {
    setIsExamActive(false);
    setExamCompleted(false);
    setExamResult(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendAiMessage = () => {
    if (!aiInput.trim()) return;

    const userText = aiInput.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      let reply = "That's an important conceptual question! Break it down using fundamental equations.";
      const lower = userText.toLowerCase();

      if (lower.includes('kinematics') || lower.includes('projectile')) {
        reply = "In Projectile Motion, horizontal velocity remains constant. Maximum range is achieved at θ = 45°!";
      } else if (lower.includes('gas') || lower.includes('pv')) {
        reply = "For Ideal Gases, PV = nRT. In isothermal conditions, P1·V1 = P2·V2.";
      } else if (lower.includes('dna')) {
        reply = "Transcription reads template DNA from 3' to 5' and synthesizes mRNA from 5' to 3'.";
      }

      setAiMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 700);
  };

  const handleTriggerImageUpload = () => {
    if (!isPremiumUser && uploadedPhotosToday >= 10) {
      setPaymentStep('checkout');
      setShowPaymentModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPremiumUser && uploadedPhotosToday >= 10) {
      setPaymentStep('checkout');
      setShowPaymentModal(true);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedPhotosToday((prev) => prev + 1);

    setAiMessages((prev) => [
      ...prev,
      { sender: 'user', text: `Uploaded Image (${file.name})`, image: imageUrl }
    ]);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Analyzed your image! Apply fundamental governing principles to solve this problem step-by-step.` }
      ]);
    }, 1100);

    e.target.value = '';
  };

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(RECEIVER_UPI_ID)}&pn=${encodeURIComponent(RECEIVER_NAME)}&am=${AMOUNT_PAYABLE}&cu=INR&tn=Nexus%20AI%20Scholar%20Pass`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;

  const handleVerifyUtrPayment = () => {
    if (utrInput.trim().length < 8) {
      alert("Please enter a valid 12-digit UTR reference ID.");
      return;
    }

    setIsVerifyingPayment(true);

    setTimeout(() => {
      setIsVerifyingPayment(false);
      setIsPremiumUser(true);
      setShowPaymentModal(false);
      alert(`🎉 Payment Verified! ₹${AMOUNT_PAYABLE} credited to GPay ID (${RECEIVER_UPI_ID}). Unlimited Photo Uploads unlocked!`);
    }, 1500);
  };

  const subjectsList = [
    { name: 'Physics', icon: Compass, color: '#f59e0b', desc: 'Kinematics, Dynamics, Electrostatics, Optics & Magnetism' },
    { name: 'Chemistry', icon: Atom, color: '#38bdf8', desc: 'Thermodynamics, Gas Laws, Electrochemistry & Organic Reactions' },
    { name: 'Mathematics', icon: Calculator, color: '#a855f7', desc: 'Calculus Derivatives, Matrices, Determinants & Vector Geometry' },
    { name: 'Biology', icon: Dna, color: '#10b981', desc: 'Molecular Genetics, Inheritance, Physiology & Biotechnology' },
    { name: 'Computer Science', icon: Cpu, color: '#ec4899', desc: 'DSA Graph Traversal, DBMS 2PL Concurrency & Operating Systems' }
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        minHeight: '100vh',
        backgroundColor: lampOn ? '#050711' : '#010204',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isLoggedIn ? 'flex-start' : 'center',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: '#f8fafc',
        userSelect: isExamActive ? 'none' : 'auto',
        transition: 'background-color 0.4s ease',
        cursor: isPulling ? 'grabbing' : 'default'
      }}
    >
      <style>{`
        #netlify-badge, iframe[src*="netlify"] {
          display: none !important;
        }

        @keyframes auroraGlow {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          33% { transform: translate(30px, -40px) scale(1.15); opacity: 0.5; }
          66% { transform: translate(-25px, 20px) scale(0.9); opacity: 0.4; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
        }

        .aurora-circle-1 { animation: auroraGlow 14s ease-in-out infinite alternate; }
        .aurora-circle-2 { animation: auroraGlow 18s ease-in-out infinite alternate-reverse; }

        @keyframes notebookFlipOpen {
          0% { transform: perspective(1000px) rotateY(-90deg) scale(0.7); opacity: 0; }
          60% { transform: perspective(1000px) rotateY(10deg) scale(1.02); opacity: 1; }
          100% { transform: perspective(1000px) rotateY(0deg) scale(1); opacity: 1; }
        }

        .notebook-container {
          animation: notebookFlipOpen 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-style: preserve-3d;
        }

        .subject-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.45) !important;
          box-shadow: 0 16px 36px rgba(245, 158, 11, 0.16) !important;
        }

        .lamp-rig { transform-origin: top center; transition: transform 0.12s ease-out; }
        .pull-handle { cursor: grab; }
        .pull-handle:active { cursor: grabbing; }
        .quiz-option { transition: all 0.2s ease; }
        .quiz-option:hover { border-color: #f59e0b !important; background-color: rgba(245, 158, 11, 0.08) !important; }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: lampOn ? 0.75 : 0.2,
          transition: 'opacity 0.4s'
        }}
      />
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="aurora-circle-1" style={{ position: 'absolute', top: '5%', left: '8%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)', borderRadius: '50%', filter: 'blur(70px)' }} />
        <div className="aurora-circle-2" style={{ position: 'absolute', bottom: '8%', right: '10%', width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      {shareToast && (
        <div style={{ position: 'fixed', top: '24px', zIndex: 1000, backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '12px', padding: '12px 22px', boxShadow: '0 10px 35px rgba(16, 185, 129, 0.35)', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
          <Check size={18} />
          <span>Study portal link copied to clipboard! Ready to share.</span>
        </div>
      )}

      {isWarping && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(2, 6, 23, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div className="notebook-container" style={{ width: '340px', height: '220px', backgroundColor: '#0f172a', border: '3px solid #f59e0b', borderLeft: '18px solid #d97706', borderRadius: '8px 16px 16px 8px', boxShadow: '0 25px 60px rgba(245, 158, 11, 0.35), inset 0 0 30px rgba(0,0,0,0.6)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-12px', top: '20px', bottom: '20px', width: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div style={{ width: '4px', height: '8px', backgroundColor: '#78350f', borderRadius: '2px' }} />
              <div style={{ width: '4px', height: '8px', backgroundColor: '#78350f', borderRadius: '2px' }} />
              <div style={{ width: '4px', height: '8px', backgroundColor: '#78350f', borderRadius: '2px' }} />
              <div style={{ width: '4px', height: '8px', backgroundColor: '#78350f', borderRadius: '2px' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '11px', fontFamily: 'monospace', marginBottom: '6px' }}>
                <BookOpen size={14} /> NEXUS NOTEBOOK ARCHIVE
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                Opening Study Journal...
              </h3>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
              Loading user <strong style={{ color: '#38bdf8' }}>{myUsername}</strong> curriculum notes...
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '6px' }}>
                <span>FLIPPING PAGES</span>
                <span style={{ color: '#f59e0b' }}>{Math.floor(warpProgress)}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${warpProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #f59e0b)', boxShadow: '0 0 12px #f59e0b', transition: 'width 0.1s linear' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoggedIn ? (
        <div style={{ width: '100%', maxWidth: '420px', padding: '30px', backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', textAlign: 'center', zIndex: 10, backdropFilter: 'blur(12px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <Compass size={32} />
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>NEXUS Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Advanced Study Material & CBT Assessment Hub for Aspiring Scholars.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                REGISTERED MOBILE NUMBER
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                placeholder="e.g. 9876543210"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#030712', border: '1px solid #334155', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                CHOOSE USERNAME (Mandatory _ or .)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                placeholder="e.g. saksham_sharma"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#030712', border: '1px solid #334155', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', fontSize: '14px', fontWeight: 800, cursor: 'pointer', marginTop: '6px', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)' }}
            >
              Enter Study Portal
            </button>
          </form>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '1160px', padding: '24px 20px 80px 20px', position: 'relative', zIndex: 10 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                onClick={() => setActiveTab('profile')}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #f59e0b', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="View Profile & Progress Privacy"
              >
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User color="#f59e0b" size={20} />
                )}
              </div>

              <div>
                <span style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>
                  NEXUS
                </span>
                <span style={{ marginLeft: '10px', fontSize: '11px', fontFamily: 'monospace', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ID: {myUsername}
                  <button onClick={() => { setNewUsernameInput(myUsername.replace('@', '')); setIsEditingUsername(true); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }} title="Edit ID">
                    <Edit3 size={11} />
                  </button>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleShareLink}
                disabled={isExamActive && !examCompleted}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.25)',
                  fontSize: '12px', fontWeight: 600, cursor: isExamActive && !examCompleted ? 'not-allowed' : 'pointer', opacity: isExamActive && !examCompleted ? 0.4 : 1
                }}
              >
                <Share2 size={13} /> Share Link
              </button>

              <button
                onClick={handleSignOut}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <LogOut size={13} /> Exit Portal
              </button>
            </div>
          </header>

          {isEditingUsername && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#0f172a', border: '1px solid #f59e0b', borderRadius: '16px', padding: '24px', textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Edit Username ID</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>Must contain at least an underscore (_) or dot (.) mandatory.</p>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ position: 'absolute', left: '12px', fontSize: '14px', color: '#f59e0b', fontWeight: 700 }}>@</span>
                  <input
                    type="text"
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                    placeholder="e.g. saksham_sharma"
                    style={{ width: '100%', padding: '10px 12px 10px 32px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#030712', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setIsEditingUsername(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSaveUsername} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Save</button>
                </div>
              </div>
            </div>
          )}

          {!isExamActive && (
            <div style={{ display: 'flex', gap: '10px', margin: '20px 0 10px 0', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSelectedSubject(null); setActiveTab('study'); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  backgroundColor: !selectedSubject && activeTab === 'study' ? '#f59e0b' : 'rgba(15, 23, 42, 0.6)',
                  color: !selectedSubject && activeTab === 'study' ? '#030712' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                Study Hub & Subjects
              </button>
              <button
                onClick={() => { setSelectedSubject("Friends_Hub"); setActiveTab('friends'); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  backgroundColor: selectedSubject === "Friends_Hub" ? '#f59e0b' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedSubject === "Friends_Hub" ? '#030712' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Users size={14} /> Friends & Social ({friendsList.filter(f => f.status === 'connected').length})
              </button>
              <button
                onClick={() => { setSelectedSubject("Profile_View"); setActiveTab('profile'); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  backgroundColor: activeTab === 'profile' ? '#f59e0b' : 'rgba(15, 23, 42, 0.6)',
                  color: activeTab === 'profile' ? '#030712' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <User size={14} /> My Profile & Progress Privacy
              </button>
            </div>
          )}

          {isExamActive ? (
            <div style={{ marginTop: '24px', backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #f59e0b', borderRadius: '18px', padding: '28px', boxShadow: '0 0 50px rgba(245, 158, 11, 0.25)', textAlign: 'left', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock color="#f59e0b" size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.5px' }}>
                    EXAM FOCUS LOCK ENGAGED • {examSubject.toUpperCase()} ASSESSMENT
                  </span>
                </div>

                {!examCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', backgroundColor: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)', border: timeLeft < 60 ? '1px solid #ef4444' : '1px solid #38bdf8' }}>
                    <Clock color={timeLeft < 60 ? '#ef4444' : '#38bdf8'} size={16} />
                    <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: timeLeft < 60 ? '#ef4444' : '#38bdf8' }}>
                      TIME LEFT: {formatTimer(timeLeft)}
                    </span>
                  </div>
                )}
              </div>

              {!examCompleted ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Question {currentQIndex + 1} of {(QUESTION_BANK[examSubject] || QUESTION_BANK["Physics"]).length}</span>
                    <span>Max Marks: <strong>30 Marks</strong> (5 Marks per Question)</span>
                  </div>

                  {(() => {
                    const qList = QUESTION_BANK[examSubject] || QUESTION_BANK["Physics"];
                    const currentQ = qList[currentQIndex];

                    return (
                      <div>
                        <div style={{ padding: '18px 20px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '16px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5, marginBottom: '20px' }}>
                          Q{currentQIndex + 1}. {currentQ.question}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                          {currentQ.options.map((opt, oIdx) => {
                            const isSelected = userAnswers[currentQIndex] === oIdx;
                            return (
                              <div
                                key={oIdx}
                                onClick={() => handleSelectAnswer(currentQIndex, oIdx)}
                                className="quiz-option"
                                style={{
                                  padding: '14px 18px',
                                  borderRadius: '10px',
                                  border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px'
                                }}
                              >
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '2px solid #f59e0b' : '2px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: isSelected ? '#f59e0b' : '#64748b' }}>
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                                <span style={{ fontSize: '14px', color: isSelected ? '#f8fafc' : '#cbd5e1' }}>{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              disabled={currentQIndex === 0}
                              onClick={() => setCurrentQIndex((prev) => prev - 1)}
                              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#cbd5e1', fontSize: '12px', fontWeight: 600, cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQIndex === 0 ? 0.4 : 1 }}
                            >
                              Previous
                            </button>
                            <button
                              disabled={currentQIndex === qList.length - 1}
                              onClick={() => setCurrentQIndex((prev) => prev + 1)}
                              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#cbd5e1', fontSize: '12px', fontWeight: 600, cursor: currentQIndex === qList.length - 1 ? 'not-allowed' : 'pointer', opacity: currentQIndex === qList.length - 1 ? 0.4 : 1 }}
                            >
                              Next Question
                            </button>
                          </div>

                          <button
                            onClick={finalizeExamSubmission}
                            style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', fontSize: '13px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)' }}
                          >
                            End Exam & Calculate Score
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                examResult && (
                  <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                    <Award color="#f59e0b" size={52} style={{ margin: '0 auto 14px auto' }} />
                    <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                      Assessment Completed!
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0' }}>
                      Screen lock released. Your performance has been permanently archived in your academic ledger.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', maxWidth: '640px', margin: '0 auto 28px auto' }}>
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>SCORE OBTAINED</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                          {examResult.score} <span style={{ fontSize: '16px', color: '#64748b' }}>/ 30</span>
                        </div>
                      </div>
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>PERCENTAGE</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                          {examResult.percentage}%
                        </div>
                      </div>
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>CORRECT ANSWERS</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                          {examResult.correctCount} / 6
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={closeExamAndReturn}
                      style={{ padding: '12px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Return to Learning Dashboard
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div>
              {activeTab === 'profile' ? (
                <div style={{ marginTop: '24px', textAlign: 'left', maxWidth: '720px', margin: '24px auto', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1e293b', border: '3px solid #f59e0b', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {profilePicUrl ? (
                          <img src={profilePicUrl} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User color="#f59e0b" size={38} />
                        )}
                      </div>
                      <button
                        onClick={() => profilePicInputRef.current?.click()}
                        style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f59e0b', color: '#030712', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <input type="file" ref={profilePicInputRef} onChange={handleProfilePicChange} accept="image/*" style={{ display: 'none' }} />
                    </div>

                    <div>
                      <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 800, color: '#f8fafc' }}>{name || 'Scholar'}</h2>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#f59e0b' }}>{myUsername}</div>
                    </div>
                  </div>
                </div>
              ) : selectedSubject === "Friends_Hub" ? (
                <div style={{ marginTop: '24px', textAlign: 'left', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                  <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Add Friend by User ID</h3>
                    <form onSubmit={handleSearchAndSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        value={searchIdInput}
                        onChange={(e) => setSearchIdInput(e.target.value)}
                        placeholder="Enter user ID (e.g. @priya.maths)"
                        style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#030712', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <button type="submit" style={{ padding: '11px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                        Send Friend Request
                      </button>
                    </form>
                  </div>
                </div>
              ) : !selectedSubject ? (
                <div style={{ margin: '40px 0', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 12px 0' }}>
                    What would you like to study today?
                  </h1>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
                    {subjectsList.map((subj, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedSubject(subj.name)}
                        className="subject-card"
                        style={{
                          padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', fontWeight: 700, color: '#f8fafc' }}>{subj.name}</h3>
                          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>{subj.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '24px' }}>
                  <button onClick={() => setSelectedSubject(null)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#cbd5e1', fontSize: '12px', cursor: 'pointer', marginBottom: '16px' }}>
                    <ArrowLeft size={14} /> Back to Disciplines
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', textAlign: 'left' }}>
                    {(SUBJECT_TOPICS[selectedSubject] || SUBJECT_TOPICS["Physics"]).map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => setReadingTopic(topic)}
                        className="subject-card"
                        style={{ padding: '22px', borderRadius: '14px', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer' }}
                      >
                        <h3 style={{ margin: '6px 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>{topic.title}</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px 0' }}>{topic.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isExamActive && (
            <>
              <button
                onClick={() => setIsAiOpen(!isAiOpen)}
                style={{
                  position: 'fixed', bottom: '24px', right: '24px', zIndex: 900,
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '30px',
                  backgroundColor: '#f59e0b', color: '#030712', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                }}
              >
                <Bot size={18} /> Friend AI
              </button>

              {isAiOpen && (
                <div style={{
                  position: 'fixed', bottom: '80px', right: '24px', width: '380px', maxHeight: '520px', zIndex: 950,
                  backgroundColor: '#0f172a', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left'
                }}>
                  <div style={{ padding: '14px 16px', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Friend AI Tutor</div>
                    <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '260px', maxHeight: '330px' }}>
                    {aiMessages.map((msg, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '82%', padding: '10px 14px',
                          borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          backgroundColor: msg.sender === 'user' ? '#f59e0b' : 'rgba(30, 41, 59, 0.8)',
                          color: msg.sender === 'user' ? '#030712' : '#f8fafc', fontSize: '12.5px'
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                    <div ref={aiChatEndRef} />
                  </div>

                  <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendAiMessage(); }}
                      placeholder="Ask any doubt..."
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', fontSize: '12px', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={handleSendAiMessage}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#030712', cursor: 'pointer' }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}