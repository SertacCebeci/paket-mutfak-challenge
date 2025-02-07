// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@paket/tailwind-config';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    '../../packages/features/src/**/*.{ts,tsx}',
    '../../apps/web/components/**/*.{ts,tsx}',
    '../../apps/web/app/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
};

export default config;
