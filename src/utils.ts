/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Severity, ValidationCheck, ValidationResult } from './types';

/**
 * Parses raw .env / .env.example content into a key-value record.
 * Handles quotes, comments, and empty values.
 */
export function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines or comment-only lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Split by the first '=' sign
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) {
      continue; // Invalid line format
    }

    const key = trimmed.slice(0, eqIdx).trim();
    let valPart = trimmed.slice(eqIdx + 1).trim();

    // Strip inline comments (e.g., KEY=val # comment)
    // Be careful with keys containing '#' inside quotes
    if (valPart.includes('#')) {
      // Very simple inline comment stripping (skip if quote doesn't close)
      const firstQuote = valPart.match(/^['"]/);
      if (firstQuote) {
        const quote = firstQuote[0];
        const lastQuoteIdx = valPart.lastIndexOf(quote);
        if (lastQuoteIdx > 0) {
          valPart = valPart.slice(0, lastQuoteIdx + 1);
        } else {
          // Unclosed quote, split by '#'
          valPart = valPart.split('#')[0].trim();
        }
      } else {
        valPart = valPart.split('#')[0].trim();
      }
    }

    // Strip quotes
    if ((valPart.startsWith('"') && valPart.endsWith('"')) || 
        (valPart.startsWith("'") && valPart.endsWith("'"))) {
      valPart = valPart.slice(1, -1);
    }

    result[key] = valPart.trim();
  }

  return result;
}

/**
 * Determines whether a key is sensitive.
 */
export function isSensitiveKey(key: string): boolean {
  const normalized = key.toUpperCase();
  const sensitiveKeywords = [
    'PASS', 'PWD', 'SECRET', 'KEY', 'TOKEN', 'CREDENTIAL', 'API', 'AUTH', 
    'JWT', 'HASH', 'SALT', 'CERT', 'PRIVATE', 'SIGNATURE', 'DATABASE', 'DB_URL', 
    'CONN', 'ACCESS', 'CLIENT_ID', 'CLIENT_SECRET', 'KEY_ID'
  ];
  return sensitiveKeywords.some((keyword) => normalized.includes(keyword));
}

/**
 * Checks if a value appears to be a placeholder instead of authentic configuration.
 */
export function isPlaceholderValue(value: string, key: string): boolean {
  if (!value) return false;
  
  const normalizedVal = value.toLowerCase().trim();
  const normalizedKey = key.toLowerCase();

  // Typical literal placeholders
  const commonPlaceholders = [
    'change_me', 'changeme', 'change-me',
    'replace_me', 'replaceme', 'replace-me',
    'placeholder', 'myplaceholder',
    'your_secret', 'yoursecret', 'your_key', 'yourkey',
    'insert_here', 'inserthere',
    'your-api-key', 'your_api_key', 'api_key_here',
    'abc123xyz', '1234567890', 'sk-proj-...',
    'foo', 'bar', 'test_key', 'some_secret', 'testsecret'
  ];

  if (commonPlaceholders.some(p => normalizedVal.includes(p))) {
    return true;
  }

  // Value containing key's fallback template like:
  // KEY="MY_KEY_HERE" or KEY="YOUR_KEY_HERE"
  if (normalizedVal === `my_${normalizedKey}` || 
      normalizedVal === `your_${normalizedKey}` || 
      normalizedVal === `my_${normalizedKey}_here` ||
      normalizedVal === `your_${normalizedKey}_here` ||
      normalizedVal.includes('your_') ||
      normalizedVal.includes('my_') && normalizedVal.endsWith('_key') ||
      normalizedVal.includes('my_') && normalizedVal.endsWith('_url') ||
      normalizedVal.includes('my-') ||
      normalizedVal.includes('your-')) {
    return true;
  }

  // Pre-configured typical mock values
  if (normalizedVal === 'my_gemini_api_key' || normalizedVal === 'my_app_url' || normalizedVal === 'my_secret') {
    return true;
  }

  return false;
}

/**
 * Validates .env against .env.example with the requested dotguard CLI schema.
 */
