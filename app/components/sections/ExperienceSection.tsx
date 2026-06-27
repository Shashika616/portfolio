"use client";

import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../../types";
import { useGlobalTheme } from "../../context/ThemeContext";

interface ExperienceSectionProps {
  sec: Section;
}

interface ExperienceMedia {
  url: string;
  label: string;
  buttonText: string;
}

interface MediaGroup {
  groupTitle: string;
  items: ExperienceMedia[];
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  location?: string;
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  tech: string[];
  overview: string;
  description: string;
  challenges: string[];
  achievements: string[];
  responsibilities: string[];
  imageUrl?: string;
  githubLink?: string;
  liveLink?: string;
  mediaGroups?: MediaGroup[];
}

export function ExperienceSection({ sec }: ExperienceSectionProps) {
  const { activeTheme } = useGlobalTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; label: string } | null>(null);
  const [mediaGroupIndices, setMediaGroupIndices] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // BULLETPROOF CSS PORTAL STATE ROOT LOCK ENGINE
  useEffect(() => {
    if (!selectedExperience) return;

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
  }, [selectedExperience]);

  const experienceData: ExperienceItem[] = [
    {
      id: "wso2-internship",
      title: "Software Engineer (Intern)",
      company: "WSO2 LLC",
      duration: "2024",
      location: "Colombo, Sri Lanka",
      type: "Internship",
      tech: ["WSO2 Identity Server", "Asgardeo", "WSO2 Choreo", "JAVA", "Spring boot", "Servicenow","JavaScript", "React", "SAML 2.0", "OpenID Connect", "RBAC", "REST APIs", "IAM", "APIM", "Agile"],
      overview: "Implemented enterprise-grade identity and access management solutions for global enterprises, configuring SSO protocols and building internal tooling for engineer feedback management.",
      description: "As a Software Engineer Intern at WSO2, I worked on enterprise identity and access management solutions serving 1000+ enterprise users globally. I implemented single sign-on (SSO) solutions using WSO2 Identity Server and Asgardeo, configuring SAML 2.0 and OpenID Connect (OIDC) protocols for enterprise application authentication. I also supported multi-tenant identity governance with role-based access control (RBAC), enabling secure federated identity across distributed systems.",
      challenges: [
        "Requirement Analysis and Adapt the System's Design to Changing Requirements.",
        "Configuring SAML 2.0 and OIDC protocols to work seamlessly across diverse enterprise applications with varying security requirements.",
        "Managing multi-tenant identity governance while ensuring zero downtime during configuration updates for 100+ global users.",
        "Balancing security requirements with user experience, ensuring authentication flows remained frictionless while maintaining enterprise-grade security."
      ],
      achievements: [
        "Successfully deployed SSO solutions reducing login friction for 100+ enterprise users across global teams.",
        "Reduced manual operational overhead by 40% through the ServiceNow portal implementation for engineer feedback management.",
        "Received recognition for mentoring junior team members on IAM concepts and secure coding principles."
      ],
      responsibilities: [
        "Implemented SSO solutions using WSO2 Identity Server and Asgardeo with SAML 2.0 and OIDC protocols.",
        "Secure API Management using WSO2 Choreo.",
        "Supported multi-tenant identity governance with role-based access control (RBAC).",
        "Designed and deployed a ServiceNow portal for engineer feedback management with comprehensive access control layers.",
        "Built REST APIs, automated notification workflows, and interactive dashboards.",
        "Collaborated with cross-functional teams (Product, QA, DevOps, Security) in an agile environment.",
        "Participated in sprint planning, code reviews, and deployment cycles for production systems.",
        "Contributed to best practices documentation and mentored junior team members on IAM concepts."
      ]
    },
    {
      id: "seefa-part-time",
      title: "Software Engineer",
      company: "Seefa Business Solutions",
      duration: "2026 - Present",
      location: "Colombo, Sri Lanka",
      type: "Part-time",
      tech: [".NET", "AngularJS", "REACT", "AZURE", "REST APIs", "Authentication", "Authorization", "Audit Logging", "Ticket Management", "Workflow Automation", "RBAC"],
      overview: "Engineered customer management and ticket lifecycle systems, implementing secure authentication, permission controls, and automated workflows for 50+ concurrent users.",
      description: "As a Software Engineer at Seefa Business Solutions, I engineered a customer management application to track organizational accounts, commissions, payments, and promotion schemes. I implemented secure user authentication, fine-grained permission controls, and audit logging for financial transaction transparency. Additionally, I built an end-to-end ticket lifecycle management system for product change requests and new feature implementations, with automated routing, escalation workflows, and role-based ticket assignment.",
      challenges: [
        "Ensuring financial transaction transparency while maintaining strict audit logging requirements for compliance.",
        "Designing a scalable ticket routing system that could handle varying complexity levels of change requests.",
        "Building a permission system that could support fine-grained access controls for different user roles."
      ],
      achievements: [
        "Delivered RESTful APIs supporting 50+ concurrent users with 99.5% uptime.",
        "Improved ticket resolution time by 35% through automated routing and escalation workflows.",
        "Enhanced customer satisfaction scores through faster response times and transparent ticket tracking."
      ],
      responsibilities: [
        "Engineered a customer management application for tracking accounts, commissions, payments, and promotion schemes.",
        "Implemented secure user authentication, fine-grained permission controls, and audit logging.",
        "Built an end-to-end ticket lifecycle management system for product change requests.",
        "Implemented automated routing, escalation workflows, and role-based ticket assignment.",
        "Delivered RESTful APIs with 99.5% uptime for 50+ concurrent users."
      ]
    }
  ];

  const filteredItems = useMemo(() => {
    let items = experienceData;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.duration.toLowerCase().includes(query) ||
        item.tech.some(t => t.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)
      );
    }
    return items;
  }, [searchQuery]);

  return (
    <div className="space-y-6 min-h-[600px] flex flex-col">
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{sec.title}</h2>
          <h4 className={`text-xs font-mono uppercase tracking-wider font-bold mt-0.5 transition-colors duration-300 ${activeTheme.textColor}`}>
            — {sec.subtitle || "Professional Journey"}
          </h4>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search by title, company, tech..."
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

      {/* EXPERIENCE CONTAINER */}
      <div className="flex flex-1 relative items-stretch">
        {/* MAIN VIEW */}
        <div 
          className="flex-1 min-h-[500px] bg-slate-50/50 rounded-2xl p-5 md:p-8 border-2 shadow-inner relative z-10 flex flex-col justify-between transition-all duration-300"
          style={{ borderColor: activeTheme.fillColor + '20' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-3 border-r border-dashed border-slate-300/60 bg-gradient-to-r from-slate-100/50 to-transparent rounded-l-2xl" />

          {/* INNER CONTENT */}
          <div className="pl-4 flex-1 flex flex-col justify-between space-y-5">
            
            {/* HEADER WITH COUNT */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Experience Timeline
              </span>
              <span className="font-mono text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">
                Total : {filteredItems.length}
              </span>
            </div>

            {/* EXPERIENCE CARDS - SINGLE COLUMN */}
            <div className="flex flex-col gap-4 flex-1 items-start content-start">
              {filteredItems.length === 0 ? (
                <div className="w-full h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white/50 rounded-xl">
                  <span className="font-mono text-xs text-slate-400 font-medium">No matching experience records found.</span>
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="group relative w-full p-5 rounded-xl bg-white border-2 transition-all duration-300 ease-out flex flex-row gap-4 justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden"
                    style={{ 
                      ['--glow-color' as any]: activeTheme.fillColor + '20',
                      borderColor: activeTheme.fillColor + '30'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 24px var(--glow-color), 0 2px 4px ${activeTheme.fillColor}08`;
                      e.currentTarget.style.borderColor = activeTheme.fillColor + '80';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.01)';
                      e.currentTarget.style.borderColor = activeTheme.fillColor + '30';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Left Content Side */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Header with Company and Duration */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h5 className={`font-mono text-slate-900 text-lg font-extrabold tracking-tight transition-colors duration-300 group-hover:${activeTheme.textColor}`}>
                              {item.title}
                            </h5>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="font-mono text-sm font-bold text-slate-600">
                                {item.company}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono text-xs font-medium text-slate-400">
                                {item.duration}
                              </span>
                              {item.location && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="font-mono text-xs font-medium text-slate-400">
                                    {item.location}
                                  </span>
                                </>
                              )}
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${activeTheme.accentColor} text-white`}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Overview */}
                        <p className="text-sm text-slate-600 leading-relaxed mt-3">
                          {item.overview}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tech.slice(0, 6).map((t, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/40 uppercase tracking-wide whitespace-nowrap"
                            >
                              {t}
                            </span>
                          ))}
                          {item.tech.length > 6 && (
                            <span className="font-mono text-[10px] font-bold text-slate-400 px-2 py-0.5">
                              +{item.tech.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-start pt-3">
                        <button 
                          onClick={() => setSelectedExperience(item)}
                          className={`font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer text-slate-400 group-hover:${activeTheme.textColor}`}
                        >
                          Read Full Experience 
                          <span className="transform group-hover:translate-x-0.5 transition-transform font-sans text-xs">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Thumbnail Side */}
                    {item.imageUrl && (
                      <div className="w-28 h-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex-shrink-0 relative self-center aspect-square sm:aspect-auto">
                        <img 
                          src={item.imageUrl} 
                          alt={`${item.company} preview`} 
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
                ))
              )}
            </div>

            {/* COUNT FOOTER */}
            <div className="flex items-center justify-end border-t border-slate-200/60 pt-4 bg-transparent">
              <span className="font-mono text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">
                Showing {filteredItems.length} experience{filteredItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EXPERIENCE DETAIL MODAL */}
      {mounted && ReactDOM.createPortal(
        <AnimatePresence mode="wait">
          {selectedExperience && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 isolate">
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setSelectedExperience(null)}
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
                    <span className={`w-2 h-2 rounded-full animate-pulse ${activeTheme.accentColor}`} />
                    <span className="font-mono text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      {selectedExperience.company} • {selectedExperience.duration}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedExperience(null)}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* LIGHTBOX PREVIEW */}
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

                {/* Content */}
                <div className="modal-scroll-pane flex-1 overflow-y-auto p-8 md:p-10 space-y-8 select-text scroll-smooth">
                  {/* Title Block */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedExperience.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${activeTheme.accentColor} text-white`}>
                        {selectedExperience.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-bold text-slate-700">{selectedExperience.company}</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-mono text-slate-500">{selectedExperience.duration}</span>
                      {selectedExperience.location && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">{selectedExperience.location}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedExperience.tech.map((t, idx) => (
                        <span key={idx} className="font-mono text-[10px] font-bold border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Overview / What I Did */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">01. Overview</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedExperience.description}</p>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">02. Key Responsibilities</h4>
                    <ul className="space-y-2">
                      {selectedExperience.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="font-mono text-xs font-bold text-blue-500 mt-0.5">◆</span>
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">03. Challenges Faced</h4>
                    <ul className="space-y-2">
                      {selectedExperience.challenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="font-mono text-xs font-bold text-amber-500 mt-0.5">⚠</span>
                          <span className="leading-relaxed">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">04. Achievements</h4>
                    <ul className="space-y-2">
                      {selectedExperience.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="font-mono text-xs font-bold text-emerald-500 mt-0.5">★</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Media Section */}
                  {selectedExperience.mediaGroups && selectedExperience.mediaGroups.length > 0 && (
                    <div className="space-y-6">
                      <hr className="border-slate-100" />
                      <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-400">
                        05 / Media & Documentation
                      </h4>
                      
                      <div className="space-y-4">
                        {selectedExperience.mediaGroups.map((group, groupIndex) => {
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
                                          alt={`${selectedExperience.company} - ${group.items[currentIndex].label}`} 
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

                  {/* Action Buttons */}
                  <hr className="border-slate-100" />
                  <div className="flex flex-wrap gap-4">
                    {selectedExperience.githubLink && (
                      <a 
                        href={selectedExperience.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundImage: activeTheme.gradient }}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center"
                      >
                        View Repository ↗
                      </a>
                    )}
                    {selectedExperience.liveLink && (
                      <a 
                        href={selectedExperience.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundImage: activeTheme.gradient }}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider text-white shadow-md uppercase hover:brightness-110 transition-all text-center"
                      >
                        Live Demo ▶
                      </a>
                    )}
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