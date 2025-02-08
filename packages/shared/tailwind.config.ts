import type { Config } from 'tailwindcss';
import sharedConfig from '@paket/tailwind-config';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./src/**/*.tsx'],
  prefix: 'shared-',
  presets: [sharedConfig],
};

export default config;
