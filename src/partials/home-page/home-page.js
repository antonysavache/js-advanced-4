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
    // При зміні фільтра, ховаємо сітку вправ і показуємо сітку категорій
    const exerciseContainer = document.getElementById('exercise-container');
    const categoryGrid = document.getElementById('category-grid');

    if (exerciseContainer) {
      exerciseContainer.style.display = 'none';
    }
    if (categoryGrid) {
      categoryGrid.style.display = 'grid';
    }

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
      this.renderPaginator();
    } catch (error) {
      console.log(error);
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
      // CategoryCard тепер сама обробляє клік та відображення вправ
      const categoryCard = new window.CategoryCard(category);
      categoryCard.render(container);
      this.categoryCards.push(categoryCard);
    });
  }

  renderPaginator() {
    const paginatorContainer = document.getElementById('paginator-container');
    if (!paginatorContainer) return;

    const paginator = new window.Paginator(122, 12, 1);
    paginator.render(paginatorContainer);
  }

  showEmptyState() {
    if (!this.emptyState) {
      return;
    }
    this.emptyState.show('Категорії не знайдено');
  }

  showErrorState() {
    if (!this.emptyState) {
      return;
    }
    this.emptyState.show('Помилка завантаження даних.');
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
    const selectors = [
      '#quote-container',
      '.tablet-only .quote-section',
      '.desktop-only .quote-section',
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