import 'modern-normalize/modern-normalize.css';
import './css/index.css';
import './styles/main.scss';
import './components';
import { YourEnergyAPI } from './api/your-energy-api.ts';
import { Quote } from './components/quote/Quote';
import { CategoryCard } from './components/category-card/CategoryCard';
import { EmptyState } from './components/empty-state/EmptyState';
import { Paginator } from './components/paginator/Paginator';

(window as any).YourEnergyAPI = YourEnergyAPI;
(window as any).Quote = Quote;
(window as any).CategoryCard = CategoryCard;
(window as any).EmptyState = EmptyState;
(window as any).Paginator = Paginator;

function initializeRouting(): void {
  const currentHash = window.location.hash;
  const validHashes = ['#home', '#favorites'];

  if (!currentHash) {
    window.location.hash = '#home';
  } else if (!validHashes.includes(currentHash)) {
    window.location.hash = '#home';
  }

  handleRouteChange();
}

function handleRouteChange(): void {
  const currentHash = window.location.hash || '#home';

  const homeSection = document.getElementById('home-section');
  const favoritesSection = document.getElementById('favorites-section');

  if (homeSection && favoritesSection) {
    if (currentHash === '#home') {
      homeSection.style.display = 'block';
      favoritesSection.style.display = 'none';
    } else if (currentHash === '#favorites') {
      homeSection.style.display = 'none';
      favoritesSection.style.display = 'block';

      if ((window as any).renderFavorites) {
        (window as any).renderFavorites(1);
      }
    }
  }
}

window.addEventListener('hashchange', handleRouteChange);

document.addEventListener('DOMContentLoaded', initializeRouting);
