import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// All API calls go through /api (proxied to the API server artifact)
setBaseUrl('/api');

createRoot(document.getElementById('root')!).render(<App />);
