import 'modern-normalize/modern-normalize.css';
import './styles/main.scss';
import './components';
import { YourEnergyAPI } from './api/your-energy-api.ts';
import { Quote } from './components/quote/Quote';

// Expose components to the global window object for use in partials
(window as any).YourEnergyAPI = YourEnergyAPI;
(window as any).Quote = Quote;

// Components will be initialized by their respective partials/files
