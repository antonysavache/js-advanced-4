import { ExerciseFilter } from '../../api/api.interface';

class HomePageController {
  constructor() {
    this.activeFilter = 'Muscles';
    this.loading = false;
    this.categoryCards = [];
    this.emptyState = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setDefaultFilter();
    this.initQuote();
    this.initEmptyState();
    this.loadCategories(this.activeFilter);
  }

  bindEvents() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', e => {
        const filter = e.target.dataset.filter;
        if (filter && filter !== this.activeFilter && !this.loading) {
          this.handleFilterChange(filter);
        }
      });
    });
  }

  async handleFilterChange(filter) {
    this.setActiveFilter(filter);
    await this.loadCategories(filter);
  }

  setActiveFilter(filter) {
    this.activeFilter = filter;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      const buttonFilter = button.dataset.filter;
      if (buttonFilter === filter) {
        button.classList.add('filter-btn--active');
      } else {
        button.classList.remove('filter-btn--active');
      }
    });
  }

  setDefaultFilter() {
    this.setActiveFilter('Muscles');
  }

  async loadCategories(filter) {
    try {
      this.loading = true;

      const apiFilter = ExerciseFilter[filter];
      const response = await window.YourEnergyAPI.getFilters(apiFilter, 1, 12);

      if (response && response.results && response.results.length) {
        this.renderCategories(response.results);
      } else {
        this.showEmptyState();
      }
    } catch (error) {
      this.showErrorState();
    } finally {
      this.loading = false;
    }
  }

  renderCategories(categories) {
    const container = document.getElementById('category-grid');
    if (!container) return;

    this.clearCategoryCards();
    container.innerHTML = '';

    container.classList.add('categories-grid');

    categories.forEach(category => {
      const categoryCard = new window.CategoryCard(category, selectedCategory => {
        this.handleCategorySelect(selectedCategory);
      });

      categoryCard.render(container);
      this.categoryCards.push(categoryCard);
    });
  }

  handleCategorySelect(selectedCategory) {
    console.log('Category selected:', selectedCategory);
    // Логика обработки в CategoryCard.ts
  }

  showEmptyState() {
    if (!this.emptyState) {
      return;
    }
    this.emptyState.show('Категорії не знайдено');
  }

  clearCategoryCards() {
    this.categoryCards.forEach(card => {
      if (card.destroy) {
        card.destroy();
      }
    });
    this.categoryCards = [];
  }

  initEmptyState() {
    try {
      this.emptyState = new window.EmptyState('#category-grid');
    } catch (error) {
      console.warn('EmptyState component not available:', error);
    }
  }

  initQuote() {
    // Initialize Quote component for all device versions
    const selectors = [
      '#quote-container', // mobile version
      '.tablet-only .quote-section', // tablet version
      '.desktop-only .quote-section', // desktop version
    ];

    selectors.forEach(selector => {
      const container = document.querySelector(selector);
      if (container && window.Quote) {
        console.log(`Initializing Quote for: ${selector}`);
        new window.Quote(selector);
      }
    });
  }
}

let homePageController;

window.addEventListener('load', () => {
  homePageController = new HomePageController();
  window.homePageController = homePageController;
});
