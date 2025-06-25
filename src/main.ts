import 'modern-normalize/modern-normalize.css';
import './styles/main.scss';
import './components';
import { YourEnergyAPI } from './api/your-energy-api.ts';
import { Quote } from './components/quote/Quote';
import { CategoryCard } from './components/category-card/CategoryCard';
import { EmptyState } from './components/empty-state/EmptyState';

// Expose components to the global window object for use in partials
(window as any).YourEnergyAPI = YourEnergyAPI;
(window as any).Quote = Quote;
(window as any).CategoryCard = CategoryCard;
(window as any).EmptyState = EmptyState;

// Components will be initialized by their respective partials/files
