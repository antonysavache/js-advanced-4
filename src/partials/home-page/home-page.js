import { ExerciseFilter } from '../../api/api.interface';
import { Paginator } from '../../components/paginator/Paginator';

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

    this.paginatorInstance = null; // Для категорій
    this.paginatorExerciseInstance = null; // Для вправ
    this.currentPage = 1;
    this.perPage = 12;
    this.totalPages = 1;

    this.currentCategoryName = ''; // Зберігаємо ім'я поточної категорії для пагінації вправ
    this.currentExerciseSearchQuery = ''; // Для пошуку вправ

    this.init();
  }

  init() {
    this.bindEvents();
    this.setDefaultFilter();
    this.initQuote();
    this.initEmptyState();
    this.loadCategories(this.activeFilter, this.currentPage, this.perPage);
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
        this.currentPage = 1;
        this.loadCategories(this.activeFilter, this.currentPage, this.perPage);
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
    this.showCategoryGrid(); // Повертаємося до категорій, приховуючи пагінатор вправ
    this.updateExercisesTitle('Exercises', false);
    this.clearSearch();
    this.hideSearchInput();

    this.currentPage = 1;
    await this.loadCategories(filter, this.currentPage, this.perPage);
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

  async loadCategories(filter, page, perPage) {
    try {
      this.loading = true;
      if (this.paginatorExerciseInstance) {
        this.paginatorExerciseInstance.hide(); // Приховуємо пагінатор вправ, коли завантажуємо категорії
      }

      const apiFilter = ExerciseFilter[filter];
      const response = await window.YourEnergyAPI.getFilters(apiFilter, page, perPage);

      if (response && response.results && response.results.length) {
        this.renderCategories(response.results);
        this.totalPages = response.totalPages || 1;
        this.currentPage = response.page || 1;
        this.perPage = response.perPage || perPage;

        this.renderPaginator(this.currentPage, this.perPage, this.totalPages);
      } else {
        this.showEmptyState();
        this.totalPages = 0;
        this.renderPaginator(this.currentPage, this.perPage, this.totalPages);
      }
    } catch (error) {
      console.log(error);
      this.showErrorState();
      this.totalPages = 0;
      this.renderPaginator(this.currentPage, this.perPage, this.totalPages);
    } finally {
      this.loading = false;
    }
  }

  async loadExercises(categoryName, page = 1, perPage = 12, searchQuery = '') {
    try {
      this.loading = true;
      this.currentCategoryName = categoryName; // Зберігаємо поточну категорію
      this.currentExerciseSearchQuery = searchQuery; // Зберігаємо поточний пошуковий запит
      if (this.paginatorInstance) {
        this.paginatorInstance.hide(); // Приховуємо пагінатор категорій
      }

      const filterToParam = {
        Muscles: 'muscles',
        'Body parts': 'bodypart',
        Equipment: 'equipment',
      };
      const apiFilter = ExerciseFilter[this.activeFilter];
      const paramName = filterToParam[this.activeFilter];

      const exerciseParams = {
        page: page,
        limit: perPage,
        [paramName]: categoryName,
        keyword: searchQuery, // Додаємо пошуковий запит до параметрів
      };

      const response = await window.YourEnergyAPI.getExercises(exerciseParams);
      const exercises = response.results;

      if (exercises && exercises.length) {
        this.displayExercises(exercises); // Тепер ця функція лише рендерить
        this.currentExercises = exercises; // Оновлюємо currentExercises для локального пошуку

        this.totalPages = response.totalPages || 1;
        this.currentPage = response.page || 1;
        this.perPage = response.perPage || perPage;

        this.renderExercisePaginator(this.currentPage, this.perPage, this.totalPages);
      } else {
        window.exerciseGrid.showError('Вправи за цією категорією не знайдено.');
        if (this.paginatorExerciseInstance) {
          this.paginatorExerciseInstance.hide();
        }
      }
    } catch (error) {
      console.warn('Вправи не знайдено або сталася помилка:', error);
      window.exerciseGrid.showError('Помилка завантаження вправ. Спробуйте пізніше.');
      if (this.paginatorExerciseInstance) {
        this.paginatorExerciseInstance.hide();
      }
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
      window.exerciseGrid.render(exercises);
      window.exerciseGrid.show();
      document.getElementById('category-grid').style.display = 'none';
      this.isDisplayingExercises = true;
      this.showSearchInput();
    }
  }

  handleSearch() {
    const query = this.exerciseSearchInput.value.toLowerCase().trim();
    this.currentExerciseSearchQuery = query; // Оновлюємо пошуковий запит
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

    // Тепер пошук завжди викликає loadExercises для отримання даних з бекенду
    if (this.isDisplayingExercises && this.currentCategoryName) {
      this.currentPage = 1; // Скидаємо сторінку при пошуку
      this.loadExercises(this.currentCategoryName, this.currentPage, this.perPage, this.currentExerciseSearchQuery);
    } else if (!query) {
      // Якщо пошук очищено, а ми на сторінці вправ, перезавантажуємо поточні вправи
      if (this.isDisplayingExercises && this.currentCategoryName) {
        this.currentPage = 1; // Скидаємо сторінку
        this.loadExercises(this.currentCategoryName, this.currentPage, this.perPage, '');
      } else {
        this.showCategoryGrid(); // Якщо ми на категоріях і очистили пошук, показуємо категорії
      }
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
    // Коли пошук очищено, якщо ми переглядаємо вправи, перезавантажуємо їх без фільтра пошуку
    if (this.isDisplayingExercises && this.currentCategoryName) {
      this.currentExerciseSearchQuery = ''; // Очищаємо збережений пошуковий запит
      this.currentPage = 1; // Скидаємо сторінку
      this.loadExercises(this.currentCategoryName, this.currentPage, this.perPage, '');
    } else {
      this.showCategoryGrid();
    }
  }

  renderPaginator(currentPage, perPage, totalPages) {
    const paginatorContainer = document.getElementById('paginator-container');
    if (!paginatorContainer) {
      console.warn("Елемент #paginator-container не знайдено. Переконайтеся, що він існує у вашому HTML.");
      return;
    }

    const paginationData = {
      totalPages: totalPages,
      perPage: perPage,
      currentPage: currentPage,
    };

    const loadManagedDataFunction = async (newPage, currentPerPage, currentTotalPages) => {
      this.currentPage = newPage;
      this.perPage = currentPerPage;
      this.totalPages = currentTotalPages;
      await this.loadCategories(this.activeFilter, this.currentPage, this.perPage);
    };

    if (this.paginatorInstance) {
      this.paginatorInstance.render(paginationData.currentPage, paginationData.perPage, paginationData.totalPages);
      this.paginatorInstance.show(); // Переконайтеся, що пагінатор категорій видимий
    } else {
      this.paginatorInstance = new window.Paginator(paginatorContainer, loadManagedDataFunction, paginationData);
      this.paginatorInstance.render();
    }
  }

  renderExercisePaginator(currentPage, perPage, totalPages) {
    const paginatorContainer = document.getElementById('paginator-container');
    if (!paginatorContainer) {
      console.warn("Елемент #paginator-container не знайдено для пагінатора вправ. Переконайтеся, що він існує у вашому HTML.");
      return;
    }

    const paginationData = {
      totalPages: totalPages,
      perPage: perPage,
      currentPage: currentPage,
    };

    // Функція завантаження даних для пагінатора вправ
    const loadManagedDataFunction = async (newPage, currentPerPage, currentTotalPages) => {
      this.currentPage = newPage;
      this.perPage = currentPerPage;
      this.totalPages = currentTotalPages;
      await this.loadExercises(this.currentCategoryName, this.currentPage, this.perPage, this.currentExerciseSearchQuery);
    };

    if (this.paginatorExerciseInstance) {
      this.paginatorExerciseInstance.render(paginationData.currentPage, paginationData.perPage, paginationData.totalPages);
      this.paginatorExerciseInstance.show(); // Переконайтеся, що пагінатор вправ видимий
    } else {
      this.paginatorExerciseInstance = new window.Paginator(paginatorContainer, loadManagedDataFunction, paginationData);
      this.paginatorExerciseInstance.render();
    }
  }

  showEmptyState() {
    if (!this.emptyState) {
      return;
    }
    this.emptyState.show('Категорії не знайдено');
    if (this.paginatorInstance) {
        this.paginatorInstance.hide();
    }
    if (this.paginatorExerciseInstance) {
        this.paginatorExerciseInstance.hide();
    }
  }

  showErrorState() {
    if (!this.emptyState) {
      return;
    }
    this.emptyState.show('Помилка завантаження даних.');
    if (this.paginatorInstance) {
        this.paginatorInstance.hide();
    }
    if (this.paginatorExerciseInstance) {
        this.paginatorExerciseInstance.hide();
    }
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
    if (this.exercisesTitleElement) {
      if (isCategorySelected) {
        this.exercisesTitleElement.innerHTML = `<a href="#" id="back-to-categories" class="exercises-back-link">Exercises</a> / <span class="exercise-category-title">${titleContent}</span>`;
        // Оновлюємо посилання на back-to-categories, якщо воно було ре-рендерене
        this.backToCategoriesLink = document.getElementById('back-to-categories');
        if (this.backToCategoriesLink) {
          this.backToCategoriesLink.removeEventListener('click', this.handleBackToCategoriesClick); // Видаляємо стару, якщо є
          this.backToCategoriesLink.addEventListener('click', this.handleBackToCategoriesClick); // Додаємо нову
        }
      } else {
        this.exercisesTitleElement.innerHTML = `<a href="#" id="back-to-categories" class="exercises-back-link">Exercises</a>`;
        this.backToCategoriesLink = document.getElementById('back-to-categories');
        if (this.backToCategoriesLink) {
          this.backToCategoriesLink.removeEventListener('click', this.handleBackToCategoriesClick);
          this.backToCategoriesLink.addEventListener('click', this.handleBackToCategoriesClick);
        }
      }
    }
  }

  handleBackToCategoriesClick = (e) => {
    e.preventDefault();
    this.showCategoryGrid();
    this.updateExercisesTitle('Exercises', false);
    this.clearSearch();
    this.hideSearchInput();
    this.currentPage = 1;
    this.loadCategories(this.activeFilter, this.currentPage, this.perPage);
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
    if (this.paginatorInstance) {
      this.paginatorInstance.show(); // Показуємо пагінатор категорій
    }
    if (this.paginatorExerciseInstance) {
      this.paginatorExerciseInstance.hide(); // Приховуємо пагінатор вправ
    }
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