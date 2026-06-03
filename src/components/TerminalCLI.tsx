/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Trash2, 
  Play, 
  Settings, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  Info,
  CheckCircle2,
  ListRestart,
  Check,
  Copy
} from 'lucide-react';

interface LogLine {
  text: string;
  type: 'input' | 'system' | 'info' | 'pass' | 'warn' | 'fail' | 'success' | 'headline';
  delay?: number;
}

interface EnvPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  dotEnv: string;
  dotEnvExample: string;
  description: string;
}

const PRESETS: EnvPreset[] = [
  {
    id: 'clean',
    name: 'Squeaky Clean (Pass)',
    badge: 'Healthy State',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-100/50',
    description: 'Perfect configuration mapping. No placeholder values, no missing keys in either direction.',
    dotEnv: `# .env - Production-ready
PORT=8080
NODE_ENV=production
DATABASE_URL="postgresql://db_user:secure_pwd_100@db-host:5432/main_db"
GEMINI_API_KEY="AIzaSyA_example_982bZlXy"
JWT_SECRET="xZ89!Lp#4Ws2_vT"`,
    dotEnvExample: `# .env.example - Public Blueprint
PORT=
NODE_ENV=
DATABASE_URL=
GEMINI_API_KEY=
JWT_SECRET=`
  },
  {
    id: 'leaked',
    name: 'Placeholder Leaks (Fail Strict)',
    badge: 'Vulnerabilities',
    badgeColor: 'text-rose-700',
    badgeBg: 'bg-rose-50 border-rose-100/50',
    description: 'Contains sensitive variables carrying placeholder strings like "MY_GEMINI_API_KEY" or left default in git staging.',
    dotEnv: `# .env - Dangerous leak!
PORT=3000
NODE_ENV=development
DATABASE_URL="mongodb://localhost:27017"
# Uh oh! Left with placeholder values
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"`,
    dotEnvExample: `# .env.example - Public Blueprint
PORT=3000
NODE_ENV=
DATABASE_URL=
GEMINI_API_KEY=
APP_URL=`
  },
  {
    id: 'drifting',
    name: 'Drifting Keys (Fail No-Extras)',
    badge: 'Out of Sync',
    badgeColor: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-100/50',
    description: 'Developer introduced local overrides but forgot to synchronized the shared public template schema.',
    dotEnv: `# .env - Local drifting variables
PORT=8080
DATABASE_URL="postgresql://localhost"
# Forgot to sync these to example template!
STRIPE_SECRET_KEY="sk_test_123"
LOCAL_TEST_OVERRIDE="true"`,
    dotEnvExample: `# .env.example - Public Blueprint
PORT=8080
DATABASE_URL=`
  }
];

const SUGGESTIONS = [
  'dotguard',
  'dotguard --strict',
  'dotguard --no-extras',
  'dotguard --no-git-check',
  'dotguard init',
  'dotguard --help',
  'clear'
];

