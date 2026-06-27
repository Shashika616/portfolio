"use client";

import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
// Integrated Framer Motion Core Utilities
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../../types";
import { useGlobalTheme } from "../../context/ThemeContext";


interface ProjectsSectionProps {
  sec: Section;
}

type TabType = 'researches' | 'projects' | 'games' | 'certificates';
type SubCategoryType = 'ALL' | 'AI & ML' | 'Distributed Systems' | 'Monolithic' | 'Cloud' | 'Security' | 'Web Development';

interface ProjectMedia {
  url: string;
  label: string;
  buttonText: string;
}

interface MediaGroup {
  groupTitle: string;
  items: ProjectMedia[];
}

interface ProjectItem {
  name: string;
  category: 'AI & ML' | 'Distributed Systems' | 'Monolithic' | 'Research' | 'Simulation' | 'Cloud' | 'Security' | 'Web Development';
  tech: string[];
  introduction: string;
  problemStatement: string;
  requirements: string[];
  solution: string;
  architecture: string;
  coreFeatures?: string[];
  technicalHighlights?: string[];
  imageUrl?: string;
  githubLink: string;
  playLink?: string;
  mediaGroups?: MediaGroup[];
  media?: ProjectMedia[];
}

interface CertificateItem {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description: string;
  skills: string[];
  imageUrl: string;
  verifyLink: string;
}

