import './Paginator.scss';

export interface IPaginationData {
  totalPages: number;
  perPage: number;
  currentPage: number;
}

export class Paginator {
  private static newPaginatorId: number = 1;
  private paginatorId: number = Paginator.newPaginatorId++;
  private totalPages: number;
  private currentPage: number;
  // private perPage: number;

  private _mainContainer: HTMLElement;
  private pageButtons: HTMLButtonElement[] = [];
  private firstPageButton: HTMLButtonElement | null = null;
  private lastPageButton: HTMLButtonElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;

  constructor(mainContainer: HTMLElement, paginationData: IPaginationData) {
    this.totalPages = paginationData.totalPages;
    // this.perPage = paginationData.perPage;
    this.currentPage = paginationData.currentPage;
    this._mainContainer = mainContainer;
  }

  render() {
    this.cleanupPaginator();
    const paginator = this.createPaginatorElement();
    this.mainContainer.appendChild(paginator);
    this.addEventListeners();
  }

  get mainContainer(): HTMLElement {
    return this._mainContainer;
  }

  public setNewContainer(newContainer: HTMLElement) {
    this.cleanupPaginator();
    this._mainContainer = newContainer;
  }

  private createPaginatorElement(): HTMLDivElement {
    const paginatorElement = document.createElement('div');
    paginatorElement.className = 'paginator';

    paginatorElement.appendChild(this.createPagesBlock());
    if (this.totalPages > 3) {
      paginatorElement.prepend(this.createPrevOrNextBlock('previous'));
      paginatorElement.appendChild(this.createPrevOrNextBlock('next'));
    }

    return paginatorElement;
  }

  private createPrevOrNextBlock(type: 'previous' | 'next'): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add(`paginator__${type}-container`);

    const doubleArrowButton = document.createElement('button');
    doubleArrowButton.classList.add('paginator__arrow-button');
    if (type === 'previous' && this.isFirstPage()) {
      doubleArrowButton.classList.add('paginator__arrow-button--disabled');
    } else if (type === 'next' && this.isLastPage()) {
      doubleArrowButton.classList.add('paginator__arrow-button--disabled');
    }
    doubleArrowButton.innerHTML =
      '<svg class="paginator__arrow-icon" width="20" height="20"><use href="/public/sprite.svg#icon-arrow-double-left"></use></svg>';

    const singleArrowButton = document.createElement('button');
    singleArrowButton.classList.add('paginator__arrow-button');
    if (type === 'previous' && this.isFirstPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    } else if (type === 'next' && this.isLastPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    }
    singleArrowButton.innerHTML =
      '<svg class="paginator__arrow-icon" width="20" height="20"><use href="/public/sprite.svg#icon-arrow-left"></use></svg>';

    if (type === 'previous') {
      container.appendChild(doubleArrowButton);
      container.appendChild(singleArrowButton);
    } else {
      container.appendChild(singleArrowButton);
      container.appendChild(doubleArrowButton);
    }

    if (type === 'previous') {
      this.prevButton = singleArrowButton;
      this.firstPageButton = doubleArrowButton;
    } else {
      this.nextButton = singleArrowButton;
      this.lastPageButton = doubleArrowButton;
    }

    return container;
  }

  private createPagesBlock(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('paginator__pages-container');
    container.append(...this.createPageButtons());

    return container;
  }

  private createPageButtons(): HTMLElement[] {
    const buttons: HTMLElement[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.classList.add('paginator__ellipsis');
        ellipsis.innerText = '...';
        buttons.push(ellipsis);
        break;
      }
      const pageElement = document.createElement('button');
      pageElement.classList.add('paginator__page-button');
      pageElement.id = `paginator__page-button_${this.paginatorId}`;
      if (i === this.currentPage) {
        pageElement.classList.add('paginator__page-button--active');
      }
      pageElement.textContent = i.toString();
      pageElement.disabled = i === this.currentPage;
      buttons.push(pageElement);
    }
    this.pageButtons = buttons as HTMLButtonElement[];

    return buttons;
  }

  private isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  private isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  private addEventListeners() {
    this.firstPageButton?.addEventListener('click', this.handleFirstPageClick);
    this.prevButton?.addEventListener('click', this.handlePrevClick);
    this.lastPageButton?.addEventListener('click', this.handleLastPageClick);
    this.nextButton?.addEventListener('click', this.handleNextClick);
    this.pageButtons.forEach(button => {
      button.addEventListener('click', this.handlePageClick);
    });
  }

  private cleanupEventListeners() {
    this.firstPageButton?.removeEventListener('click', this.handleFirstPageClick);
    this.prevButton?.removeEventListener('click', this.handlePrevClick);
    this.lastPageButton?.removeEventListener('click', this.handleLastPageClick);
    this.nextButton?.removeEventListener('click', this.handleNextClick);
    this.pageButtons.forEach(button => {
      button.removeEventListener('click', this.handlePageClick);
    });
  }

  private handleFirstPageClick = () => {
    this.currentPage = 1;
    this.render();
  };

  private handlePrevClick = () => {
    if (this.isFirstPage()) {
      return;
    }
    this.currentPage--;
    this.render();
  };

  private handleLastPageClick = () => {
    this.currentPage = this.totalPages;
    this.render();
  };

  private handleNextClick = () => {
    if (this.isLastPage()) {
      return;
    }
    this.currentPage++;
    this.render();
  };

  private handlePageClick = (event: MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    if (target.classList.contains('paginator__page-button')) {
      const pageNumber = +target.textContent;
      if (pageNumber !== this.currentPage) {
        this.currentPage = pageNumber;
        this.render();
      }
    }
  };

  private cleanupPaginator() {
    this.cleanupEventListeners();
    this.pageButtons = [];
    this.firstPageButton = null;
    this.lastPageButton = null;
    this.prevButton = null;
    this.nextButton = null;
    this._mainContainer.innerHTML = '';
  }
}
