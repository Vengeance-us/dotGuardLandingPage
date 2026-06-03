/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Generator } from './components/Generator';
import { Docs } from './components/Docs';
import { TerminalCLI } from './components/TerminalCLI';
import { ThreatBriefing } from './components/ThreatBriefing';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  ShieldAlert, 
  BadgeInfo, 
  Rocket, 
  CheckCircle2, 
  Lock, 
  Laptop, 
  ExternalLink, 
  Zap,
  GitBranch,
  ShieldCheck,
  Code,
  Terminal,
  Github
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'docs'>('generator');
  
  // Force page scroll to start at the top on mount and reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-zinc-850 flex flex-col selection:bg-[#ff751f]/10 selection:text-brand relative overflow-x-hidden">
      
      {/* Dynamic Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand via-amber-500 to-amber-200 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />
      
      {/* Sleek top-level thin status line */}
      <div className="w-full h-1 bg-gradient-to-r from-brand via-amber-500 to-amber-200 relative z-20" />

      {/* Top Navbar in Eden's minimalist signature white/zinc style */}
      <nav className="w-full border-b border-zinc-200/70 bg-white/95 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm font-bold tracking-tight text-zinc-900 font-sans">
              <span className="text-brand mr-0.5">.</span>dot Guard
              <span className="ml-2.5 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-750 bg-emerald-500/10 border border-emerald-550/20 rounded">
                v1.2 Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://pypi.org/project/dotguard"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <Code className="h-3.5 w-3.5" />
              <span>PyPI Release</span>
            </a>
            <a
              href="https://github.com/pychris1/dotguard"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub Repo</span>
            </a>
            <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block" />
            
            {/* Minimal light pill tab bar matching Eden.so toggle bar */}
            <div className="flex bg-zinc-100 border border-zinc-200/80 p-0.5 rounded-lg select-none">
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'generator'
                    ? 'bg-white text-zinc-900 font-bold border border-zinc-205 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Laptop className="h-3.5 w-3.5" />
                <span>Init Generator</span>
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'docs'
                    ? 'bg-white text-zinc-900 font-bold border border-zinc-205 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <BadgeInfo className="h-3.5 w-3.5" />
                <span>Setup & CLI</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Body Content with generous spacing and structured white cards */}
      <main id="applet-main-layout" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-16">
        
        {/* Hero Concept Section - Strict, Minimalist, Elegant with animation */}
        <motion.header 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center space-y-5 max-w-3xl mx-auto pt-2"
        >
          
          {/* Full-size Logo (Borderless, 200% larger, rounded edges) */}
          <div className="flex items-center justify-center h-48 w-48 md:h-56 md:w-56 rounded-[2.5rem] overflow-hidden hover:scale-105 transition-transform duration-300 select-none shrink-0 mb-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-white/50">
            <img 
              src="/logo/logo.png" 
              alt=".dot Guard" 
              className="h-full w-full object-cover animate-fade-in rounded-[2.5rem]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Tech Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-202 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-650 font-semibold">Zero-Config Dotenv Validation Tool</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 font-sans">
            Validate configs before <br className="hidden sm:inline" />
            they break production.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-sans max-w-xl font-light leading-relaxed">
            Validate local <code className="text-brand bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-sm font-semibold">.env</code> registers against templates side-by-side. Halt invalid commits, prevent secret leaks, and synchronize systems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="text-[11px] text-zinc-600 font-mono inline-flex items-center gap-1.5 bg-zinc-100/50 px-3 py-1 rounded-lg border border-zinc-200/60 shadow-sm">
              <Lock className="h-3.5 w-3.5 text-brand" />
              <span>Zero external pings or cloud leaks</span>
            </span>
            <span className="text-[11px] text-zinc-600 font-mono inline-flex items-center gap-1.5 bg-zinc-100/50 px-3 py-1 rounded-lg border border-zinc-200/60 shadow-sm">
              <Terminal className="h-3.5 w-3.5 text-amber-600" />
              <span>Local hook automation</span>
            </span>
          </div>
        </motion.header>

        {/* Tab Selection Navbar inside a crisp box element with animation */}
        <motion.section 
          id="navigation-panels"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="max-w-2xl mx-auto w-full"
        >
          <div className="grid grid-cols-2 border border-zinc-200/80 p-1 rounded-xl bg-zinc-100/60 backdrop-blur shadow-sm">
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition duration-250 cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-white text-zinc-900 border border-zinc-200 shadow-sm font-bold'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span>Interactive Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition duration-250 cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white text-zinc-900 border border-zinc-200 shadow-sm font-bold'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <BadgeInfo className="h-4 w-4" />
              <span>Local Setup Instructions</span>
            </button>
          </div>
        </motion.section>

        {/* Active Tab View wrapper - High-Contrast Matte White Panel with animation */}
        <motion.section 
          id="active-panel-view" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] min-h-[400px]"
        >
          {activeTab === 'generator' && <Generator />}
          {activeTab === 'docs' && <Docs />}
        </motion.section>

        {/* Interactive CLI Live Preview Terminal - Sandbox playground */}
        <motion.section 
          id="immersive-terminal-sandbox" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
        >
          <TerminalCLI />
        </motion.section>

        {/* Real-World Threat Research Briefing on exposed .env files */}
        <motion.section 
          id="research-threat-briefing" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
        >
          <ThreatBriefing />
        </motion.section>

        {/* Quick Start Guide Section with crisp light terminal visualizer & scroll motion */}
        <motion.section 
          id="quick-start-guide" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pt-12 border-t border-zinc-200"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-brand uppercase font-bold">Onboarding Guide</span>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Lightning Quick Onboarding</h2>
            <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
              Install the dotguard engine and establish bulletproof verification in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Steps Column */}
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="h-7 w-7 rounded bg-brand/5 border border-brand/15 flex items-center justify-center shrink-0 font-bold text-brand text-xs font-mono">
                  01
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 font-sans">Install global system binary</h4>
                  <p className="text-[11px] text-zinc-505 leading-relaxed">Fetch the latest safe verified release via the Python package index indexer.</p>
                  <div className="mt-2.5 p-3 bg-[#fafbfc] border border-zinc-200 rounded-lg font-mono text-xs text-zinc-700 flex items-center justify-between shadow-sm">
                    <span className="text-brand font-semibold">pip install dotguard</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-205 font-sans font-semibold">CLI</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="h-7 w-7 rounded bg-brand/5 border border-brand/15 flex items-center justify-center shrink-0 font-bold text-brand text-xs font-mono">
                  02
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 font-sans">Compare parameters side-by-side</h4>
                  <p className="text-[11px] text-zinc-505 leading-relaxed font-sans">Create a secure local file and a public template schema in your root checkout directory:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
                    <div className="p-2.5 bg-white border border-zinc-200 rounded-lg text-[9.5px] text-zinc-600 leading-relaxed shadow-sm">
                      <span className="text-zinc-900 font-bold block mb-1 border-b border-zinc-100 pb-0.5 font-sans">.env (Local private)</span>
                      DATABASE_URL="postgresql://localhost"<br />
                      PORT=3000<br />
                      AWS_TOKEN="sec_definitely_123"
                    </div>
                    <div className="p-2.5 bg-white border border-zinc-200 rounded-lg text-[9.5px] text-zinc-600 leading-relaxed shadow-sm">
                      <span className="text-zinc-900 font-bold block mb-1 border-b border-zinc-100 pb-0.5 font-sans">.env.example (Tracked public)</span>
                      DATABASE_URL=<br />
                      PORT=3000<br />
                      AWS_TOKEN=
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="h-7 w-7 rounded bg-brand/5 border border-brand/15 flex items-center justify-center shrink-0 font-bold text-brand text-xs font-mono">
                  03
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-900">Run manual audit trigger</h4>
                  <p className="text-[11px] text-zinc-505 leading-relaxed">Test local registers and enforce template checks using command terminal flags.</p>
                  <div className="mt-2.5 p-3 bg-[#fafbfc] border border-zinc-200 rounded-lg font-mono text-xs text-zinc-700 flex items-center justify-between shadow-sm">
                    <span className="text-brand font-semibold">dotguard --strict</span>
                    <span className="text-[9px] text-brand uppercase tracking-wider bg-brand/5 px-1.5 py-0.5 rounded border border-brand/15 font-sans font-bold">Audit</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Technical Terminal Block matching Eden.so theme in Light mode */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 font-mono text-[12px] text-zinc-700 space-y-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div>
                <div className="border-b border-zinc-100 pb-2.5 flex items-center gap-2 select-none">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400">Standard Terminal Exit</span>
                </div>

                <div className="space-y-2 bg-[#fbfbfc] p-4 rounded-lg border border-zinc-200 text-xs mt-3 select-all leading-relaxed font-mono text-zinc-800">
                  <p className="text-zinc-405">$ dotguard --strict</p>
                  <p className="text-brand font-medium">🔍 Scanning environment registers...</p>
                  <p className="text-zinc-500">[info] Checked .gitignore tracking exclusions.</p>
                  <p className="text-emerald-600 font-semibold">[PASS] DATABASE_URL matches designated templates.</p>
                  <p className="text-emerald-600 font-semibold">[PASS] PORT template defaults validated.</p>
                  <p className="text-emerald-600 font-semibold">[PASS] AWS_TOKEN checked clean of draft values.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 text-emerald-600 font-bold flex items-center gap-2 text-[11px] font-mono select-none">
                <span>Verification Terminated Successfully (exit_code=0)</span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Real-World Use Cases Section inside Bento structure with scroll motion */}
        <motion.section 
          id="real-world-use-cases" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pt-12 border-t border-zinc-200"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-brand uppercase font-bold">Security Scenarios</span>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Enterprise Defensive Cases</h2>
            <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
              Discover how integrating dotguard blocks leaks and synchronizes teams effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-sans">
            
            {/* Scenario 1 */}
            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 flex flex-col justify-between hover:border-zinc-300 transition shadow-sm">
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono font-bold text-rose-600 uppercase tracking-widest bg-rose-500/5 py-0.5 px-2 rounded-full inline-block border border-rose-500/10">
                  Leak Prevention
                </span>
                <h4 className="text-sm font-bold text-zinc-900">Accidental Boilerplate Deploys</h4>
                <p className="text-xs text-zinc-550 leading-relaxed">
                  Avoid shipping raw scaffolding values like <code className="bg-zinc-50 text-brand px-1 py-0.5 rounded border border-zinc-200 text-[10px] font-semibold">GEMINI_API_KEY="insert-secret-here"</code>. Dotguard flags placeholders and enforces code status checkouts before deploy scripts initiate.
                </p>
              </div>
              <div className="pt-2.5 border-t border-zinc-100 text-[11px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-brand" />
                <span>Halt pipeline compilations</span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 flex flex-col justify-between hover:border-zinc-300 transition shadow-sm">
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono font-semibold text-amber-600 uppercase tracking-widest bg-amber-500/5 py-0.5 px-2 rounded-full inline-block border border-amber-500/10">
                  Git Exposure Checked
                </span>
                <h4 className="text-sm font-bold text-zinc-900 font-sans">Git Staging Exclusions</h4>
                <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                  Accidental commands like <code className="bg-zinc-50 text-brand px-1 py-0.5 rounded border border-zinc-200 text-[10px] font-semibold">git add .</code> can accidentally stage real local keys to cloud hosts. Dotguard checks directory caches and blocks commits from staging.
                </p>
              </div>
              <div className="pt-2.5 border-t border-zinc-100 text-[11px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5">
                <GitBranch className="h-3 w-3 text-amber-500" />
                <span>Halts commits in precommit</span>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 flex flex-col justify-between hover:border-zinc-300 transition shadow-sm">
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-555/10 py-0.5 px-2 rounded-full inline-block border border-emerald-500/10">
                  Desync Alerts
                </span>
                <h4 className="text-sm font-bold text-zinc-900">Team Coordinate Drift</h4>
                <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                  Ensure teammates don't push fresh environment features without updating the shared <code className="bg-zinc-50 text-brand px-1 py-0.5 rounded border border-zinc-200 text-[10px] font-semibold">.env.example</code> file. Dotguard forces synchronization across environments.
                </p>
              </div>
              <div className="pt-2.5 border-t border-zinc-100 text-[11px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-650" />
                <span>Maintains uniform keys map</span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Feature Grid Highlights with scroll motion */}
        <motion.section 
          id="features-highlights" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pt-12 border-t border-zinc-200"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-brand uppercase font-bold">Defensive Architecture</span>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Engine Capabilities</h2>
            <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans">
              Reliable, ultra-fast environment verification tailored for elite workflows and modern stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            
            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 hover:border-zinc-300 transition shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-50 text-brand border border-zinc-200 flex items-center justify-center">
                <Rocket className="h-4.5 w-4.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 font-sans">Deploy Gateways</h4>
              <p className="text-xs text-zinc-505 leading-relaxed font-sans">
                Assert that your checkout assets contain every designated template variables. Block broken builds prior to execution.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 hover:border-zinc-300 transition shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-50 text-rose-500 border border-zinc-200 flex items-center justify-center">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 font-sans">Sensitive Scrubber</h4>
              <p className="text-xs text-zinc-505 leading-relaxed font-sans">
                Find placeholder configurations instantly. Block sensitive API secrets from flowing through clear system logging.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 hover:border-zinc-300 transition shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-zinc-50 text-emerald-600 border border-zinc-200 flex items-center justify-center">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 font-sans">Staging Warnings</h4>
              <p className="text-xs text-zinc-505 leading-relaxed font-sans">
                Instantly scan directory git records and raise fatal warning errors if tracking rules are bypassed.
              </p>
            </div>

          </div>
        </motion.section>

      </main>

      {/* Structured Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 my-0 py-8 relative z-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-brand font-bold">.</span>
            <span className="font-bold text-zinc-750 tracking-tight">dotguard</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span>MIT License</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400 hidden sm:inline">Catching environment mistakes before they deploy.</span>
            <a
              href="https://pypi.org/project/dotguard"
              target="_blank"
              rel="noreferrer noopener"
              className="text-zinc-600 hover:text-brand inline-flex items-center gap-1 font-semibold hover:underline transition-colors cursor-pointer"
            >
              <span>PyPI Package</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-zinc-300">|</span>
            <a
              href="https://github.com/pychris1/dotguard"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand hover:text-brand-dark inline-flex items-center gap-1 font-semibold hover:underline transition-colors cursor-pointer"
            >
              <Github className="h-3 w-3" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
