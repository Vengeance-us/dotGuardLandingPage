/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DemoTemplate } from './types';

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    name: 'Secure Production State',
    description: 'Perfectly configured environment. All necessary keys are set correctly without placeholder leakages.',
    trackedInGit: false,
    envExample: `# .env.example
PORT=3000
NODE_ENV=development
DATABASE_URL=
STRIPE_SECRET_KEY=
JWT_SECRET=
GITHUB_CLIENT_ID=
`,
    env: `# .env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://db_user:sUpErS3crEtPaSs@db-host:5432/main_db
STRIPE_SECRET_KEY=sk_live_51Mzk21gHsk27Hjs89JklM90Px
JWT_SECRET=zK9!8Hq$3Lp@1Ws9#_vB5Xy2T
GITHUB_CLIENT_ID=7da3f8e6c9b20d1a4e5f
`,
  },
  {
    name: 'Leaked Placeholders (AI Slop)',
    description: 'Simulates a dirty local environment where the developer left sensitive API keys blank or used mock strings, while staging the .env file in git.',
    trackedInGit: true,
    envExample: `# .env.example
GEMINI_API_KEY=
APP_URL=
DATABASE_PASS=
MAIL_PORT=25
REDIS_TOKEN=
`,
    env: `# .env
# Oh no, left default values unmodified!
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
DATABASE_PASS="change_me"
MAIL_PORT=
REDIS_TOKEN=""
`,
  },
  {
    name: 'Drifting Keys (Mismatched Schema)',
    description: 'Includes unlisted extra variables, empty diagnostic settings, and warnings that fail immediately in --strict or --no-extras mode.',
    trackedInGit: false,
    envExample: `# .env.example
PORT=3000
DEBUG=false
SENDGRID_API_KEY=
`,
    env: `# .env
PORT=3000
DEBUG=
SENDGRID_API_KEY=SG.yH98Klsk28a-jHas89s

# Added these locally but forgot to update .env.example!
INTERNAL_BYPASS_TOKEN=token_xyz_998
LOCAL_TEST_OVERRIDE=true
`,
  },
];
