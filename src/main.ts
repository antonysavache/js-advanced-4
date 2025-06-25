import 'modern-normalize/modern-normalize.css';
import './styles/main.scss';
import './components';
import './api/index';

//  expose YourEnergyAPI to the global window object for debugging from the browser console
import { YourEnergyAPI } from './api/your-energy-api.ts';
(window as any).YourEnergyAPI = YourEnergyAPI;
