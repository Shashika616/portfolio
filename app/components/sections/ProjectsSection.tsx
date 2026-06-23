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

type TabType = 'researches' | 'projects' | 'games';
type SubCategoryType = 'ALL' | 'AI & ML' | 'Distributed Systems' | 'Monolithic';

interface ProjectMedia {
  url: string;
  label: string;       // e.g., "System Metrics", "Architecture Map", "Loss Curves"
  buttonText: string;  // e.g., "View Metrics", "View Schematic", "View Plot"
}

interface ProjectItem {
  name: string;
  category: 'AI & ML' | 'Distributed Systems' | 'Monolithic' | 'Research' | 'Simulation';
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
  media?: ProjectMedia[];
}

export function ProjectsSection({ sec }: ProjectsSectionProps) {
  const { activeTheme } = useGlobalTheme();
  const [activeTab, setActiveTab] = useState<TabType>('researches');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType>('ALL');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);
  // Tracks which media index has its dropdown menu actively toggled open
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  // Tracks which asset image is currently expanded in the inner popup modal
  const [previewImage, setPreviewImage] = useState<{ url: string; label: string } | null>(null);
  
  const itemsPerPage = 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  // BULLETPROOF CSS PORTAL STATE ROOT LOCK ENGINE
  useEffect(() => {
    if (!selectedProject) return;

    // Capture exact structural elements to ensure we lock both framework roots
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Store original runtime styles
    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalHtmlHeight = htmlElement.style.height;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalBodyHeight = bodyElement.style.height;

    // Force absolute structural limits on the DOM viewport tree
    htmlElement.style.overflow = "hidden";
    htmlElement.style.height = "100vh";
    bodyElement.style.overflow = "hidden";
    bodyElement.style.height = "100vh";

    return () => {
      // Revert styles instantly on unmount/close
      htmlElement.style.overflow = originalHtmlOverflow;
      htmlElement.style.height = originalHtmlHeight;
      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.height = originalBodyHeight;
    };
  }, [selectedProject]);

  const catalogData: Record<TabType, ProjectItem[]> = {
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
        media: [
        { 
          url: "/hash-pipeline/graph-hash.png", 
          label: "Solution Architecture", 
          buttonText: "View Architectural Diagram" 
        },
        { 
          url: "/hash-pipeline/time-comparison.png", 
          label: "Time Complexity Comparison", 
          buttonText: "View Comparison Table" 
        },
        { 
          url: "/hash-pipeline/stat-comparison.png", 
          label: "Statistical Comparison", 
          buttonText: "View Comparison Table" 
        },
        { 
          url: "/hash-pipeline/prac-dep.png", 
          label: "Practical Dependency Analysis", 
          buttonText: "View Comparison Table" 
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
        media: [
        { 
          url: "/medical-image/tumor1.jpg", 
          label: "3D-CT Scan Sample", 
          buttonText: "View Sample Scan" 
        },
        { 
          url: "/medical-image/tumor2.jpg", 
          label: "3D-CT Scan Slice Sample", 
          buttonText: "View Sample Scan" 
        },
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
    ],
    projects: [
      { 
        name: "sri-care-core", 
        category: "Distributed Systems",
        tech: ["Node.js", "Redis", "Docker", "gRPC"],
        introduction: "A high-performance backend messaging engine designed to process real-time communication across decoupled server components.",
        problemStatement: "High-volume data streams often cause severe message drops and thread starvation when relational databases face simultaneous write operations.",
        requirements: [
          "Process asynchronous message streams with latency under 15 milliseconds.",
          "Prevent thread blockage during unexpected spikes in write traffic.",
          "Maintain transactional atomicity across all active nodes."
        ],
        solution: "Decoupled the write path using asynchronous messaging queues backed by Redis transactional memory caching layers.",
        architecture: "Utilizes a producer-consumer topology where high-frequency streams are ingested into Redis buffers before being systematically drained into durable storage tables.",
        githubLink: "https://github.com/your-username/sri-care-core"
      },
      { 
        name: "compiler-arena", 
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
        media: [
        { 
          url: "/Compiler/arch.png", 
          label: "3D-CT Scan Sample", 
          buttonText: "View Sample Scan" 
        },
      ]
      }
    ],
    games: [
      { 
        name: "macro-meta-engine", 
        category: "Simulation",
        tech: ["React", "HTML5 Canvas", "Algorithms"],
        introduction: "An analytical strategy playground simulating multi-agent economic balancing equations in real time.",
        problemStatement: "Simulating hundreds of autonomous agents using heavy DOM elements causes massive UI lag and drops frame rates well below functional limits.",
        requirements: [
          "Render more than 500 active tracking units smoothly at a consistent 60 FPS.",
          "Process real-time price updates based on fluctuating supply-and-demand metrics.",
          "Expose fine-grained system controls to let users adjust running parameters instantly."
        ],
        solution: "Offloaded all complex visual updates to a high-performance HTML5 Canvas matrix, driving calculations through optimized vector arrays.",
        architecture: "Implements a strict state separation pattern where a lightweight calculation loop manages economic updates before drawing the entire frame layout to the canvas.",
        githubLink: "https://github.com/your-username/macro-meta-engine"
      }
    ]
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'researches', label: 'Researches' },
    { id: 'projects', label: 'Projects' },
    { id: 'games', label: 'Games' }
  ];

  const subCategories: SubCategoryType[] = ['ALL', 'AI & ML', 'Distributed Systems', 'Monolithic'];

  const filteredItems = useMemo(() => {
    let items = catalogData[activeTab];
    if (selectedSubCategory !== 'ALL') {
      items = items.filter(item => item.category === selectedSubCategory);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.tech.some(t => t.toLowerCase().includes(query))
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
                   {activeTab}
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
            paginatedItems.map((item, idx) => (
              <div 
                key={idx}
                className="group relative min-h-[160px] p-4 rounded-xl bg-white border border-slate-200/80 transition-all duration-300 ease-out flex flex-row gap-4 justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden"
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
                    <h5 className={`font-mono text-slate-900 text-base font-extrabold tracking-tight group-hover:${activeTheme.textColor} transition-colors duration-300 truncate`}>
                      {item.name}
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-h-[44px] overflow-hidden">
                      {item.tech.map((t, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/40 uppercase tracking-wide"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-start pt-2">
                    <button 
                      onClick={() => setSelectedProject(item)}
                      className={`font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer text-slate-400 group-hover:${activeTheme.textColor}`}
                    >
                      See More 
                      <span className="transform group-hover:translate-x-0.5 transition-transform font-sans text-xs">→</span>
                    </button>
                  </div>
                </div>

                {/* Right Thumbnail Side */}
                {item.imageUrl && (
                  <div className="w-24 h-full sm:w-28 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 relative self-center aspect-square sm:aspect-auto">
                    <img 
                      src={item.imageUrl} 
                      alt={`${item.name} preview`} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        // Optional: Fallback if image fails to load
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Soft overlay matching the theme hue */}
                    <div 
                      className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" 
                      style={{ backgroundColor: activeTheme.fillColor }}
                    />
                  </div>
                )}
              </div>
            ))
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

      {/* INDUSTRIAL CASE STUDY CASE READER OVERLAY (ANIMATED PORTAL) */}
      {mounted && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          {selectedProject && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 isolate">
              
              {/* 1. Backdrop Overlay (Fades and Blurs Background smoothly) */}
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-900/40 cursor-pointer"
              />

              {/* 2. Modal Sheet Panel Chassis (Enters with a clean, spring-loaded upscale + lift) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.5 }}
                className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden z-10"
                style={{ borderColor: activeTheme.fillColor + '30', overscrollBehavior: 'contain' }}
              >
                {/* Blueprint Header */}
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

                {/* SECONDARY LAYER: LIGHTBOX POPUP PREVIEW OVERLAY (WITH VIDEO INTEGRATION) */}
                <AnimatePresence>
                  {previewImage && (
                    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 isolate">
                      {/* Dimming Backdrop */}
                      <motion.div 
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setPreviewImage(null)}
                        className="absolute inset-0 bg-slate-950/60 cursor-zoom-out"
                      />

                      {/* Frame Chassis */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 6 }}
                        transition={{ type: "spring", damping: 28, stiffness: 380 }}
                        className="relative max-w-5xl max-h-[80vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden z-10"
                      >
                        {/* Dynamic Image/Video Canvas Box */}
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

                        {/* Footer Subtext Bar */}
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

                {/* Document Technical Content View */}
                <div className="modal-scroll-pane flex-1 overflow-y-auto p-8 md:p-10 space-y-8 select-text scroll-smooth">
                  
                  {/* Introduction Title Block */}
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

                  {/* Problem Statement Section */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">01.  Problem Statement</h4>
                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-slate-700 text-sm leading-relaxed">
                      {selectedProject.problemStatement}
                    </div>
                  </div>

                  {/* Requirements Specifications Checklist */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">02.  Engineering Requirements</h4>
                    <ul className="space-y-2">
                      {selectedProject.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="font-mono text-xs font-bold text-emerald-500 mt-0.5">✔</span>
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* The Core Implementation Solution */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">03.  Applied Solution</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.solution}</p>
                  </div>

                   {/* Core Features Section - NEW */}
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

                  {/* Technical Highlights Section - NEW */}
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

                  {/* Architectural Layout Engine */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">04.  Architecture & Design Mapping</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.architecture}</p>
                  </div>

                  {/* Live Media Showcase Layout Grid (Dynamic Matrix Engine with Image/Video Intercept) */}
                  {selectedProject.media && selectedProject.media.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">
                        05 / System Metrics & Interface Preview
                      </h4>
                      
                      <div className={`grid gap-4 w-full ${
                        selectedProject.media.length === 1 
                          ? 'grid-cols-1' 
                          : 'grid-cols-1 sm:grid-cols-2'
                      }`}>
                        {selectedProject.media.map((asset, index) => {
                          const isMenuOpen = activeMenuIndex === index;
                          
                          // Simple regex checker to see if the file is a video format
                          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(asset.url);

                          return (
                            <div 
                              key={index}
                              className="aspect-video bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center text-center relative group/media select-none"
                            >
                              {/* DYNAMIC MEDIA INTERCEPT DISPATCHER */}
                              {isVideo ? (
                                <video 
                                  src={asset.url} 
                                  className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/media:blur-sm group-hover/media:scale-[1.01]"
                                  muted
                                  loop
                                  autoPlay
                                  playsInline
                                />
                              ) : (
                                <img 
                                  src={asset.url} 
                                  alt={`${selectedProject.name} asset - ${asset.label}`} 
                                  className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/media:blur-sm group-hover/media:scale-[1.01]"
                                  loading="lazy"
                                />
                              )}
                              
                              {/* Top Edge Label */}
                              <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-200 tracking-wider uppercase border border-white/10 opacity-100 group-hover/media:opacity-0 transition-opacity duration-200 z-10">
                                {asset.label}
                              </div>
                              
                              {/* Hover Backdrop Chassis */}
                              <div className={`absolute inset-0 bg-slate-900/10 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10
                                ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/media:opacity-100'}
                              `}>
                                
                                {/* Menu Container Box */}
                                <div className="relative">
                                  <button 
                                    onClick={() => setActiveMenuIndex(isMenuOpen ? null : index)}
                                    className="px-3 py-1.5 bg-white/95 hover:bg-white text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                                  >
                                    <svg className="w-3.5 h-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>Options</span>
                                    <span className={`text-[8px] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                                  </button>

                                  {/* Dropdown Action Card */}
                                  <AnimatePresence>
                                    {isMenuOpen && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuIndex(null)} />
                                        
                                        <motion.div 
                                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                          transition={{ duration: 0.15, ease: "easeOut" }}
                                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 p-1"
                                        >
                                          <button
                                            onClick={() => {
                                              setPreviewImage({ url: asset.url, label: asset.label });
                                              setActiveMenuIndex(null);
                                            }}
                                            className="w-full text-left px-3 py-2 font-mono text-[10px] font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                                          >
                                            <span>Preview Here</span>
                                            <span className="text-slate-400 font-sans text-xs">⛶</span>
                                          </button>
                                          
                                          <button
                                            onClick={() => {
                                              window.open(asset.url, '_blank');
                                              setActiveMenuIndex(null);
                                            }}
                                            className="w-full text-left px-3 py-2 font-mono text-[10px] font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors border-t border-slate-100 cursor-pointer"
                                          >
                                            <span>New Tab</span>
                                            <span className="text-slate-400 font-sans text-xs">↗</span>
                                          </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <hr className="border-slate-100" />

                  {/* Code Repository Actions Sheet */}
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

                   {/* Play Game Section - NEW */}
                    {selectedProject.playLink && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/60">
                        <div>
                          <h5 className="font-mono text-xs font-extrabold uppercase text-emerald-700">Interactive Playground</h5>
                          <p className="text-xs text-emerald-600 font-mono mt-0.5">Launch the live game in your browser</p>
                        </div>
                        <a 
                          href={selectedProject.playLink}
                          target="_blank"
                          rel="noreferrer"
                           style={{ backgroundImage: activeTheme.gradient }}
                          className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center whitespace-nowrap"
                        >
                          Play Game ▶
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