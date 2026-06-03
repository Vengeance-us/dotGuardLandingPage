/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Severity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
}

export interface ValidationCheck {
  id: string;
  key: string;
  severity: Severity;
  message: string;
  value?: string;
  exampleValue?: string;
}

export interface ValidationResult {
  exitCode: number;
  checks: ValidationCheck[];
  hasErrors: boolean;
  hasWarnings: boolean;
  totalErrors: number;
  totalWarnings: number;
}

export interface DemoTemplate {
  name: string;
  description: string;
  env: string;
  envExample: string;
  trackedInGit: boolean;
}
