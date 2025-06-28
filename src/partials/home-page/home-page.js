import { ExerciseFilter } from '../../api/api.interface';

class HomePageController {
  constructor() {
    this.activeFilter = 'Muscles';
    this.loading = false;
    this.categoryCards = [];
    this.emptyState = null;
    this.exercisesTitleElement = document.querySelector('.exercises-title');
    this.backToCategoriesLink = document.getElementById('back-to-categories');

    this.init();
  }

  init() {
    this.bindEvents();
    this.setDefaultFilter();
    this.initQuote();
    this.initEmptyState();
    this.loadCategories();
    this.updateExercisesTitle('Exercises', false);
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

    if (this.backToCategoriesLink) {
      this.backToCategoriesLink.addEventListener('click', e => {
        e.preventDefault();
        this.showCategoryGrid();
        this.updateExercisesTitle('Exercises', false);
      });
    }
  }

  async handleFilterChange(filter) {
    this.setActiveFilter(filter);
    this.showCategoryGrid();
    this.updateExercisesTitle('Exercises', false);

    await this.loadCategories();
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

  async loadCategories(page = 1, perPage = 12) {
    try {
      this.loading = true;

      const apiFilter = ExerciseFilter[this.activeFilter];
      const response = await window.YourEnergyAPI.getFilters(apiFilter, page, perPage);

      if (response && response.results && response.results.length) {
        this.renderCategories(response.results);
      } else {
        this.showEmptyState();
      }
      this.renderPaginator(page, perPage, response.totalPages);
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
      const categoryCard = new window.CategoryCard(category, this);
      categoryCard.render(container);
      this.categoryCards.push(categoryCard);
    });
  }

  renderPaginator(currentPage, perPage, totalPages) {
    const paginatorContainer = document.getElementById('paginator-container');
    if (!paginatorContainer) return;
    const paginator = new window.Paginator(paginatorContainer, this.loadCategories.bind(this), {
      totalPages,
      perPage,
      currentPage,
    });
    paginator.render();
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
    const selectors = ['#quote-container', '.tablet-only .quote-section', '.desktop-only .quote-section'];

    selectors.forEach(selector => {
      const container = document.querySelector(selector);
      if (container && window.Quote) {
        new window.Quote(selector);
      }
    });
  }

  updateExercisesTitle(titleContent, isCategorySelected) {
    if (this.exercisesTitleElement && this.backToCategoriesLink) {
      if (isCategorySelected) {
        this.exercisesTitleElement.innerHTML = `<a href="#" id="back-to-categories" class="exercises-back-link">Exercises</a> / <span class="exercise-category-title">${titleContent}</span>`;
        this.backToCategoriesLink = document.getElementById('back-to-categories');
        if (this.backToCategoriesLink) {
          this.backToCategoriesLink.addEventListener('click', e => {
            e.preventDefault();
            this.showCategoryGrid();
            this.updateExercisesTitle('Exercises', false);
          });
        }
      } else {
        this.exercisesTitleElement.innerHTML = `<a href="#" id="back-to-categories" class="exercises-back-link">Exercises</a>`;
        this.backToCategoriesLink = document.getElementById('back-to-categories');
        if (this.backToCategoriesLink) {
          this.backToCategoriesLink.addEventListener('click', e => {
            e.preventDefault();
            this.showCategoryGrid();
            this.updateExercisesTitle('Exercises', false);
          });
        }
      }
    }
  }

  showCategoryGrid() {
    const categoryGrid = document.getElementById('category-grid');
    const exerciseContainer = document.getElementById('exercise-container');

    if (categoryGrid) {
      categoryGrid.style.display = 'flex';
    }
    if (exerciseContainer) {
      exerciseContainer.style.display = 'none';
    }
  }
}

let homePageController;

window.addEventListener('load', () => {
  homePageController = new HomePageController();
  window.homePageController = homePageController;
});
