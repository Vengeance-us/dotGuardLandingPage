/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  Database, 
  KeyRound, 
  Mail, 
  DollarSign, 
  ExternalLink, 
  Globe, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Server
} from 'lucide-react';

export function ThreatBriefing() {
  const leaksData = [
    {
      name: 'Database Credentials',
      percentage: 42,
      severity: 'High',
      color: 'bg-rose-500',
      icon: Database,
      details: 'PostgreSQL, MySQL, and MongoDB connection strings fully exposed.'
    },
    {
      name: 'Cloud Access Keys',
      percentage: 28,
      severity: 'Critical',
      color: 'bg-red-650',
      icon: Server,
      details: 'AWS Access IDs, GCP service account files, and Azure storage tokens.'
    },
    {
      name: 'SMTP Mail Configurations',
      percentage: 18,
      severity: 'Medium',
      color: 'bg-amber-500',
      icon: Mail,
      details: 'Private mailer logins enabling unauthorized spam routing or spear phishing.'
    },
    {
      name: 'Financial & Third-Party APIs',
      percentage: 12,
      severity: 'Critical',
      color: 'bg-orange-500',
      icon: DollarSign,
      details: 'Live Stripe, PayPal, and Twilio secret keys in plain, cleartext form.'
    },
  ];

  const countriesData = [
    { country: 'United States', share: '34%', count: '4.08M files', barWidth: 'w-[85%]' },
    { country: 'Germany & France', share: '25%', count: '3.00M files', barWidth: 'w-[62%]' },
    { country: 'India', share: '18%', count: '2.16M files', barWidth: 'w-[45%]' },
    { country: 'Rest of the World', share: '23%', count: '2.76M files', barWidth: 'w-[57%]' },
  ];

  return (
    <div id="security-threat-briefing" className="space-y-8 font-sans">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#e0520b] bg-rose-500/10 px-2 py-0.5 rounded-full font-bold border border-rose-200">RESEARCH briefing</span>
            <span className="text-[10px] font-mono text-zinc-400">Published via Security Affairs</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mt-2 flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <span>The Global Dotenv Exposure Crisis: 12M+ Exposed Files</span>
          </h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            A security audit published by <strong className="text-zinc-800 font-semibold">Security Affairs</strong> detailing research from Mysterium VPN reveals a staggering count of exposed system parameters worldwide.
          </p>
        </div>

        <a
          href="https://securityaffairs.com/188590/hacking/12-million-exposed-env-files-reveal-widespread-security-failures.html"
          target="_blank"
          rel="noreferrer noopener"
          className="self-start text-[11.5px] font-semibold text-zinc-650 hover:text-brand bg-zinc-100 hover:bg-zinc-150 border border-zinc-200 px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer font-sans"
        >
          <span>Read Full Article</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Hero Stats Card Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100/75 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-rose-700 tracking-wider">Identified Leaks</span>
            <div className="text-4xl font-extrabold text-zinc-900 tracking-tight font-sans">
              12,000,000+
            </div>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              Exposed IP addresses and server nodes hosting unprotected <code className="bg-zinc-100 px-1 py-0.2 rounded font-mono text-pink-700">.env</code> registers directly in public root paths.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100/75 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-amber-700 tracking-wider">Primary Catalyst</span>
            <div className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-1.5 font-sans mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Public Directory Misconfiguration</span>
            </div>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              Serving the parent setup folder of the server configuration directory instead of narrowing access path routers specifically to a <code className="font-mono bg-zinc-100 px-1 py-0.2 text-zinc-700">/public/dist</code> asset gate.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-50 to-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-zinc-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-zinc-650 tracking-wider">Vulnerability Fix</span>
            <div className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-1.5 font-sans mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Side-by-Side Blueprinting</span>
            </div>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              Using local build linting engines like <span className="font-semibold text-brand">.dot Guard</span> to verify structure against public variables map scripts without releasing authentic keys to server systems.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        
        {/* Leaked service distributions with graphical bar maps */}
        <div className="lg:col-span-7 bg-[#fafbfc]/40 p-5 rounded-2xl border border-zinc-200/80 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Severity Breakdown</span>
            <h4 className="text-sm font-bold text-zinc-900">Distribution of Recovered Secrets</h4>
            <p className="text-xs text-zinc-500">
              The percentages of different classifications of high-target keys found active inside exposed directories.
            </p>
          </div>

          <div className="space-y-4.5 mt-5">
            {leaksData.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">
                        <IconComp className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-zinc-800">{item.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 rounded ${
                        item.severity === 'Critical' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : item.severity === 'High' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900">{item.percentage}%</span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-150 relative">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-450 leading-normal pl-7">
                    {item.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Distribution Map Box */}
        <div className="lg:col-span-5 bg-[#fafbfc]/40 p-5 rounded-2xl border border-zinc-200/80 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-405 font-bold flex items-center gap-1">
              <Globe className="h-3 w-3 text-zinc-405 animate-pulse" />
              <span>Geographic Concentrations</span>
            </span>
            <h4 className="text-sm font-bold text-zinc-900">Vulnerabilities by Location</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              The global footprint of loose development assets is widely distributed, primarily in major server hub regions.
            </p>
          </div>

          <div className="space-y-4 mt-5">
            {countriesData.map((row, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-sans">
                  <span className="font-semibold text-zinc-800">{row.country}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-zinc-400 text-[10.5px]">({row.count})</span>
                    <span className="font-extrabold text-zinc-900">{row.share}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-150">
                  <div className={`h-full rounded-full bg-zinc-750 ${row.barWidth}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Research Insight Quote Block */}
          <div className="mt-5 p-3.5 bg-white border border-zinc-200/80 rounded-xl space-y-1.5 relative shadow-sm">
            <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span>Target Exposure Trend</span>
            </div>
            <p className="text-[11px] text-zinc-650 leading-relaxed italic font-sans font-normal">
              &ldquo;Leaving .env files open publicly on misconfigured servers is equivalent to writing API tokens on your house door. Automation bots crawl IP registries continuously to harvest these.&rdquo;
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