export function TerminalCLI() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('clean');
  const [inputCommand, setInputCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<LogLine[]>([
    { text: 'Dotguard Interactive Shell [Version 1.2.4]', type: 'headline' },
    { text: 'Type "dotguard --help" or click suggestions to test validations.', type: 'info' },
    { text: '', type: 'system' }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);
  const [copiedExample, setCopiedExample] = useState<boolean>(false);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLogs, isTyping]);

  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add running log
    setTerminalLogs(prev => [...prev, { text: `~$ ${trimmed}`, type: 'input' }]);
    setInputCommand('');
    setIsTyping(true);

    const history = [...commandHistory, trimmed];
    setCommandHistory(history);
    setHistoryIndex(-1);

    // Simulated short delay before executing command
    await new Promise(resolve => setTimeout(resolve, 300));

    // Evaluate response based on command
    const args = trimmed.split(/\s+/);
    const primary = args[0];

    if (primary !== 'dotguard' && primary !== 'clear') {
      setTerminalLogs(prev => [
        ...prev,
        { text: `bash: command not found: ${primary}`, type: 'fail' },
        { text: 'Supported commands: dotguard, clear', type: 'info' }
      ]);
      setIsTyping(false);
      return;
    }

    if (primary === 'clear') {
      setTerminalLogs([]);
      setIsTyping(false);
      return;
    }

    // It is dotguard! Let's analyze flags
    const isStrict = args.includes('--strict');
    const isNoExtras = args.includes('--no-extras');
    const isNoGitCheck = args.includes('--no-git-check');
    const isInit = args.includes('init');
    const isHelp = args.includes('--help') || args.includes('-h') || args.length === 1 && args[0] === 'help';

    if (isHelp) {
      setTerminalLogs(prev => [
        ...prev,
        { text: 'dotguard - Safe Zero-Config Dotenv Validation Tool', type: 'headline' },
        { text: 'Usage: dotguard [options] [command]', type: 'system' },
        { text: '', type: 'system' },
        { text: 'Options:', type: 'system' },
        { text: '  -h, --help       Show help text & operational guidelines', type: 'info' },
        { text: '  --strict         Treat warning alerts as critical building errors (exits with code 1)', type: 'info' },
        { text: '  --no-extras      Force check on extraneous variables unmentioned in blueprint', type: 'info' },
        { text: '  --no-git-check   Do not verify if .env files are accidentally staged or tracked', type: 'info' },
        { text: '', type: 'system' },
        { text: 'Commands:', type: 'system' },
        { text: '  init             Scrub clear secrets from active .env and output an anonymized .env.example', type: 'info' }
      ]);
      setIsTyping(false);
      return;
    }

    if (isInit) {
      // Simulate scrub process
      setTerminalLogs(prev => [
        ...prev,
        { text: '🔄  Initializing environment template generator...', type: 'info' },
        { text: '[step] Analyzing local parameters inside .env...', type: 'system' }
      ]);
      await new Promise(r => setTimeout(r, 600));

      const keysScrubbed = activePreset.dotEnv
        .split('\n')
        .filter(l => l.trim() && !l.trim().startsWith('#'))
        .map(l => l.split('=')[0]);

      setTerminalLogs(prev => [
        ...prev,
        { text: `[step] Identified ${keysScrubbed.length} fields to process.`, type: 'system' },
        { text: '🧹  Scrubbing token values and removing private signatures...', type: 'system' }
      ]);
      await new Promise(r => setTimeout(r, 700));

      setTerminalLogs(prev => [
        ...prev,
        { text: '✨  Successfully created anonymized template file: .env.example', type: 'success' },
        { text: '💾  Written clean values without leaking secrets (Exit Code = 0)', type: 'pass' }
      ]);
      setIsTyping(false);
      return;
    }

    // Core validator simulation based on preset
    setTerminalLogs(prev => [
      ...prev,
      { text: '🔍  Scanning environment registers...', type: 'info' }
    ]);
    await new Promise(r => setTimeout(r, 450));

    // Git tracking check
    if (!isNoGitCheck) {
      setTerminalLogs(prev => [...prev, { text: '[info] Checking repository staging exclusion indexes...', type: 'system' }]);
      await new Promise(r => setTimeout(r, 400));
      if (selectedPresetId === 'leaked') {
        setTerminalLogs(prev => [
          ...prev, 
          { text: '💥  WARNING: .env is currently staged in git indexes! This can lead to secret exposure on commits.', type: 'warn' }
        ]);
      } else {
        setTerminalLogs(prev => [...prev, { text: '✓  Git index checked: Local .env matches exclusion parameters.', type: 'pass' }]);
      }
    } else {
      setTerminalLogs(prev => [...prev, { text: '[info] Skipping repository staging check (--no-git-check).', type: 'system' }]);
    }
    await new Promise(r => setTimeout(r, 350));

    // Parse keys and compare values
    const dotEnvLines = activePreset.dotEnv.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const exampleLines = activePreset.dotEnvExample.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));

    const envMap = new Map<string, string>();
    dotEnvLines.forEach(line => {
      const idx = line.indexOf('=');
      if (idx !== -1) {
        envMap.set(line.substring(0, idx).trim(), line.substring(idx + 1).trim());
      }
    });

    const exampleMap = new Map<string, string>();
    exampleLines.forEach(line => {
      const idx = line.indexOf('=');
      if (idx !== -1) {
        exampleMap.set(line.substring(0, idx).trim(), line.substring(idx + 1).trim());
      }
    });

    let hasErrors = false;
    let hasWarnings = false;

    // Verify key presence
    setTerminalLogs(prev => [...prev, { text: '[info] Verifying configuration mappings...', type: 'system' }]);
    await new Promise(r => setTimeout(r, 300));

    // 1. Check for leaking placeholders (where value in local includes generic keys instead of actual values)
    for (const [key, val] of envMap.entries()) {
      const cleanVal = val.replace(/['"]/g, '');
      if (cleanVal === 'MY_GEMINI_API_KEY' || cleanVal === 'MY_APP_URL' || cleanVal === 'change_me') {
        const msg = `FAIL: Field ${key} uses a template placeholder string ("${cleanVal}")`;
        if (isStrict) {
          setTerminalLogs(prev => [...prev, { text: `[CRITICAL_FAIL] ${msg}`, type: 'fail' }]);
          hasErrors = true;
        } else {
          setTerminalLogs(prev => [...prev, { text: `[ALERT_WARN] ${msg}`, type: 'warn' }]);
          hasWarnings = true;
        }
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // 2. Extraneous check
    for (const key of envMap.keys()) {
      if (!exampleMap.has(key)) {
        if (isNoExtras) {
          setTerminalLogs(prev => [
            ...prev,
            { text: `[CRITICAL_FAIL] Extraneous parameter: "${key}" exists locally but matches nothing in template`, type: 'fail' }
          ]);
          hasErrors = true;
        } else {
          setTerminalLogs(prev => [
            ...prev,
            { text: `[ALERT_WARN] Drift variable detected: "${key}" lacks template pairing`, type: 'warn' }
          ]);
          hasWarnings = true;
        }
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // 3. Normal passes
    for (const key of envMap.keys()) {
      const isLeakedKey = (key === 'GEMINI_API_KEY' || key === 'APP_URL') && selectedPresetId === 'leaked';
      const isExtraKey = !exampleMap.has(key);

      if (!isLeakedKey && !isExtraKey) {
        setTerminalLogs(prev => [...prev, { text: `✓  [PASS] Mapping defined for key: "${key}"`, type: 'pass' }]);
        await new Promise(r => setTimeout(r, 100));
      }
    }

    await new Promise(r => setTimeout(r, 400));

    if (hasErrors) {
      setTerminalLogs(prev => [
        ...prev,
        { text: '❌  FATAL: Build-gate checks failed. Fix files to prevent deploy breaks.', type: 'fail' },
        { text: 'Verification Terminated Failsafe (Exit Code = 1)', type: 'fail' }
      ]);
    } else if (hasWarnings && isStrict) {
      setTerminalLogs(prev => [
        ...prev,
        { text: '❌  FATAL: Active warnings flagged as critical failures under --strict flag.', type: 'fail' },
        { text: 'Verification Terminated Failsafe (Exit Code = 1)', type: 'fail' }
      ]);
    } else if (hasWarnings) {
      setTerminalLogs(prev => [
        ...prev,
        { text: '⚠️  Validation complete with alerts. Check git exceptions or staging drift.', type: 'warn' },
        { text: 'Verification Terminated Clean (Exit Code = 0)', type: 'warn' }
      ]);
    } else {
      setTerminalLogs(prev => [
        ...prev,
        { text: '💚  Verification clean - Environment verified completely out of danger zone.', type: 'success' },
        { text: 'Verification Terminated Successful (Exit Code = 0)', type: 'success' }
      ]);
    }

    setIsTyping(false);
  };

  const handleSuggestionClick = (cmd: string) => {
    if (isTyping) return;
    executeCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputCommand.trim() && !isTyping) {
        executeCommand(inputCommand);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputCommand('');
        } else {
          setHistoryIndex(newIndex);
          setInputCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const autofillCommand = (cmd: string) => {
    setInputCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div id="cli-terminal-section" className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-brand uppercase font-bold">Interactive Sandbox</span>
          <h3 className="text-xl font-bold text-zinc-900 flex items-center space-x-2 mt-0.5">
            <Terminal className="h-5 w-5 text-zinc-800" />
            <span>Interactive CLI Validator Preview</span>
          </h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Simulate the local Python command-line compiler on different mock environment configurations. Select a scenario preset below and type commands to see safety checks in play.
          </p>
        </div>

        {/* Clear/Reset command history */}
        <button
          onClick={() => {
            setTerminalLogs([
              { text: 'Dotguard Interactive Shell [Version 1.2.4]', type: 'headline' },
              { text: 'Type "dotguard --help" or click suggestions to test validations.', type: 'info' }
            ]);
            setCommandHistory([]);
            setHistoryIndex(-1);
          }}
          className="self-start px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs text-zinc-650 hover:text-zinc-900 font-medium transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <ListRestart className="h-3.5 w-3.5 text-zinc-500" />
          <span>Reset Console</span>
        </button>
      </div>

      {/* Preset selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                // Clear state slightly to show active changes
                setTerminalLogs(prev => [
                  ...prev,
                  { text: `[system] Switched active workspace scenario to: "${preset.name}"`, type: 'info' }
                ]);
              }}
              className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all duration-200 shadow-sm relative overflow-hidden group cursor-pointer ${
                isSelected 
                  ? 'border-brand bg-brand/[0.01] ring-1 ring-brand/35'
                  : 'border-zinc-200/80 bg-white hover:bg-zinc-50/65'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${preset.badgeBg} ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                  
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-brand animate-ping absolute top-4 right-4" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-brand">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-sans font-normal">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11.5px] font-mono">
                <span className="text-zinc-400 font-medium font-sans">Active Variables</span>
                <span className={`${isSelected ? 'text-brand font-bold' : 'text-zinc-500 font-semibold'}`}>
                  {preset.dotEnv.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length} keys
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic code files visualization schema (4 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-450 uppercase flex items-center gap-1.5 select-none font-sans">
              <Settings className="h-3.5 w-3.5 text-zinc-500" />
              <span>Workspace Configurations</span>
            </span>
          </div>

          <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm flex flex-col divide-y divide-zinc-150">
            {/* .env visual block */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between select-none font-sans">
                <span className="text-xs font-bold font-mono text-zinc-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>.env (Secret Config)</span>
                </span>
                <button
                  onClick={() => handleCopyText(activePreset.dotEnv, setCopiedEnv)}
                  className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
                >
                  {copiedEnv ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/60 font-mono text-[10.5px] text-zinc-750 overflow-x-auto whitespace-pre leading-relaxed max-h-[140px]">
                {activePreset.dotEnv}
              </pre>
            </div>

            {/* .env.example visual block */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between select-none font-sans">
                <span className="text-xs font-bold font-mono text-zinc-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>.env.example (Public Blueprint)</span>
                </span>
                <button
                  onClick={() => handleCopyText(activePreset.dotEnvExample, setCopiedExample)}
                  className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
                >
                  {copiedExample ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/60 font-mono text-[10.5px] text-zinc-750 overflow-x-auto whitespace-pre leading-relaxed max-h-[140px]">
                {activePreset.dotEnvExample}
              </pre>
            </div>
          </div>
        </div>

        {/* Real Interactive Shell Window Terminal (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between select-none">
            <span className="text-xs font-semibold tracking-wider text-zinc-455 uppercase flex items-center gap-1.5 font-sans">
              <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              <span>Diagnostic Shell Environment</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-400">
              {isTyping ? 'Executing process...' : 'Awaiting input shell'}
            </span>
          </div>

          <div className="w-full rounded-xl border border-zinc-950/20 bg-[#121214] overflow-hidden flex flex-col h-[350px] shadow-lg">
            {/* Terminal mock navbar */}
            <div className="bg-[#1c1c1f] px-4 py-3 border-b border-zinc-800 flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f56] inline-block border border-red-900/10" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] inline-block border border-yellow-900/10" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#27c93f] inline-block border border-green-900/10" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-zinc-400">bash &bull; docguard-terminal-v1.2</span>
              <div className="w-[42px]" />
            </div>

            {/* Terminal Outputs console panels */}
            <div 
              ref={terminalBodyRef}
              className="flex-1 p-5 overflow-y-auto font-mono text-[11.5px] space-y-2 text-[#e3e3e6] scrollbar-thin leading-relaxed"
            >
              {terminalLogs.map((log, idx) => {
                let colorClass = 'text-zinc-300';
                if (log.type === 'input') colorClass = 'text-[#6ae38c] font-semibold';
                if (log.type === 'headline') colorClass = 'text-brand font-bold pb-1 text-sm border-b border-zinc-800/80 mb-2 block';
                if (log.type === 'info') colorClass = 'text-[#5bb4ff] font-medium';
                if (log.type === 'pass') colorClass = 'text-emerald-400';
                if (log.type === 'warn') colorClass = 'text-amber-400 font-medium';
                if (log.type === 'fail') colorClass = 'text-rose-400 font-bold';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-bold';
                if (log.type === 'system') colorClass = 'text-zinc-500';

                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap font-mono`}>
                    {log.text}
                  </div>
                );
              })}

              {isTyping && (
                <div className="text-zinc-400 inline-flex items-center gap-1.5 font-mono">
                  <span className="h-2 w-2 rounded-full bg-brand animate-ping inline-block shrink-0" />
                  <span className="animate-pulse">Analyzing structures, please wait...</span>
                </div>
              )}
            </div>

            {/* Terminal typing shell input line bar */}
            <div className="bg-[#17171a] px-4 py-3 border-t border-zinc-800 flex items-center space-x-2 shrink-0">
              <span className="text-[#6ae38c] font-mono font-bold select-none text-[12px]">~$</span>
              <input
                ref={inputRef}
                type="text"
                disabled={isTyping}
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type 'dotguard' or select preset suggestions..."
                className="flex-1 bg-transparent border-0 text-[#f1f1f4] focus:outline-none focus:ring-0 text-[12px] font-mono placeholder-zinc-650"
                spellCheck={false}
                autoFocus
              />
              <button
                disabled={isTyping || !inputCommand.trim()}
                onClick={() => executeCommand(inputCommand)}
                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Prompt pills bar suggestions for user convenience */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 block select-none">Quick Tap Autofills:</span>
            <div className="flex flex-wrap gap-2 select-none">
              {SUGGESTIONS.map((cmd) => (
                <button
                  key={cmd}
                  disabled={isTyping}
                  onClick={() => autofillCommand(cmd)}
                  className="px-2.5 py-1 text-[10.5px] font-mono font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-brand/50 hover:text-brand rounded-lg transition shadow-sm cursor-pointer disabled:opacity-45"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
