/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Download, Terminal, Settings, Copy, Check, GitCommit, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export function Docs() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedPreCommit, setCopiedPreCommit] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const copyInstall = () => {
    navigator.clipboard.writeText('pip install dotguard');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const copyPreCommitCode = () => {
    const yaml = `# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: dotguard
        name: dotguard dotenv validation
        entry: dotguard --strict --no-extras
        language: system
        files: ^(\\.env|\\.env\\.example)$
        pass_filenames: false
`;
    navigator.clipboard.writeText(yaml);
    setCopiedPreCommit(true);
    setTimeout(() => setCopiedPreCommit(false), 2000);
  };

  const FAQs = [
    {
      q: 'Why should I integrate dotguard instead of manual scanning?',
      a: 'Manual dotenv scanning relies on human memory, which fails as teams scale. With AI generators generating mock variables every day, developers frequently commit placeholder variables (like "your_secret_key" or "MY_API_KEY") to production or write drift settings without updating example sheets. Dotguard acts as a fully-automation-ready compiler validation step.'
    },
    {
      q: 'How does dotguard verify that .env files are tracked in Git?',
      a: 'Behind the scenes, dotguard inspects the local directory status via git command queries. If .env is staged, cached, or tracked under version registry, it throws a severe ERROR exit. In our playground above, you can simulate this git environment warning check.'
    },
    {
      q: 'Which variables are identified as sensitive keys?',
      a: 'Keys carrying signatures like key substrings, security identifiers, API credentials, or credentials tokens (e.g. PASS, TOKEN, API, SECRET, PWD, DB_URL, JWT, SIGNATURE, CREDENTIAL) are scanned under high-priority sensitivity rules.'
    },
    {
      q: 'How should I run this within my GitHub Actions pipeline?',
      a: 'Since GitHub Actions run inside isolated virtual containers, they do not hold local .env files. However, you can run dotguard as an automatic validation step to assert that any committed environment template matches correctly. Example: Add `run: pip install dotguard && dotguard --strict` into your deploy checkout script!'
    }
  ];

  return (
    <div id="docs-tab" className="space-y-8 animate-fade-in text-zinc-700">
      
      {/* Installation block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-zinc-200 pb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center space-x-2.5">
            <Download className="h-5 w-5 text-brand" />
            <span>Install & CLI Setup</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Dotguard is a lightweight CLI utility available through the python package index. You can deploy it locally or install it globally to bind automatically into deployment loops.
          </p>
        </div>

        <div className="flex flex-col space-y-2 font-sans">
          <div className="relative rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm overflow-hidden flex items-center justify-between select-all group shadow-sm">
            <div className="flex items-center space-x-2 text-brand">
              <span className="text-zinc-400 font-bold select-none">$</span>
              <span className="text-zinc-800 select-all font-semibold font-mono">pip install dotguard</span>
            </div>
            <button
              onClick={copyInstall}
              className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer shadow-sm"
            >
              {copiedInstall ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-right pr-2">System requirements: Python 3.8+ or higher</span>
        </div>
      </div>

      {/* Usage reference grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Commands library */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-450 flex items-center space-x-2">
            <Terminal className="h-4.5 w-4.5 text-brand" />
            <span>CLI Commands Manual</span>
          </h3>

          <div className="space-y-3">
            {[
              { cmd: 'dotguard', desc: 'Default validation. Scans .env against .env.example' },
              { cmd: 'dotguard --strict', desc: 'Treats all warnings as fatal errors (Exits with code 1 on warn)' },
              { cmd: 'dotguard --no-extras', desc: 'Treats stray keys existing in .env but absent from template as errors' },
              { cmd: 'dotguard --no-git-check', desc: 'Ignores testing if .env files are tracked or exposed in Git caches' },
              { cmd: 'dotguard --quiet', desc: 'Suppresses system print messages. Exit code reporting status only' },
              { cmd: 'dotguard init', desc: 'Scrubs private tokens and outputs an automatic .env.example blueprint' },
              { cmd: 'dotguard init --force', desc: 'Forces overwriting of the existing .env.example with newly compiled variables' },
             ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-50/80 border border-zinc-200/80 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-sm">
                <span className="text-brand font-bold shrink-0 select-all font-mono">{item.cmd}</span>
                <span className="text-zinc-550 font-sans md:text-right text-[11px] font-medium">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exit codes info card */}
        <div id="exit-codes-guide" className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-455 flex items-center space-x-2">
              <Settings className="h-4.5 w-4.5 text-amber-600" />
              <span>Standard Exit Codes</span>
            </h3>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 text-zinc-550 border-b border-zinc-200 uppercase tracking-widest text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5 pl-4">Exit Code</th>
                    <th className="p-3.5">Meaning / Outcome</th>
                    <th className="p-3.5 pr-4 text-right">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr>
                    <td className="p-3.5 pl-4 font-bold text-emerald-600 bg-emerald-500/5">0</td>
                    <td className="p-3.5 font-medium">All Checks Passed</td>
                    <td className="p-3.5 pr-4 text-right text-zinc-500 text-[11px]">Valid setups without active schema errors</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-4 font-bold text-rose-600 bg-rose-500/5">1</td>
                    <td className="p-3.5 font-medium">Errors Flagged</td>
                    <td className="p-3.5 pr-4 text-right text-zinc-500 text-[11px]">One or more errors (or strict mode warnings)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-4 font-bold text-amber-600 bg-amber-500/5">2</td>
                    <td className="p-3.5 font-medium">File not found</td>
                    <td className="p-3.5 pr-4 text-right text-zinc-500 text-[11px]">Missing .env or .env.example files</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pre-commit automation hooks banner */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/55 p-4 space-y-3 mt-4 shadow-sm">
            <div className="flex items-center justify-between font-sans">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center space-x-2 select-none">
                <GitCommit className="h-4 w-4 text-brand" />
                <span>Pre-commit Integration</span>
              </span>
              <button
                onClick={copyPreCommitCode}
                className="text-[11px] font-mono font-bold text-brand hover:text-brand-hover bg-white px-2.5 py-1 rounded-lg cursor-pointer border border-zinc-200 shadow-sm"
              >
                {copiedPreCommit ? <span>Copied Hook</span> : <span>Copy YAML</span>}
              </button>
            </div>
            <p className="text-[11px] text-zinc-550 leading-normal font-sans">
              Block broken deploys by adding dotguard straight into your pre-commit hooks! It blocks the git commit step if anyone leaks credentials or drifts settings.
            </p>
          </div>

        </div>

      </div>

      {/* Accordion FAQ block */}
      <div className="space-y-4 pt-4 border-t border-zinc-200">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-450 flex items-center space-x-2 font-sans select-none">
          <FileText className="h-4.5 w-4.5 text-brand" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {FAQs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-zinc-50/50 hover:bg-zinc-100/50 text-left transition font-sans cursor-pointer focus:outline-none border-0"
                >
                  <span className="text-sm font-bold text-zinc-800 font-sans">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-zinc-550 leading-relaxed border-t border-zinc-100 font-sans transition-all">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
