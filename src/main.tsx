import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { preloadVoices } from './utils/speechUtils';

preloadVoices();

createRoot(document.getElementById('root')!).render(<App />);
