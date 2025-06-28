import './Paginator.scss';

type LoadManagedComponentDataFunc = (
  currentPage: number,
  perPage: number,
  totalPages: number,
) => Promise<unknown>;

interface IPaginationData {
  totalPages: number;
  perPage: number;
  currentPage: number;
}

export class Paginator {
  private readonly loadManagedComponentData: LoadManagedComponentDataFunc;
  private totalPages: number;
  private currentPage: number;
  private perPage: number;

  private _mainContainer: HTMLElement;
  private pageButtons: HTMLButtonElement[] = [];
  private firstPageButton: HTMLButtonElement | null = null;
  private lastPageButton: HTMLButtonElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;

  constructor(
    mainContainer: HTMLElement,
    loadManagedComponentData: LoadManagedComponentDataFunc,
    paginationData: IPaginationData,
  ) {
    this.totalPages = paginationData.totalPages;
    this.perPage = paginationData.perPage;
    this.currentPage = paginationData.currentPage;
    this._mainContainer = mainContainer;
    this.loadManagedComponentData = loadManagedComponentData;
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

  setNewContainer(newContainer: HTMLElement) {
    this.cleanupPaginator();
    this._mainContainer = newContainer;
  }

  createPaginatorElement(): HTMLDivElement {
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
      '<svg class="paginator__arrow-icon" width="20" height="20"><use href="/sprite.svg#icon-arrow-double-left"></use></svg>';

    const singleArrowButton = document.createElement('button');
    singleArrowButton.classList.add('paginator__arrow-button');
    if (type === 'previous' && this.isFirstPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    } else if (type === 'next' && this.isLastPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    }
    singleArrowButton.innerHTML =
      '<svg class="paginator__arrow-icon" width="20" height="20"><use href="/sprite.svg#icon-arrow-left"></use></svg>';

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
    let needLeftEllipsis = this.currentPage > 3;
    let needRightEllipsis = this.currentPage < this.totalPages - 2;

    // Add ellipsis on the left if needed
    if (needLeftEllipsis) {
      const ellipsis = this.createEllipsis();
      buttons.push(ellipsis);
      needLeftEllipsis = true;
    }

    if (needLeftEllipsis && needRightEllipsis) {
      for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
        buttons.push(this.createPageButton(i));
      }
    } else if (needRightEllipsis) {
      for (let i = 1; i <= 3; i++) {
        buttons.push(this.createPageButton(i));
      }
    } else if (needLeftEllipsis) {
      for (let i = this.totalPages - 2; i <= this.totalPages; i++) {
        buttons.push(this.createPageButton(i));
      }
    } else {
      for (let i = 1; i <= this.totalPages; i++) {
        buttons.push(this.createPageButton(i));
      }
    }

    // Add ellipsis on the right if needed
    if (needRightEllipsis) {
      const ellipsis = this.createEllipsis();
      buttons.push(ellipsis);
      needRightEllipsis = true;
    }

    this.pageButtons = buttons as HTMLButtonElement[];

    return buttons;
  }

  private createPageButton(pageNumber: number): HTMLButtonElement {
    const pageButton = document.createElement('button');
    pageButton.classList.add('paginator__page-button');
    pageButton.textContent = pageNumber.toString();
    pageButton.disabled = pageNumber === this.currentPage;

    if (pageNumber === this.currentPage) {
      pageButton.classList.add('paginator__page-button--active');
    }

    return pageButton;
  }

  private createEllipsis(): HTMLSpanElement {
    const ellipsis = document.createElement('span');
    ellipsis.classList.add('paginator__ellipsis');
    ellipsis.textContent = '...';

    return ellipsis;
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

  private handleFirstPageClick = async () => {
    this.currentPage = 1;
    this.render();
    await this.reloadData();
  };

  private handlePrevClick = async () => {
    if (this.isFirstPage()) {
      return;
    }
    this.currentPage--;
    this.render();
    await this.reloadData();
  };

  private handleLastPageClick = async () => {
    this.currentPage = this.totalPages;
    this.render();
    await this.reloadData();
  };

  private handleNextClick = async () => {
    if (this.isLastPage()) {
      return;
    }
    this.currentPage++;
    this.render();
    await this.reloadData();
  };

  private handlePageClick = async (event: MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    if (target.classList.contains('paginator__page-button')) {
      const pageNumber = +target.textContent;
      if (pageNumber !== this.currentPage) {
        this.currentPage = pageNumber;
        this.render();
        await this.reloadData();
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

  private async reloadData() {
    await this.loadManagedComponentData(this.currentPage, this.perPage, this.totalPages);
  }
}