export function validateEnv(options: {
  envContent: string;
  envExampleContent: string;
  strict: boolean;
  noExtras: boolean;
  noGitCheck: boolean;
  trackedInGit: boolean;
}): ValidationResult {
  const { envContent, envExampleContent, strict, noExtras, noGitCheck, trackedInGit } = options;

  const envMap = parseEnvFile(envContent);
  const exampleMap = parseEnvFile(envExampleContent);
  const checks: ValidationCheck[] = [];

  // 1. Key in .env.example but missing from .env
  // Severity: ERROR
  for (const key of Object.keys(exampleMap)) {
    if (!(key in envMap)) {
      checks.push({
        id: `missing-${key}`,
        key,
        severity: Severity.ERROR,
        message: `Key "${key}" defined in .env.example but missing from .env.`,
        exampleValue: exampleMap[key],
      });
    }
  }

  // 2. Scan parsed .env keys for values & matching keys in example
  for (const [key, value] of Object.entries(envMap)) {
    const isSensitive = isSensitiveKey(key);
    const hasValue = value.length > 0;
    const isPlaceholder = isPlaceholderValue(value, key);

    // Let's perform validation checks corresponding to this key
    if (isSensitive) {
      if (!hasValue) {
        // Sensitive key with empty value => ERROR
        checks.push({
          id: `empty-sensitive-${key}`,
          key,
          severity: Severity.ERROR,
          message: `Sensitive key "${key}" is empty.`,
          value,
        });
      } else if (isPlaceholder) {
        // Sensitive key with a placeholder value => ERROR
        checks.push({
          id: `placeholder-sensitive-${key}`,
          key,
          severity: Severity.ERROR,
          message: `Sensitive key "${key}" contains raw placeholder or template value: "${value}".`,
          value,
        });
      } else {
        // Fine sensitive key
        if (key in exampleMap) {
          checks.push({
            id: `fine-${key}`,
            key,
            severity: Severity.SUCCESS,
            message: `Sensitive key "${key}" matches expectations and is set safely.`,
            value,
          });
        }
      }
    } else {
      // Non-sensitive key
      if (!hasValue) {
        // Non-sensitive key with empty value => WARNING
        checks.push({
          id: `empty-nonsensitive-${key}`,
          key,
          severity: Severity.WARNING,
          message: `Non-sensitive key "${key}" is empty.`,
          value,
        });
      } else if (isPlaceholder) {
        // Non-sensitive key with a placeholder value => WARNING
        checks.push({
          id: `placeholder-nonsensitive-${key}`,
          key,
          severity: Severity.WARNING,
          message: `Non-sensitive key "${key}" has placeholder value: "${value}".`,
          value,
        });
      } else {
        // Fine non-sensitive key
        if (key in exampleMap) {
          checks.push({
            id: `fine-${key}`,
            key,
            severity: Severity.SUCCESS,
            message: `Non-sensitive key "${key}" matches expectations.`,
            value,
          });
        }
      }
    }

    // 3. Key in .env but not in .env.example (Extra key)
    // Severity: WARNING (or ERROR if --no-extras is set)
    if (!(key in exampleMap)) {
      checks.push({
        id: `extra-${key}`,
        key,
        severity: noExtras ? Severity.ERROR : Severity.WARNING,
        message: `Key "${key}" is present in .env but not in .env.example.`,
        value,
      });
    }
  }

  // 4. Git Check
  // Severity: ERROR
  if (!noGitCheck && trackedInGit) {
    checks.push({
      id: `git-tracked`,
      key: `.env`,
      severity: Severity.ERROR,
      message: `.env file is tracked or staged in git (security risk). Add it to .gitignore!`,
    });
  }

  // Calculate final aggregate stats
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const check of checks) {
    if (check.severity === Severity.ERROR) {
      totalErrors++;
    } else if (check.severity === Severity.WARNING) {
      if (strict) {
        totalErrors++; // In --strict mode, warnings behave as errors
      } else {
        totalWarnings++;
      }
    }
  }

  // Exit Code rules:
  // 0 = All checks passed (or only warnings exist without --strict mode)
  // 1 = One or more errors (or warnings with --strict mode)
  // 2 = File not found (simulated if either of the file values are strictly empty/unentered)
  let exitCode = 0;
  if (!envContent && !envExampleContent) {
    exitCode = 2;
  } else if (totalErrors > 0) {
    exitCode = 1;
  }

  return {
    exitCode,
    checks,
    hasErrors: totalErrors > 0,
    hasWarnings: totalWarnings > 0,
    totalErrors,
    totalWarnings,
  };
}

/**
 * Anonymizes .env values to generate a perfectly scrubbed .env.example file.
 * Implementation of `dotguard init`
 */
export function generateExampleFromEnv(envContent: string): string {
  const lines = envContent.split(/\r?\n/);
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      resultLines.push('');
      continue;
    }
    if (trimmed.startsWith('#')) {
      resultLines.push(line);
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      resultLines.push(line);
      continue;
    }

    const leadPart = line.slice(0, eqIdx); // e.g. "  DB_PASS " or "PORT"
    const key = leadPart.trim();
    const valPart = line.slice(eqIdx + 1).trim();

    // Check if key is sensitive or if it's already a placeholder
    const isSensitive = isSensitiveKey(key);

    let replacement = '';
    if (isSensitive) {
      replacement = `YOUR_${key.toUpperCase()}`;
    } else {
      // For non-sensitive items, conserve a default if it acts as config
      if (normalizedIsCommonConfig(key, valPart)) {
        replacement = valPart;
      } else {
        replacement = `YOUR_${key.toUpperCase()}`;
      }
    }

    resultLines.push(`${leadPart}=${replacement}`);
  }

  return resultLines.join('\n');
}

function normalizedIsCommonConfig(key: string, value: string): boolean {
  const normKey = key.toUpperCase();
  const normValue = value.toLowerCase();

  // If already matches standard common variables that carry structural meanings
  if (normKey === 'PORT' && /^\d+$/.test(value)) return true;
  if (normKey === 'NODE_ENV' && (normValue === 'production' || normValue === 'development' || normValue === 'test')) return true;
  if (normKey === 'DEBUG' && (normValue === 'true' || normValue === 'false')) return true;
  if (normKey === 'LOG_LEVEL' && (normValue === 'info' || normValue === 'warn' || normValue === 'error' || normValue === 'debug')) return true;
  if (normKey === 'HOST' && (normValue === 'localhost' || normValue === '127.0.0.1' || normValue === '0.0.0.0')) return true;

  return false;
}
