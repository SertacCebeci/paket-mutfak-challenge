import type { Config } from 'tailwindcss';
import sharedConfig from '@paket/tailwind-config';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./src/**/*.tsx'],
  prefix: 'features-',
  presets: [sharedConfig],
};

export default config;