export function ProjectsSection({ sec }: ProjectsSectionProps) {
  const { activeTheme } = useGlobalTheme();
  const [activeTab, setActiveTab] = useState<TabType>('researches');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType>('ALL');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; label: string } | null>(null);
  const [mediaGroupIndices, setMediaGroupIndices] = useState<{ [key: number]: number }>({});
  
  const itemsPerPage = 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedProject && !selectedCertificate) return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalHtmlHeight = htmlElement.style.height;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalBodyHeight = bodyElement.style.height;

    htmlElement.style.overflow = "hidden";
    htmlElement.style.height = "100vh";
    bodyElement.style.overflow = "hidden";
    bodyElement.style.height = "100vh";

    return () => {
      htmlElement.style.overflow = originalHtmlOverflow;
      htmlElement.style.height = originalHtmlHeight;
      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.height = originalBodyHeight;
    };
  }, [selectedProject, selectedCertificate]);

  const catalogData: Record<TabType, any[]> = {
    researches: [
      { 
        name: "Plot Based Chaotic Hashing Pipeline", 
        category: "Research",
        tech: ["HMAC-SHA256", "Argon2id", "Python", "Chaotic Maps", "LaTeX"],
        imageUrl: "",
        introduction: "An academic investigation into expanding low-entropy password strings into high-dimensional, chaotic manifolds to increase computational complexity against attacks, giving the users to free themseleves of memorizing complex passwords.",
        problemStatement: "Users naturally choose simple, memorable, low-entropy passwords and frequently reuse them, making compromised credentials the leading vector for data breaches. Traditional memory-hard hashing functions (like Argon2, bcrypt, scrypt) increase computational costs for attackers but do not alter the underlying weak structure or low entropy of the password itself.",
        requirements: [
          "Dynamically expand low-entropy source strings without increasing user cognitive load or memorization bounds.",
          "Achieve a measurable increase in computational complexity against highly parallelized GPU/ASIC brute-force clusters.",
          "Ensure strict deterministic stability across variable dimensions (D = 3-8) and chaotic map iterations (I = 1-10).",
          "Preserve absolute Shannon entropy characteristics without introducing predictable bits or mathematical bias arrays.",
          "Maintain transactional authentication throughput execution bounds strictly within < 200ms limits."
        ],
        solution: "Engineered a deterministic, multi-dimensional pre-hashing transformation layer that maps character inputs into continuous space using custom chaotic functions (Logistic/Henon maps) before traditional salting pipelines.",
        architecture: "Ingests inputs via an initial HMAC-SHA256 token array to dynamically derive spatial dimensions and iterative mapping indices. Values are swept through chaotic manifold matrices, normalized, amplified using a cascading XOR avalanche accumulator, and passed downstream into hard memory-lane Argon2id execution blocks.",
        githubLink: "https://github.com/Shashika616/Research_Hashing_Pipeline.git",
        mediaGroups: [
          {
            groupTitle: "System Architecture",
            items: [
              { 
                url: "/hash-pipeline/graph-hash.png", 
                label: "Solution Architecture", 
                buttonText: "View Architectural Diagram" 
              }
            ]
          },
          {
            groupTitle: "Performance Analysis",
            items: [
              { 
                url: "/hash-pipeline/time-comparison.png", 
                label: "Time Complexity Comparison", 
                buttonText: "View Comparison Table" 
              },
              { 
                url: "/hash-pipeline/stat-comparison.png", 
                label: "Statistical Comparison", 
                buttonText: "View Comparison Table" 
              }
            ]
          },
          {
            groupTitle: "Practical Analysis",
            items: [
              { 
                url: "/hash-pipeline/prac-dep.png", 
                label: "Practical Dependency Analysis", 
                buttonText: "View Comparison Table" 
              }
            ]
          }
        ]
      },
      { 
        name: "Medical Image Processing", 
        category: "AI & ML",
        tech: ["PyTorch", "3D U-Net", "TorchIO", "PyTorch Lightning", "Medical Imaging"],
        introduction: "Saving Time, Saving Lives: Automated 3D Liver Tumor Segmentation: A deep learning medical imaging study focused on building high-precision convolutional networks for volumetric pixel segmentation of liver structures and tumor masses from CT imagery.",
        problemStatement: "Manual segmentation of liver and tumor volumes from CT scans by radiologists is highly time-intensive, slow, and prone to inter-observer variability. Furthermore, tumors vary widely in size, shape, and location, rendering classical rule-based image processing ineffective.",
        requirements: [
          "Automate volumetric, voxel-wise identification of unpredictable tumor geometry, bounds, and arbitrary edge masses.",
          "Process high-density 3D medical arrays natively without experiencing devastating spatial data drops or downsampling artifacts.",
          "Implement adaptive patch-focused sampling paradigms to counteract severe physical memory allocations on local hardware.",
          "Bypass structural overfitting trends and optimize semantic segmentation accuracy metrics across low-contrast scans."
        ],
        solution: "Developed a robust volumetric 3D U-Net pipeline capable of computing dense continuous slice extractions through deep encoder-decoder paths driven by dynamic multi-phase learning configurations.",
        architecture: "Processes raw multi-slice CT inputs using TorchIO intensity rescaling, random spatial crops, and structural augmentations. Data is routed down a deep 3D convolutional encoder path, downsampled via deep max-pooling bottleneck layers, upscaled using trainable ConvTranspose3D channels, and converged via residual skip connections under a joint Dice-CrossEntropy loss function optimization loop.",
        githubLink: "https://colab.research.google.com/drive/12NcQTbb8J7l2kdB7Rxb_Q9PuANjlIzpo?usp=sharing#scrollTo=LUDdiSL4ROOu",
        mediaGroups: [
          {
            groupTitle: "CT Scan Samples",
            items: [
              { 
                url: "/medical-image/tumor1.jpg", 
                label: "3D-CT Scan Sample", 
                buttonText: "View Sample Scan" 
              },
              { 
                url: "/medical-image/tumor2.jpg", 
                label: "3D-CT Scan Slice Sample", 
                buttonText: "View Sample Scan" 
              }
            ]
          },
          {
            groupTitle: "Model Results",
            items: [
              { 
                url: "/medical-image/tumor3.mp4", 
                label: "Scan Capture of the CNN", 
                buttonText: "View Capture" 
              },
              { 
                url: "/medical-image/confusion-matrix1.jpg", 
                label: "Confusion Matrix", 
                buttonText: "View Matrix Result" 
              }
            ]
          }
        ]
      }
    ],
    projects: [
      {
        name: "TELCOM App for a Distributed Environment",
        category: "Distributed Systems",
        tech: [
          "Node.js",
          "Express.js",
          "Flutter",
          "MongoDB",
          "Redis",
          "RabbitMQ",
          "Microservices",
          "REST APIs",
          "WebSockets",
          "Docker"
        ],
        introduction: "A cloud-native telecommunications self-care platform built on a distributed microservices architecture. The system provides customers with a unified digital experience for account management, billing, payments, service activation, notifications, and real-time support while demonstrating scalable backend engineering patterns used in modern telecom platforms.",
        problemStatement: "Traditional telecom applications often rely on tightly coupled backend systems where high-volume operations such as billing generation, notifications, and customer requests compete for the same resources. This creates scalability limitations, service dependency failures, and performance degradation during peak usage periods. The challenge was to design a fault-tolerant distributed platform where individual business capabilities could scale independently while maintaining fast communication between services.",
        requirements: [
          "Design an independently scalable microservices architecture replacing a tightly coupled monolithic backend.",
          "Implement asynchronous event-driven communication between services to prevent blocking operations during high traffic workloads.",
          "Provide a unified API access layer for multiple client applications including Flutter mobile applications and web clients.",
          "Maintain low-latency data access using distributed caching mechanisms.",
          "Support real-time customer communication through persistent WebSocket connections.",
          "Ensure secure authentication, request routing, and centralized service management."
        ],
        solution: "Built a distributed telecommunications platform using a microservices architecture with a Node.js/Express API Gateway acting as the central communication layer. Business capabilities were separated into independent services including User Management, Billing, Payment Processing, Service Provisioning, Notification Handling, and Customer Chat. RabbitMQ was integrated as an asynchronous message broker to enable event-driven workflows, while Redis provided distributed caching and session management. MongoDB was used for scalable document-based persistence across services.",
        coreFeatures: [
          "API Gateway architecture providing centralized authentication, request routing, and service communication management.",
          "Independent microservices for user lifecycle management, billing operations, payments, service activation, notifications, and customer support.",
          "RabbitMQ-powered event-driven communication allowing services to react asynchronously to billing, payment, and provisioning events.",
          "Redis distributed caching layer for optimized session handling, queue management, and high-speed temporary data access.",
          "Real-time customer support chat system using WebSocket communication with Redis-backed session management.",
          "MongoDB persistence layer optimized for high-volume telecom data such as customer records, billing history, transactions, and conversations.",
          "Flutter-based customer application providing access to telecom self-service operations."
        ],
        technicalHighlights: [
          "Designed a stateless microservices backend allowing individual services to scale independently without affecting other business modules.",
          "Implemented asynchronous publish-subscribe messaging patterns to prevent notification workloads from blocking critical payment and billing operations.",
          "Applied distributed caching strategies using Redis to reduce database load and improve response times.",
          "Created REST-based service communication standards with clearly separated business responsibilities.",
          "Implemented event-driven workflows where payment success events trigger downstream service activation and customer notifications.",
          "Used WebSocket-based bidirectional communication for low-latency customer support interactions."
        ],
        architecture: "Follows a layered distributed architecture consisting of Flutter/Web clients, API Gateway, core microservices, message broker, caching layer, and persistent storage. Client requests are routed through the Node.js/Express API Gateway, which communicates with independent backend services. Synchronous operations use REST APIs, while asynchronous business events flow through RabbitMQ queues using producer-consumer patterns. Redis manages distributed cache states and active sessions, while MongoDB stores persistent business data. The architecture enables fault isolation, horizontal scalability, and independent service deployment.",
        githubLink: "https://github.com/Shashika616/sri-care-backend",
        mediaGroups: [
          {
            groupTitle: "System Architecture",
            items: [
              { 
                url: "/sricare/sricare-arc.png", 
                label: "High Level System Architecture", 
                buttonText: "View Architecture" 
              }
            ]
          }
        ]
      },
      { 
        name: "Compiler Arena - Tactical web game running on an underlying compiler engine", 
        category: "Monolithic",
        tech: ["JavaScript", "Compilers", "Game Development", "CS Theory"],
        introduction: "A full-stack tactical puzzle game engine powered by a deterministic 4-stage compiler pipeline. Players write custom domain-specific language commands to navigate enemies with mathematically-defined hitbox patterns, transforming abstract compiler theory into interactive gameplay.",
        problemStatement: "Game AI damage systems typically use hardcoded spatial logic instead of composable algorithms, while compiler education remains disconnected from practical applications. Standard approaches lack real-time feedback mechanisms that visualize the complete compilation process from tokenization through execution.",
        requirements: [
          "Construct a true Abstract Syntax Tree (AST) via handwritten lexer and recursive-descent parser without external parsing libraries.",
          "Engineer 5 distinct enemy archetypes with unique damage zone geometries computed dynamically based on spatial distance metrics and type-specific algorithms.",
          "Deliver precise error feedback with character-level offsets and maintain O(n) linear time complexity across tokenization, parsing, and semantic analysis phases."
        ],
        solution: "Built a single-pass, deterministic compiler frontend coupled with a state-driven game engine. The lexer tokenizes input into keywords/directions/identifiers; the LL(1) recursive-descent parser generates structured AST nodes; the semantic analyzer validates sequences against game rules; the executor mutates state and computes hitbox intersections per enemy type with cumulative damage stacking.",
        coreFeatures: [
          "Handwritten recursive-descent lexer and parser producing clean AST without regex or external dependencies.",
          "5 enemy types with distinct spatial models: Goblin (X±1), Orc (3×3), Troll (X±2), Drake (ortho±1/diag±2), Demon (5×5).",
          "Real-time CSS Grid visualization with dynamic hitbox overlays updating after each compiled command.",
          "Grid bounds validation enforcing 0–15 coordinate limits; cumulative damage from overlapping enemy hitboxes.",
          "4 progressive difficulty levels scaling from 2 enemies (pedagogical) to 6 enemies (expert multi-threat navigation)."
        ],
        technicalHighlights: [
          "O(n) single-pass tokenization and O(n) recursive-descent parsing with explicit error messages containing exact character offsets.",
          "Type-based enemy damage zone dispatch using functional pattern matching; hitbox calculations leverage Euclidean distance metrics.",
          "Immutable-pattern state updates: each command triggers full grid re-evaluation and re-render without mutable intermediate objects."
        ],
        architecture: "Processes source code through a single-pass tokenization stream, validating structure against a strict context-free grammar before mapping nodes into a traversable AST. The executor interprets this tree sequentially, computing enemy hitboxes dynamically based on type and position, applying damage via set intersection, and enforcing grid boundaries before each state mutation. CSS Grid rendering layer visualizes danger zones as real-time background overlays.",
        githubLink: "https://github.com/Shashika616/compiler-game.git",
        playLink: "https://compiler-game.vercel.app/",
        mediaGroups: [
          {
            groupTitle: "Architecture & Design",
            items: [
              { 
                url: "/Compiler/arch.png", 
                label: "High Level System Architecture", 
                buttonText: "View Architectural Diagram" 
              }
            ]
          }
        ]
      },
      {
        name: "Digital Gate Pass and Visitor Management System",
        category: "Monolithic",
        tech: [
          "Node.js",
          "Express.js",
          "React",
          "MongoDB",
          "REST APIs",
          "Postman",
          "Figma",
          "GitHub"
        ],
        introduction: "A digital gate pass and visitor management solution designed for the Sri Lanka Rupavahini Corporation. The platform streamlines organizational entry/exit operations by introducing a secure web-based system that replaces manual logbooks and paperwork for guests, staff members, administrators, and security gate staff.",
        problemStatement: "The primary challenge lies in the absence of a digital tracking system, resulting in a heavy reliance on manual processes accompanied by extensive paperwork. This approach consumes a significant amount of time, demands substantial human effort, and causes operational inefficiencies. Specific pain points include limited external access to visitation details, a lack of automated entry/exit tracking mechanisms, constraints in managing guest reservations, and the physical storage space required for manual record management.",
        requirements: [
          "Handle secure user registration and multi-role authentication for various system actors.",
          "Develop independent interface modules for users/staff, security gate personnel, and system administrators.",
          "Automate the submission, evaluation, and management of guest visitation and appointment requests.",
          "Implement real-time entry and exit tracking for tracking users, staff, and associated vehicles at the security gate.",
          "Enable self-service profile management allowing authorized users to securely modify their information.",
          "Provide analytical reporting tools for administrators and staff to generate and download date-based or monthly activity reports."
        ],
        solution: "Developed a centralized digital gate pass management system featuring a decoupled full-stack architecture. The frontend web portals were constructed using React to deliver dedicated, responsive dashboards for administrators, security guards, and corporate staff. The backend API layer was engineered using Node.js and Express.js to orchestrate request routing, authentication workflows, and gate check-in/out logic, while MongoDB served as the scalable document persistence layer for real-time visitor records, historical logs, and user credentials.",
        coreFeatures: [
          "Role-based dashboards providing customized access environments for Guest Users, Staff, Gate Security, and Administrators.",
          "Digital appointment workflow supporting online submission and automated approval tracking for corporate visit requests.",
          "Real-time gate module enabling security personnel to instantly record, verify, and monitor vehicle and individual check-ins and check-outs.",
          "Asynchronous password recovery mechanism issuing secure password reset links directly to user emails.",
          "Dynamic reporting engine supporting date-specific activity searches, calendar views, and downloadable monthly staff activity reports.",
          "Interactive UI layouts designed comprehensively in Figma to ensure optimal workflow UX for non-technical gate staff."
        ],
        technicalHighlights: [
          "Transitioned physical logistical operations into a structured multi-tier web application, eliminating paper reliance and local storage bottlenecks.",
          "Designed a secure role-based access control (RBAC) middleware architecture to protect administrative and internal operational fields.",
          "Engineered robust document schemas in MongoDB capable of handling varying structural requirements of external individuals, educational groups, and staff vehicles.",
          "Conducted rigorous backend verification and endpoint validation utilizing Postman to secure consistent API delivery.",
          "Created date-based and search-indexed database queries to optimize report generation performance and calendar views."
        ],
        architecture: "Follows a classic client-server architecture model structured over an internal network or cloud layout. The presentation tier is built using React to provide real-time updates and seamless interactions across separate staff, admin, and gate panels. Client requests are dispatched via HTTPS REST APIs to a stateless Node.js/Express backend server. This logic tier handles core session validation, workflow automation, and reporting processing before executing transactions against a persistent MongoDB instance. The architecture effectively separates business capabilities, ensuring fault isolation and clean service boundaries.",
        githubLink: "https://github.com/Shashika616/Rupavahini-gatepass-and-visitormgt-system-backend.git",
        mediaGroups: [
          {
            groupTitle: "System Architecture",
            items: [
              { 
                url: "/rup/rup-arc.png", 
                label: "High Level System Architecture", 
                buttonText: "View Architectural Diagram" 
              }
            ]
          },
          {
            groupTitle: "WireFrames",
            items: [
              { 
                url: "/rup/wire1.png", 
                label: "WireFrame", 
                buttonText: "View WireFrame" 
              },
              { 
                url: "/rup/wire2.png", 
                label: "WireFrame",  
                buttonText: "View WireFrame" 
              },
              { 
                url: "/rup/wire3.png", 
                label: "WireFrame",  
                buttonText: "View WireFrame"
              },
              { 
                url: "/rup/wire4.png", 
                label: "WireFrame",  
                buttonText: "View WireFrame"
              },
              { 
                url: "/rup/wire5.png", 
                label: "WireFrame",  
                buttonText: "View WireFrame"
              }
            ]
          },
          {
            groupTitle: "Application Overview",
            items: [
              { 
                url: "/rup/main1.png", 
                label: "Overview", 
                buttonText: "View Image" 
              },
              { 
                url: "/rup/main2.png", 
                label: "Overview", 
                buttonText: "View Image"  
              },
              { 
                url: "/rup/main3.png", 
                label: "Overview", 
                buttonText: "View Image" 
              },
              { 
                url: "/rup/main4.png", 
                label: "Overview", 
                buttonText: "View Image" 
              },
              { 
                url: "/rup/main5.png", 
                label: "Overview", 
                buttonText: "View Image" 
              }
            ]
          }
        ]
      },
      {
        name: "AlgoTrack - Self-Paced DSA and System Design Diary", 
        category: "Monolithic",
        tech: ["Next.js (App Router)", "TypeScript", "Supabase", "PostgreSQL", "Drizzle ORM", "Tailwind CSS"],
        introduction: "A centralized platform for developers to master Data Structures, Algorithms, and System Design concepts at their own pace. AlgoTrack combines problem-solving tools with integrated personal journaling, allowing users to save solutions and document key learning insights for long-term knowledge retention.",
        problemStatement: "Popular coding platforms often focus solely on immediate problem resolution and speed, lacking robust features for personal reflection and progressive learning documentation. Developers frequently struggle to track their unique learning curve, revise difficult concepts, and consolidate diverse educational notes alongside their direct code solutions.",
        requirements: [
          "Implement seamless, secure user authentication managing private access to personal dashboards and sensitive problem data.",
          "Develop a responsive, data-driven interface using Next.js Server Components and Edge Middleware for optimized page delivery and auth state management.",
          "Design and optimize a relational database schema (Postgres) to store structured problem details, user code submissions, and associated personal learning notes efficiently."
        ],
        solution: "Leveraged Next.js (App Router) for an SEO-friendly frontend and API layer, strictly managed by dynamic middleware to enforce page protection based on active Supabase authentication sessions. The data layer utilizes Drizzle ORM to interface with Supabase (PostgreSQL), storing categorized problems. User submissions map code solutions and associated Markdown-formatted learning diary entries to unique user IDs, ensuring complete data privacy and personalized progress tracking.",
        coreFeatures: [
          "Authentication (Supabase Auth) with protected dashboard routes access restricted via Next.js Edge Middleware.",
          "Categorized Problem Library (DSA and System Design) with search/filter capabilities and difficulty ratings.",
          "Personalized Solution Notebook: Save code solutions (with language syntax highlighting) directly linked to specific problems.",
          "Integrated Learning Diary: Rich text editor (Markdown support) for adding personal notes, reflections, and key takeaways for each solved problem.",
          "Progress Dashboard visualizing completion metrics, difficulty breakdown, and recent study activity."
        ],
        technicalHighlights: [
          "Next.js App Router utilization with Server Components for direct DB fetching and dynamic middleware for instant, uncircumventable auth redirection (Dashboard/Problems paths).",
          "Drizzle ORM for type-safe database interactions and structured querying of the Supabase-hosted PostgreSQL instance.",
          "Optimized API route structure utilizing server-side validation and dynamic SQL queries to handle complex relationship mapping between users, solutions, and problems."
        ],
        architecture: "Processes client requests through Next.js Edge Middleware, instantly validating session integrity via Supabase Auth before allowing access to protected dashboard paths or dynamic API routes. Page rendering is optimized using Server Components where possible, minimizing client bundle size. When modifying data, API endpoints interface with the backend PostgreSQL database using Drizzle ORM, ensuring type-safe operations for CRUD actions on user solutions and personal learning diary entries. The unified storage (Supabase/Postgres) ensures ACID compliance for consistent data handling across the entire user lifecycle.",
        githubLink: "https://github.com/Shashika616/algotrack", 
        playLink: "https://algotrack-seven.vercel.app/",
        mediaGroups: [
          {
            groupTitle: "Architecture & Design",
            items: [
              { 
                url: "/algotrack/algotrack-arc.png", 
                label: "System Architecture", 
                buttonText: "View Architecture" 
              }
            ]
          }
        ]
      }
    ],
    games: [
      {
        name: "Survive Cyber - Cyberpunk Urban FPS Simulator",
        category: "Monolithic",
        tech: ["Three.js", "WebGL 2.0", "JavaScript ES6", "Procedural Generation", "AI State Machines", "Web Audio API"],
        introduction: "A cyberpunk-themed 3D first-person shooter that combines procedural city generation with wave-based combat mechanics. Players navigate a neon-drenched urban landscape, engaging enemy AI through an immersive combat loop featuring real-time hit detection, particle effects, and dynamic difficulty scaling.",
        problemStatement: "Traditional browser-based 3D shooters either rely on heavy game engines (Unity/Unreal) or sacrifice performance for visual fidelity. Web-native implementations often suffer from poor optimization, lack of procedural content, and simplistic AI behavior. The challenge is building a responsive, high-performance FPS experience entirely in vanilla JavaScript with Three.js that maintains 60 FPS while delivering engaging combat mechanics and dynamic environments.",
        requirements: [
          "Implement a full 3D rendering pipeline using Three.js with optimized WebGL settings (pixel ratio 1.0, antialiasing disabled) to maintain 60 FPS performance.",
          "Engineer a procedural city generation system with 4 distinct building types (skyscrapers, residential, cyber towers, warehouses) and weighted random distribution.",
          "Design 2 enemy archetypes (CHASER and RANGED) with unique AI behavior, attack patterns, and difficulty scaling across progressive waves.",
          "Build a complete HUD system with health segments, ammo display, radar, crosshair, and wave tracking using pure CSS/HTML overlays.",
          "Implement a pool-based particle system for explosions and hit effects with zero garbage collection pressure."
        ],
        solution: "Built a monolithic Three.js-based game engine with integrated ECS-lite architecture. The system features procedural city generation with collision-optimized AABB structures, a state-machine driven AI system with 3 behavioral states (CHASE/HURT/ATTACK), and a wave-based difficulty scaler. Performance is optimized through geometry pooling, material reuse, and fixed pixel ratio rendering. The game loop uses delta-clamping to prevent physics explosions while maintaining deterministic behavior.",
        coreFeatures: [
          "Procedural city generation with 4 building types (Skyscraper 40%, Residential 30%, Cyber Tower 20%, Warehouse 10%) and collision-optimized AABB structures.",
          "2 enemy archetypes with distinct AI: CHASER (8.5 speed, 65 HP, melee) and RANGED (5.2 speed, 50 HP, projectile attacks with 30 unit range).",
          "Wave-based difficulty scaling: kill requirement = 5 + (wave × 3), enemy speed increases by 0.35 per wave, spawn interval decreases from 2.5s to 0.6s.",
          "Dynamic HUD with 20-segment health bar, ammo display (30 rounds mag + 90 reserve), 160px radar with enemy tracking, and real-time score/kill tracking.",
          "Pool-based particle system (70 particles) for explosions and impacts with zero garbage collection and deterministic performance.",
          "CRT post-processing effects (scanlines, vignette, chromatic aberration) implemented in pure CSS for zero GPU overhead."
        ],
        technicalHighlights: [
          "ECS-lite architecture with shared geometry/material pools reducing draw calls by 90% and memory usage by 65%.",
          "AI state machine with 3 behavioral states: CHASE (default), HURT (0.08s stun animation), ATTACK (cooldown-based with 1.2s melee / 1.8s ranged intervals).",
          "Pool-based particle system with 70 pre-allocated instances enabling explosion effects without garbage collection pressure.",
          "Delta-clamped game loop preventing physics explosions (max delta 0.05s) with interpolated movement for smooth 60 FPS gameplay.",
          "Radar system with conic gradient sweep and enemy tracking within 110 unit radius, color-coded by enemy type.",
          "Custom Web Audio synthesizer generating laser, explosion, hurt, and pickup sounds without external audio files."
        ],
        architecture: "The game follows a monolithic architecture with integrated subsystems: Three.js handles the 3D rendering pipeline with optimized WebGL settings (pixel ratio 1.0, antialiasing disabled). The ECS-lite entity manager tracks all game objects with pooled resources for performance. The AI system uses a state machine pattern with 3 behavioral states. The procedural city generator builds a 600×600 unit environment with 4 building types and pre-calculated collision structures. The game loop processes physics (gravity, velocity, collision detection), AI behavior, particle systems, and HUD updates in a single update cycle. UI overlays are rendered via CSS/HTML with real-time DOM updates for the HUD, while the radar uses a 2D canvas overlay. The system employs delta-clamping to maintain deterministic physics and prevent frame-rate dependent behavior.",
        githubLink: "https://github.com/Shashika616/survive-cyber.git",
        playLink: "https://survive-cyber.vercel.app/",
        mediaGroups: [
          {
            groupTitle: "Architecture & Design",
            items: [
              { 
                url: "/neon-overdrive/3d-shooter-arc.png", 
                label: "Game Architecture Diagram", 
                buttonText: "View System Architecture" 
              }
            ]
          },
          {
            groupTitle: "Gameplay Optimization Architecture",
            items: [
              { 
                url: "/neon-overdrive/3d-shooter-df.png", 
                label: "Data Flow", 
                buttonText: "View Data Flow Diagram" 
              },
              { 
                url: "/neon-overdrive/3d-shooter-mem.png", 
                label: "Memory Allocation", 
                buttonText: "View Memory Flow" 
              }
            ]
          },
          {
            groupTitle: "Gameplay",
            items: [
              { 
                url: "/neon-overdrive/3d-shooter-1.png", 
                label: "Gameplay Captures", 
                buttonText: "View Gameplay" 
              },
              { 
                url: "/neon-overdrive/3d-shooter-2.png", 
                label: "Gameplay Captures", 
                buttonText: "View Gameplay" 
              },
              { 
                url: "/neon-overdrive/3d-shooter-3.png", 
                label: "Gameplay Captures", 
                buttonText: "View Gameplay" 
              },
              { 
                url: "/neon-overdrive/3d-shooter-4.png", 
                label: "Gameplay Captures", 
                buttonText: "View Gameplay" 
              }
            ]
          }
        ]
      }
    ],
    certificates: [
      {
        name: "WSO2 Certified Associate Identity & Access Management",
        issuer: "WSO2",
        date: "2024",
        credentialId: "CID-04598722",
        description: "Validates a foundational understanding of Identity and Access Management (IAM) principles and architectures. Demonstrates knowledge in B2B Customer IAM (CIAM), identity federation, single sign-on, and implementing modern, secure passwordless authentication mechanisms.",
        skills: ["Identity and Access Management", "B2B CIAM", "Identity Federation", "Passwordless Authentication"],
        imageUrl: "/certificates/wso2-cert.png",
        verifyLink: "https://certification.wso2.com/certificate/CID-04598722"
      },
      {
        name: "UI/UX For Beginners",
        issuer: "Great Learning Academy",
        date: "2024",
        credentialId: "CID-EFRFFYBX",
        description: "Introduces the foundational workflows and methodologies of user interface and user experience design. Covers core principles of layout design, color theory, user interaction, and best practices for creating intuitive, responsive digital layouts.",
        skills: ["UI/UX", "State Management", "UI Design", "Best Practices", "User Interaction", "Color Combinations", "Layouts"],
        imageUrl: "/certificates/ui-cert.png",
        verifyLink: "https://www.mygreatlearning.com/certificate/EFRFFYBX"
      },
      {
        name: "Cloud Computing Basics",
        issuer: "Mind Luster",
        date: "2024",
        credentialId: "CID-16720390740",
        description: "Demonstrates a baseline understanding of core cloud architecture, deployment models (Public, Private, Hybrid), and service categories (IaaS, PaaS, SaaS). Covers fundamental concepts of cloud security, infrastructure compliance, and cross-platform capabilities.",
        skills: ["Cloud Technologies", "Cloud Concepts", "Cloud Services", "Security", "Compliance"],
        imageUrl: "/certificates/cloud-cert.jpg",
        verifyLink: "https://www.mindluster.com/student/certificate/16720390740"
      },
      {
        name: "React JS Tutorial",
        issuer: "Great Learning",
        date: "2024",
        credentialId: "CID-NOBYYSZB",
        description: "Validates essential frontend development skills utilizing the React framework. Demonstrates practical knowledge of JSX syntax, component life cycles, state management, and modern ES6+ JavaScript features used to build dynamic web applications.",
        skills: ["JSX", "Core React Concepts", "Component Management", "JavaScript Essentials", "Modern JavaScript Features"],
        imageUrl: "/certificates/react-cert.png",
        verifyLink: "https://www.mygreatlearning.com/certificate/NOBYYSZB"
      },
      {
        name: "JavaScript Development Techniques",
        issuer: "Mind Luster",
        date: "2024",
        credentialId: "CID-16720393707",
        description: "Validates proficiency in programming logic and modern scripting techniques using JavaScript. Covers foundational core features, advanced ES6+ development paradigms, and introduces modern typing and syntax extensions like TypeScript and JSX.",
        skills: ["JS Basics", "JS Features", "JSX", "TypeScript"],
        imageUrl: "/certificates/js-cert.jpg",
        verifyLink: "https://www.credly.com/badges/security-plus"
      }
    ]
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'researches', label: 'Researches' },
    { id: 'projects', label: 'Projects' },
    { id: 'games', label: 'Games' },
    { id: 'certificates', label: 'Certificates' }
  ];

  const subCategories: SubCategoryType[] = ['ALL', 'AI & ML', 'Distributed Systems', 'Monolithic', 'Cloud', 'Security', 'Web Development'];

  const filteredItems = useMemo(() => {
    let items = catalogData[activeTab];
    if (activeTab === 'certificates') {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        items = items.filter((item: CertificateItem) => 
          item.name.toLowerCase().includes(query) ||
          item.issuer.toLowerCase().includes(query) ||
          item.skills.some(s => s.toLowerCase().includes(query)) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return items;
    }
    
    if (selectedSubCategory !== 'ALL') {
      items = items.filter((item: ProjectItem) => item.category === selectedSubCategory);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter((item: ProjectItem) => 
        item.name.toLowerCase().includes(query) ||
        item.tech.some((t: string) => t.toLowerCase().includes(query))
      );
    }
    return items;
  }, [activeTab, selectedSubCategory, searchQuery]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setSelectedSubCategory('ALL');
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 min-h-[600px] flex flex-col">
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{sec.title}</h2>
          <h4 className={`text-xs font-mono uppercase tracking-wider font-bold mt-0.5 transition-colors duration-300 ${activeTheme.textColor}`}>
            — {sec.subtitle || "Technical Showcases"}
          </h4>
        </div>

        {/* DIARY SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search matching nodes..."
            className="w-full px-4 py-2 pl-10 font-mono text-xs bg-white border-2 rounded-xl focus:outline-none transition-all shadow-sm font-medium"
            style={{ borderColor: activeTheme.fillColor + '40' }}
          />
          <svg 
            className="absolute left-3.5 top-2.5 w-4 h-4" 
            style={{ color: activeTheme.fillColor }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* DIARY CONTAINER SYSTEM */}
      <div className="flex flex-1 relative items-stretch">
        
        {/* THE DIARY MAIN PAGE VIEW */}
        <div 
          className="flex-1 min-h-[500px] bg-slate-50/50 rounded-2xl rounded-r-none p-5 md:p-8 border-2 shadow-inner relative z-10 flex flex-col justify-between transition-all duration-300"
          style={{ borderColor: activeTheme.fillColor + '20' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-3 border-r border-dashed border-slate-300/60 bg-gradient-to-r from-slate-100/50 to-transparent rounded-l-2xl" />

          {/* PAGE INNER CONTENT WRAPPER */}
          <div className="pl-4 flex-1 flex flex-col justify-between space-y-5">
            
            {/* SUB-CATEGORY CHIPS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              {activeTab === 'projects' ? (
                <div className="flex flex-wrap gap-2">
                  {subCategories.map((cat) => {
                    const isSubActive = selectedSubCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedSubCategory(cat);
                          setCurrentPage(1);
                        }}
                        style={{ 
                          backgroundColor: isSubActive ? activeTheme.fillColor : 'transparent',
                          borderColor: isSubActive ? activeTheme.fillColor : '#cbd5e1'
                        }}
                        className={`px-3 py-1 text-[11px] font-mono font-bold tracking-wider rounded-xl border uppercase transition-all duration-200 cursor-pointer
                          ${isSubActive ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
                        `}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-slate-400">
                  {activeTab === 'certificates' ? 'Certifications & Credentials' : activeTab}
                </span>
              )}

              <span className="font-mono text-[11px] text-slate-400 font-extrabold uppercase tracking-wider self-end sm:self-center">
                Total : {filteredItems.length}
              </span>
            </div>

            {/* COMPACT CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-start content-start">
              {paginatedItems.length === 0 ? (
                <div className="col-span-full h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white/50 rounded-xl">
                  <span className="font-mono text-xs text-slate-400 font-medium">No matching registry files loaded.</span>
                </div>
              ) : (
                paginatedItems.map((item, idx) => {
                  // Check if it's a certificate
                  if (activeTab === 'certificates') {
                    const cert = item as CertificateItem;
                    return (
                      <div 
                        key={idx}
                        className="group relative min-h-[180px] p-4 rounded-xl bg-white border border-slate-200/80 transition-all duration-300 ease-out flex flex-row gap-4 justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden"
                        style={{ ['--glow-color' as any]: activeTheme.fillColor + '20' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 10px 24px var(--glow-color), 0 2px 4px ${activeTheme.fillColor}08`;
                          e.currentTarget.style.borderColor = activeTheme.fillColor + '60';
                          e.currentTarget.style.transform = 'translateY(-1.5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.01)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Left Content Side */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h5 className={`font-mono text-slate-900 text-base font-extrabold tracking-tight group-hover:${activeTheme.textColor} transition-colors duration-300 break-words`}>
                              {cert.name}
                            </h5>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="font-mono text-xs font-bold text-slate-600">
                                {cert.issuer}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono text-xs text-slate-400">
                                {cert.date}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {cert.skills.slice(0, 4).map((skill, sIdx) => (
                                <span 
                                  key={sIdx} 
                                  className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/40 uppercase tracking-wide whitespace-nowrap"
                                >
                                  {skill}
                                </span>
                              ))}
                              {cert.skills.length > 4 && (
                                <span className="font-mono text-[10px] font-bold text-slate-400 px-2 py-0.5">
                                  +{cert.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-start pt-2">
                            <button 
                              onClick={() => setSelectedCertificate(cert)}
                              className={`font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer text-slate-400 group-hover:${activeTheme.textColor}`}
                            >
                              View Certificate 
                              <span className="transform group-hover:translate-x-0.5 transition-transform font-sans text-xs">→</span>
                            </button>
                          </div>
                        </div>

                        {/* Right Thumbnail Side */}
                        {cert.imageUrl && (
                          <div className="w-24 h-full sm:w-28 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 relative self-center aspect-square sm:aspect-auto">
                            <img 
                              src={cert.imageUrl} 
                              alt={`${cert.name} preview`} 
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div 
                              className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" 
                              style={{ backgroundColor: activeTheme.fillColor }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular project/research/game card
                  const project = item as ProjectItem;
                  return (
                    <div 
                      key={idx}
                      className="group relative min-h-[180px] p-4 rounded-xl bg-white border border-slate-200/80 transition-all duration-300 ease-out flex flex-row gap-4 justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden"
                      style={{ ['--glow-color' as any]: activeTheme.fillColor + '20' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 10px 24px var(--glow-color), 0 2px 4px ${activeTheme.fillColor}08`;
                        e.currentTarget.style.borderColor = activeTheme.fillColor + '60';
                        e.currentTarget.style.transform = 'translateY(-1.5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.01)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Left Content Side */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h5 className={`font-mono text-slate-900 text-base font-extrabold tracking-tight group-hover:${activeTheme.textColor} transition-colors duration-300 break-words`}>
                            {project.name}
                          </h5>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {project.tech.map((t, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/40 uppercase tracking-wide whitespace-nowrap"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-start pt-2">
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className={`font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer text-slate-400 group-hover:${activeTheme.textColor}`}
                          >
                            See More 
                            <span className="transform group-hover:translate-x-0.5 transition-transform font-sans text-xs">→</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Thumbnail Side */}
                      {project.imageUrl && (
                        <div className="w-24 h-full sm:w-28 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 relative self-center aspect-square sm:aspect-auto">
                          <img 
                            src={project.imageUrl} 
                            alt={`${project.name} preview`} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div 
                            className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" 
                            style={{ backgroundColor: activeTheme.fillColor }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION TOOLBAR */}
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 bg-transparent">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1.5 font-mono text-xs font-bold uppercase rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                🗎 Prev
              </button>
              <span className="font-mono text-xs text-slate-500 font-extrabold tracking-wide">
                PAGE {currentPage} OF {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1.5 font-mono text-xs font-bold uppercase rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Next 🗎
              </button>
            </div>

          </div>
        </div>

        {/* DIARY TABS CONTAINER */}
        <div className="w-16 lg:w-20 flex flex-col relative z-0 py-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                box-id={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{ 
                  backgroundColor: isActive ? activeTheme.fillColor : '#f8fafc',
                  borderColor: isActive ? activeTheme.fillColor : activeTheme.fillColor + '20'
                }}
                className={`w-full flex-1 border-2 border-l-0 -ml-[2px] rounded-r-3xl rounded-l-none font-mono text-xs font-extrabold tracking-widest uppercase transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center [writing-mode:vertical-rl] select-none relative cursor-pointer
                  ${isActive ? 'text-white z-20 shadow-[4px_0_15px_rgba(0,0,0,0.07)]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 z-0'}
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* CERTIFICATE DETAIL MODAL */}
      {mounted && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          {selectedCertificate && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 isolate">
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setSelectedCertificate(null)}
                className="absolute inset-0 bg-slate-900/40 cursor-pointer"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.5 }}
                className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden z-10"
                style={{ borderColor: activeTheme.fillColor + '30', overscrollBehavior: 'contain' }}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-mono text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Certificate • {selectedCertificate.issuer}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedCertificate(null)}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="modal-scroll-pane flex-1 overflow-y-auto p-8 md:p-10 space-y-8 select-text scroll-smooth">
                  {/* Certificate Image */}
                  {selectedCertificate.imageUrl && (
                    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-md">
                      <img 
                        src={selectedCertificate.imageUrl} 
                        alt={selectedCertificate.name}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedCertificate.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="font-bold text-slate-700">{selectedCertificate.issuer}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">{selectedCertificate.date}</span>
                      {selectedCertificate.credentialId && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="font-mono text-xs text-slate-400">ID: {selectedCertificate.credentialId}</span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedCertificate.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">Skills Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded border border-slate-200 uppercase tracking-wide"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Verify Button */}
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={selectedCertificate.verifyLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundImage: activeTheme.gradient }}
                      className="px-6 py-3 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center"
                    >
                      Verify Certificate ↗
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* PROJECT DETAIL MODAL */}
      {mounted && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          {selectedProject && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 isolate">
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-900/40 cursor-pointer"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.5 }}
                className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden z-10"
                style={{ borderColor: activeTheme.fillColor + '30', overscrollBehavior: 'contain' }}
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      {selectedProject.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <AnimatePresence>
                  {previewImage && (
                    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 isolate">
                      <motion.div 
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setPreviewImage(null)}
                        className="absolute inset-0 bg-slate-950/60 cursor-zoom-out"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 6 }}
                        transition={{ type: "spring", damping: 28, stiffness: 380 }}
                        className="relative max-w-5xl max-h-[80vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden z-10"
                      >
                        <div className="overflow-auto p-2 bg-slate-900/5 flex justify-center items-center">
                          {/\.(mp4|webm|ogg|mov)$/i.test(previewImage.url) ? (
                            <video 
                              src={previewImage.url} 
                              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                              controls
                              autoPlay
                              playsInline
                            />
                          ) : (
                            <img 
                              src={previewImage.url} 
                              alt={previewImage.label}
                              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                            />
                          )}
                        </div>
                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 font-mono select-none">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide truncate">
                            🔍 Viewing: {previewImage.label}
                          </span>
                          <button 
                            onClick={() => setPreviewImage(null)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                <div className="modal-scroll-pane flex-1 overflow-y-auto p-8 md:p-10 space-y-8 select-text scroll-smooth">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t, idx) => (
                        <span key={idx} className="font-mono text-[10px] font-bold border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedProject.name}</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-normal">{selectedProject.introduction}</p>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">01. Problem Statement</h4>
                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-slate-700 text-sm leading-relaxed">
                      {selectedProject.problemStatement}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">02. Engineering Requirements</h4>
                    <ul className="space-y-2">
                      {selectedProject.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="font-mono text-xs font-bold text-emerald-500 mt-0.5">✔</span>
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">03. Applied Solution</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.solution}</p>
                  </div>

                  {selectedProject.coreFeatures && selectedProject.coreFeatures.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">Core Features</h4>
                      <ul className="space-y-2">
                        {selectedProject.coreFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="font-mono text-xs font-bold text-blue-500 mt-0.5">◆</span>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.technicalHighlights && selectedProject.technicalHighlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">Technical Highlights</h4>
                      <ul className="space-y-2">
                        {selectedProject.technicalHighlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="font-mono text-xs font-bold text-purple-500 mt-0.5">★</span>
                            <span className="leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">04. Architecture & Design Mapping</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.architecture}</p>
                  </div>

                  {selectedProject.mediaGroups && selectedProject.mediaGroups.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">
                        05 / System Metrics & Interface Preview
                      </h4>
                      
                      <div className="space-y-4">
                        {selectedProject.mediaGroups.map((group, groupIndex) => {
                          const currentIndex = mediaGroupIndices[groupIndex] || 0;
                          
                          return (
                            <div key={groupIndex} className="space-y-2">
                              <h5 className="font-mono text-sm font-bold text-slate-700 tracking-wide">
                                {group.groupTitle}
                              </h5>
                              
                              <div className="relative bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden">
                                <div className="relative aspect-video overflow-hidden">
                                  <AnimatePresence mode="wait">
                                    <motion.div
                                      key={`${groupIndex}-${currentIndex}`}
                                      initial={{ opacity: 0, x: 100 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -100 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="w-full h-full"
                                    >
                                      {/\.(mp4|webm|ogg|mov)$/i.test(group.items[currentIndex].url) ? (
                                        <video 
                                          src={group.items[currentIndex].url} 
                                          className="w-full h-full object-contain bg-slate-900/5"
                                          controls
                                          autoPlay
                                          playsInline
                                          key={`${groupIndex}-${currentIndex}`}
                                        />
                                      ) : (
                                        <img 
                                          src={group.items[currentIndex].url} 
                                          alt={`${selectedProject.name} - ${group.items[currentIndex].label}`} 
                                          className="w-full h-full object-contain bg-slate-900/5 cursor-pointer hover:opacity-90 transition-opacity"
                                          loading="lazy"
                                          onClick={() => setPreviewImage({ 
                                            url: group.items[currentIndex].url, 
                                            label: group.items[currentIndex].label 
                                          })}
                                        />
                                      )}
                                    </motion.div>
                                  </AnimatePresence>

                                  {group.items.length > 1 && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setMediaGroupIndices(prev => ({
                                            ...prev,
                                            [groupIndex]: currentIndex === 0 
                                              ? group.items.length - 1 
                                              : currentIndex - 1
                                          }));
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10 cursor-pointer"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setMediaGroupIndices(prev => ({
                                            ...prev,
                                            [groupIndex]: currentIndex === group.items.length - 1 
                                              ? 0 
                                              : currentIndex + 1
                                          }));
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10 cursor-pointer"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                      </button>
                                    </>
                                  )}
                                </div>

                                <div className="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-bold text-slate-600 truncate">
                                      {group.items[currentIndex].label}
                                    </span>
                                    {group.items.length > 1 && (
                                      <span className="font-mono text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                        {currentIndex + 1} / {group.items.length}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {group.items.length > 1 && (
                                      <div className="flex gap-1.5 mr-2">
                                        {group.items.map((_, idx) => (
                                          <button
                                            key={idx}
                                            onClick={() => {
                                              setMediaGroupIndices(prev => ({
                                                ...prev,
                                                [groupIndex]: idx
                                              }));
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                              idx === currentIndex 
                                                ? 'bg-slate-800 w-4' 
                                                : 'bg-slate-300 hover:bg-slate-400'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                    
                                    <button
                                      onClick={() => {
                                        const asset = group.items[currentIndex];
                                        if (/\.(mp4|webm|ogg|mov)$/i.test(asset.url)) {
                                          window.open(asset.url, '_blank');
                                        } else {
                                          setPreviewImage({ url: asset.url, label: asset.label });
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                    >
                                      {/\.(mp4|webm|ogg|mov)$/i.test(group.items[currentIndex].url) 
                                        ? 'Open Video' 
                                        : 'Expand View'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <hr className="border-slate-100" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div>
                      <h5 className="font-mono text-xs font-extrabold uppercase text-slate-700">Open-source Core Repository</h5>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedProject.githubLink}</p>
                    </div>
                    <a 
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundImage: activeTheme.gradient }}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center"
                    >
                      Inspect Source ↗
                    </a>
                  </div>

                  {selectedProject.playLink && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/60">
                      <div>
                        <h5 className="font-mono text-xs font-extrabold uppercase text-emerald-700">Wanna tryout?</h5>
                        <p className="text-xs text-emerald-600 font-mono mt-0.5">Launch live and experience the application...</p>
                      </div>
                      <a 
                        href={selectedProject.playLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundImage: activeTheme.gradient }}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center whitespace-nowrap"
                      >
                        Launch ▶
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}