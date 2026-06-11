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

interface ProjectItem {
  name: string;
  category: 'AI & ML' | 'Distributed Systems' | 'Monolithic' | 'Research' | 'Simulation';
  tech: string[];
  introduction: string;
  problemStatement: string;
  requirements: string[];
  solution: string;
  architecture: string;
  githubLink: string;
}

export function ProjectsSection({ sec }: ProjectsSectionProps) {
  const { activeTheme } = useGlobalTheme();
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType>('ALL');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);
  
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
        name: "cryptography-hash-model", 
        category: "Research",
        tech: ["Argon2", "Python", "LaTeX"],
        introduction: "An academic investigation into expanding side-channel resistance parameters within memory-hard hashing operations.",
        problemStatement: "Traditional password storage arrays fall short against high-throughput parallelized ASIC optimization, rendering standard SHA variants vulnerable to brute-force saturation.",
        requirements: [
          "Enforce strictly configurable multi-threading memory lane requirements.",
          "Prevent time-differential memory indexing leakage arrays.",
          "Maintain deterministic cryptographic verification bounds under 200ms."
        ],
        solution: "Engineered a layered mathematical framework utilizing variable-time Argon2 instances coupled with random noise padding parameters.",
        architecture: "Implements custom sequence matrices processed natively within lower-level memory pipes to intercept pre-computed cache maps before execution blocks.",
        githubLink: "https://github.com/your-username/cryptography-hash-model"
      },
      { 
        name: "cnn-neural-analysis", 
        category: "AI & ML",
        tech: ["TensorFlow", "PyTorch", "OpenCV"],
        introduction: "A deep learning automation platform tailored for fast real-world feature extraction and item metric analysis.",
        problemStatement: "Legacy item verification workflows rely heavily on manual verification rules that fail to handle real-time spatial deformation or changing illumination profiles.",
        requirements: [
          "Achieve a mean average precision score (mAP) > 94% on messy edge assets.",
          "Deliver inference pipeline execution latency bounded strictly within 35ms.",
          "Expose dynamic model adjustment endpoints via local processing sockets."
        ],
        solution: "Deployed a customized, trimmed Convolutional Neural Network utilizing residual layers to bypass spatial breakdown trends across continuous video streams.",
        architecture: "Built on an image pipeline that leverages hardware-accelerated processing matrices, sending frames through convolutional arrays before returning categorized metrics.",
        githubLink: "https://github.com/your-username/cnn-neural-analysis"
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
        name: "lexer-parser-v1", 
        category: "Monolithic",
        tech: ["TypeScript", "Compilers", "CS Theory"],
        introduction: "A lightweight, deterministic compiler frontend engineered to tokenize and parse custom structured grammar configurations.",
        problemStatement: "Standard evaluation engines rely on heavy regular expressions, leading to exponential catastrophic backtracking when parsing nested code schemas.",
        requirements: [
          "Construct a true Abstract Syntax Tree (AST) without external parsing libraries.",
          "Deliver clear, error-pointing feedback detailing exact character offsets.",
          "Maintain predictable linear time complexity $O(n)$ relative to input length."
        ],
        solution: "Built a handwritten, recursive-descent lexer and LL(1) parser engine that cleanly breaks down input streams into highly structured data trees.",
        architecture: "Processes text through a single-pass tokenization stream, validating structure against strict context-free grammars before mapping nodes directly onto the output tree.",
        githubLink: "https://github.com/your-username/lexer-parser-v1"
      },
      { 
        name: "nexus-auth-harden", 
        category: "Distributed Systems",
        tech: ["Go", "Kubernetes", "eBPF"],
        introduction: "A Zero-Trust microservice proxy designed to intercept and validate identities right at the cluster network boundary.",
        problemStatement: "Traditional perimeter security allows internal lateral movement if a single edge server is compromised, leaving private databases vulnerable.",
        requirements: [
          "Enforce strict mutual TLS (mTLS) handshakes across all service channels.",
          "Intercept network packets at the kernel layer to bypass application overhead.",
          "Keep proxy processing delays below 2 milliseconds per network jump."
        ],
        solution: "Developed an eBPF-powered network controller that enforces secure identity handshakes directly within kernel-level execution pipes.",
        architecture: "Integrates lightweight Go control planes with embedded kernel programs to continuously validate cryptographic signatures without touching user-space network code.",
        githubLink: "https://github.com/your-username/nexus-auth-harden"
      },
      { 
        name: "predictive-matrix-api", 
        category: "AI & ML",
        tech: ["Python", "FastAPI", "Scikit-Learn"],
        introduction: "A real-time predictive service built to evaluate streaming logs and identify feature regression flags on the fly.",
        problemStatement: "Batch processing models take hours to flag system anomalies, causing a massive delay between an incident occurring and triggering automated alerts.",
        requirements: [
          "Ingest and score active system log data concurrently across multiple streams.",
          "Expose clear, low-latency prediction metrics through standardized JSON APIs.",
          "Incorporate online learning components to handle system behavior drift."
        ],
        solution: "Built a streaming data engine with FastAPI that routes incoming logs straight through optimized matrix prediction pipelines.",
        architecture: "Utilizes non-blocking async event loops to feed incoming telemetry into pre-loaded model instances, updating internal anomaly states immediately.",
        githubLink: "https://github.com/your-username/predictive-matrix-api"
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
                  Registry // {activeTab}
                </span>
              )}

              <span className="font-mono text-[11px] text-slate-400 font-extrabold uppercase tracking-wider self-end sm:self-center">
                Total Indexes: {filteredItems.length}
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
                    className="group relative h-32 p-4 rounded-xl bg-white border border-slate-200/80 transition-all duration-300 ease-out flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
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

                    <div className="flex justify-end pt-1">
                      <button 
                        onClick={() => setSelectedProject(item)}
                        className={`font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer text-slate-400 group-hover:${activeTheme.textColor}`}
                      >
                        See More 
                        <span className="transform group-hover:translate-x-0.5 transition-transform font-sans text-xs">→</span>
                      </button>
                    </div>
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
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">01 / Problem Statement</h4>
                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-slate-700 text-sm leading-relaxed">
                      {selectedProject.problemStatement}
                    </div>
                  </div>

                  {/* Requirements Specifications Checklist */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">02 / Engineering Requirements</h4>
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
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">03 / Applied Solution</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.solution}</p>
                  </div>

                  {/* Architectural Layout Engine */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">04 / Architecture & Design Mapping</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.architecture}</p>
                  </div>

                  {/* Live Media Showcase Layout Grid */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">05 / System Metrics & Interface Preview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="aspect-video bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-center p-4">
                        <span className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-wider">[ Video Demo Frame Placeholder ]</span>
                      </div>
                      <div className="aspect-video bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-center p-4">
                        <span className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-wider">[ Architecture Diagram Panel ]</span>
                      </div>
                    </div>
                  </div>

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