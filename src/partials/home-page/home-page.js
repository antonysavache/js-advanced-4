import { ExerciseFilter } from '../../api/api.interface';

class HomePageController {
  constructor() {
    this.activeFilter = 'Muscles';
    this.loading = false;
    this.categoryCards = [];
    this.emptyState = null;
    this.exercisesTitleElement = document.querySelector('.exercises-title');
    this.backToCategoriesLink = document.getElementById('back-to-categories');
    this.exerciseSearchInput = document.getElementById('exercise-search-input');
    this.clearSearchBtn = document.getElementById('clear-search-btn');
    this.searchIconPlaceholder = document.getElementById('search-icon-placeholder');
    this.exerciseContainer = document.getElementById('exercise-container');
    this.currentExercises = [];
    this.isDisplayingExercises = false;
    this.searchWrapper = document.querySelector('.search-exercises-wrapper');

    this.init();
  }

  init() {
    this.bindEvents();
    this.setDefaultFilter();
    this.initQuote();
    this.initEmptyState();
    this.loadCategories(this.activeFilter);
    this.updateExercisesTitle('Exercises', false);
    this.hideSearchInput();
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
        this.clearSearch();
        this.hideSearchInput();
      });
    }

    if (this.exerciseSearchInput) {
      this.exerciseSearchInput.addEventListener('keyup', this.handleSearch.bind(this));
    }
    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', this.clearSearch.bind(this));
    }
  }

  async handleFilterChange(filter) {
    this.setActiveFilter(filter);
    this.showCategoryGrid();
    this.updateExercisesTitle('Exercises', false);
    this.clearSearch();
    this.hideSearchInput();

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
      const categoryCard = new window.CategoryCard(category, this);
      categoryCard.render(container);
      this.categoryCards.push(categoryCard);
    });
  }

  displayExercises(exercises) {
    if (this.exerciseContainer && window.exerciseGrid) {
      this.currentExercises = exercises;
      window.exerciseGrid.render(exercises);
      window.exerciseGrid.show();
      document.getElementById('category-grid').style.display = 'none';
      this.isDisplayingExercises = true;
      this.showSearchInput();
    }
  }

  handleSearch() {
    const query = this.exerciseSearchInput.value.toLowerCase().trim();
    if (query) {
      this.clearSearchBtn.style.display = 'block';
      if (this.searchIconPlaceholder) {
        this.searchIconPlaceholder.style.display = 'none';
      }
    } else {
      this.clearSearchBtn.style.display = 'none';
      if (this.searchIconPlaceholder) {
        this.searchIconPlaceholder.style.display = 'block';
      }
    }

    if (this.currentExercises.length > 0) {
      const filteredExercises = this.currentExercises.filter(exercise => exercise.name.toLowerCase().includes(query));

      if (window.exerciseGrid) {
        window.exerciseGrid.render(filteredExercises);
        if (query) {
          window.exerciseGrid.show();
          document.getElementById('category-grid').style.display = 'none';
          this.isDisplayingExercises = true;
        } else {
          if (this.isDisplayingExercises) {
            window.exerciseGrid.render(this.currentExercises);
            window.exerciseGrid.show();
            document.getElementById('category-grid').style.display = 'none';
          } else {
            this.showCategoryGrid();
          }
        }
      }
    } else if (query) {
      if (window.exerciseGrid) {
        window.exerciseGrid.render([]);
        window.exerciseGrid.show();
        document.getElementById('category-grid').style.display = 'none';
        this.isDisplayingExercises = true;
      }
    } else {
      this.showCategoryGrid();
    }
  }

  clearSearch() {
    if (this.exerciseSearchInput) {
      this.exerciseSearchInput.value = '';
      this.clearSearchBtn.style.display = 'none';
      if (this.searchIconPlaceholder) {
        this.searchIconPlaceholder.style.display = 'block';
      }
    }
    if (this.isDisplayingExercises) {
      if (window.exerciseGrid) {
        window.exerciseGrid.render(this.currentExercises);
      }
    } else {
      this.showCategoryGrid();
    }
  }

  renderPaginator() {
    const paginatorContainer = document.getElementById('paginator-container');
    if (!paginatorContainer) return;

    const paginator = new window.Paginator(paginatorContainer, {
      totalPages: 5,
      perPage: 12,
      currentPage: 1,
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
            this.clearSearch();
            this.hideSearchInput();
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
            this.clearSearch();
            this.hideSearchInput();
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
      if (window.exerciseGrid) {
        window.exerciseGrid.hide();
      }
    }
    this.isDisplayingExercises = false;
    this.hideSearchInput();
  }

  showSearchInput() {
    if (this.searchWrapper) {
      this.searchWrapper.style.display = 'block';
      if (this.exerciseSearchInput.value.trim() === '') {
        if (this.searchIconPlaceholder) {
          this.searchIconPlaceholder.style.display = 'block';
        }
        this.clearSearchBtn.style.display = 'none';
      } else {
        this.clearSearchBtn.style.display = 'block';
        if (this.searchIconPlaceholder) {
          this.searchIconPlaceholder.style.display = 'none';
        }
      }
    }
  }

  hideSearchInput() {
    if (this.searchWrapper) {
      this.searchWrapper.style.display = 'none';
      this.exerciseSearchInput.value = '';
      this.clearSearchBtn.style.display = 'none';
      if (this.searchIconPlaceholder) {
        this.searchIconPlaceholder.style.display = 'none';
      }
    }
  }
}

let homePageController;

window.addEventListener('load', () => {
  homePageController = new HomePageController();
  window.homePageController = homePageController;
  window.exerciseGrid = new window.ExerciseGrid('#exercise-container');
});
