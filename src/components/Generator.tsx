/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { generateExampleFromEnv } from '../utils';
import { FileCode, Sparkles, Copy, Check, Download, Info, ShieldAlert } from 'lucide-react';

export function Generator() {
  const [sourceEnv, setSourceEnv] = useState<string>(`# Your real local .env configuration
PORT=8080
NODE_ENV=development
DATABASE_URL="postgresql://user:p4ssw0rd@localhost:5432/myproject"
GEMINI_API_KEY="sk_gemini_some_very_long_secret_123_abc_xyz"
JWT_SECRET_KEY="temporary-secret-token"
LOG_LEVEL=info
ENABLE_ANALYTICS=true
`);
  const [copied, setCopied] = useState(false);

  const generated = generateExampleFromEnv(sourceEnv);

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generated], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = ".env.example";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="generator-tab" className="space-y-6 animate-fade-in text-zinc-700">
      <div className="border-b border-zinc-200 pb-6">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <span>Blueprint Generator (<code className="text-xs bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-amber-700 font-bold font-mono">dotguard init</code>)</span>
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Scrub away real secrets from your local <code className="text-xs font-mono font-semibold">.env</code> and instantly generate an anonymized, production-safe <code className="text-xs font-mono font-semibold">.env.example</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Column */}
        <div id="input-env-panel" className="flex flex-col space-y-4 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-450 select-none">Paste your private config:</span>
            <span className="text-[10px] font-mono font-bold select-none text-rose-750 bg-rose-50 px-2 py-0.5 border border-rose-100 rounded-full flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-550" />
              <span>Contains sensitive credentials</span>
            </span>
          </div>

          <div className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/50 overflow-hidden shadow-sm">
            <div className="flex items-center space-x-2 bg-zinc-100/80 px-4 py-2.5 border-b border-zinc-200/90 select-none">
              <FileCode className="h-4 w-4 text-brand font-semibold" />
              <span className="text-xs font-bold font-mono text-zinc-705 font-sans">.env (Local Source)</span>
            </div>
            <textarea
              value={sourceEnv}
              onChange={(e) => setSourceEnv(e.target.value)}
              placeholder="# Paste your raw local secrets here&#10;PORT=3000&#10;DATABASE_URL=mongodb://localhost"
              className="w-full h-85 font-mono text-xs p-4 bg-white text-zinc-805 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand resize-none leading-relaxed border-0"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output Column */}
        <div id="output-example-panel" className="flex flex-col space-y-4">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-455 select-none">Anonymized result blueprint:</span>
            <div className="flex items-center gap-2 select-none">
              <button
                onClick={handleCopy}
                disabled={!generated}
                className="flex items-center space-x-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs px-2.5 py-1 text-zinc-700 hover:text-zinc-900 font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!generated}
                className="flex items-center space-x-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs px-2.5 py-1 text-zinc-700 hover:text-zinc-900 font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save file</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/50 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between bg-zinc-100/80 px-4 py-2.5 border-b border-zinc-200/90 select-none">
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold font-mono text-zinc-705">.env.example (Squeaky Clean)</span>
              </div>
              <span className="text-[10px] font-mono font-bold select-none text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Auto-Scrubbed Code
              </span>
            </div>
            <textarea
              readOnly
              value={generated}
              placeholder="# Generated blueprint is empty"
              className="w-full h-85 font-mono text-xs p-4 bg-white text-amber-700 focus:outline-none resize-none leading-relaxed select-all cursor-text border-0 font-medium"
              spellCheck={false}
            />
          </div>
        </div>

      </div>

      {/* Warning descriptive banner */}
      <div className="mt-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 flex items-start space-x-3 shadow-sm select-none">
        <Info className="h-5 w-5 text-brand mt-0.5 shrink-0" />
        <div className="text-xs leading-normal space-y-1.5 font-sans">
          <p>
            <strong>How the scrubbing works:</strong> Dotguard analyzes each variable name. If the variable name indicates a sensitive API key, password, secret, or token (contains words like <code className="text-brand bg-zinc-100 border border-zinc-200/80 px-1 rounded font-bold">SECRET</code>, <code className="text-brand bg-zinc-100 border border-zinc-200/80 px-1 rounded font-bold font-mono">PASS</code>, <code className="text-brand bg-zinc-100 border border-zinc-200/80 px-1 rounded font-bold font-mono">KEY</code>, etc.), it replaces the value with <span className="text-amber-600 font-bold font-mono">"YOUR_VARIABLE_NAME"</span>.
          </p>
          <p>
            Standard configuration options (e.g. ports, environment flags like <code className="text-amber-600 font-mono font-bold">NODE_ENV</code>, <code className="text-amber-600 font-mono font-bold">DEBUG</code>, and standard ports) are safely kept as default recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
