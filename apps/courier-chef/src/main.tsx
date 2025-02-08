import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@paket/features/styles.css';
import '@paket/shared/styles.css';
import { App } from './app.tsx'
import { ReactQueryProvider } from './utils/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
    <App />
    </ReactQueryProvider>
  </StrictMode>,
)
