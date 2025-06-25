class HomePageController {
  constructor() {
    this.activeFilter = 'muscles';
    this.loading = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setDefaultFilter();
    this.initQuote();
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
    this.setActiveFilter('muscles');
  }

  async loadCategories(filter) {
    try {
      this.loading = true;

      const filterMap = {
        muscles: 'Muscles',
        bodyparts: 'Body_parts',
        equipment: 'Equipment',
      };

      const apiFilter = filterMap[filter];
      const response = await window.YourEnergyAPI.getFilters(apiFilter, 1, 12);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      this.loading = false;
    }
  }

  initQuote() {
    // Initialize Quote component for all device versions
    const selectors = [
      '#quote-container',              // mobile version
      '.tablet-only .quote-section',   // tablet version  
      '.desktop-only .quote-section'   // desktop version
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

window.addEventListener('load', () => {
  new HomePageController();
});
