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
  private _isVisible: boolean = true;

  private _mainContainer: HTMLElement;
  private _paginatorElement: HTMLDivElement | null = null;
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

  render(
    page: number = this.currentPage,
    perPage: number = this.perPage,
    totalPages: number = this.totalPages,
  ) {
    this.destroy();
    this.currentPage = page;
    this.perPage = perPage;
    if (totalPages || totalPages === 0) {
      this.totalPages = totalPages;
    }

    if (this.totalPages === 0) {
      this.hide();
      return;
    } else {
      this.show();
    }

    const paginator = this.createPaginatorElement();
    this._paginatorElement = paginator;
    this.mainContainer.appendChild(paginator);
    this.addEventListeners();
  }

  get mainContainer(): HTMLElement {
    return this._mainContainer;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  get paginatorElement(): HTMLDivElement | null {
    return this._paginatorElement;
  }

  setNewContainer(newContainer: HTMLElement) {
    this.destroy();
    this._mainContainer = newContainer;
  }

  destroy() {
    this.cleanupEventListeners();
    if (this._paginatorElement) {
      this._mainContainer.removeChild(this._paginatorElement);
    }
    this.pageButtons = [];
    this.firstPageButton = null;
    this.lastPageButton = null;
    this.prevButton = null;
    this.nextButton = null;
    this._paginatorElement = null;
  }

  hide() {
    if (this._paginatorElement) {
      this._paginatorElement.style.display = 'none';
      this._isVisible = false;
    }
  }

  show() {
    if (this._paginatorElement) {
      this._paginatorElement.style.display = '';
      this._isVisible = true;
    }
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
      `<svg class="paginator__arrow-icon" width="20" height="20"><use href="/public/sprite.svg#icon-arrow-double-left"></use></svg>`;

    const singleArrowButton = document.createElement('button');
    singleArrowButton.classList.add('paginator__arrow-button');
    if (type === 'previous' && this.isFirstPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    } else if (type === 'next' && this.isLastPage()) {
      singleArrowButton.classList.add('paginator__arrow-button--disabled');
    }
    singleArrowButton.innerHTML =
      `<svg class="paginator__arrow-icon" width="20" height="20"><use href="/public/sprite.svg#icon-arrow-${type === 'previous' ? 'left' : 'right'}"></use></svg>`;

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
    const visibleRange = 3;

    let start = 1;
    let end = this.totalPages;
    let showEllipsisLeft = false;
    let showEllipsisRight = false;

    if (this.totalPages > visibleRange + 2) {
        if (this.currentPage <= Math.ceil(visibleRange / 2) + 1) {
            end = visibleRange;
            showEllipsisRight = true;
        } else if (this.currentPage >= this.totalPages - Math.floor(visibleRange / 2)) {
            start = this.totalPages - visibleRange + 1;
            end = this.totalPages;
            showEllipsisLeft = true;
        } else {
            start = this.currentPage - Math.floor(visibleRange / 2);
            end = this.currentPage + Math.floor(visibleRange / 2);
            showEllipsisLeft = true;
            showEllipsisRight = true;
        }
    }

    if (showEllipsisLeft) {
        buttons.push(this.createPageButton(1));
        if (start > 2) {
            buttons.push(this.createEllipsis());
        }
    }

    for (let i = start; i <= end; i++) {
        buttons.push(this.createPageButton(i));
    }

    if (showEllipsisRight) {
        if (end < this.totalPages - 1) {
            buttons.push(this.createEllipsis());
        }
        buttons.push(this.createPageButton(this.totalPages));
    }

    this.pageButtons = buttons as HTMLButtonElement[];
    return buttons;
  }

  private createPageButton(pageNumber: number): HTMLButtonElement {
    const pageButton = document.createElement('button');
    pageButton.classList.add('paginator__page-button');
    pageButton.textContent = pageNumber.toString();
    pageButton.disabled = (pageNumber === this.currentPage);

    // Використовуємо порівняння як рядки для додавання класу, щоб уникнути потенційних проблем з типами
    if (String(pageNumber) === String(this.currentPage)) {
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
    await this.reloadData();
  };

  private handlePrevClick = async () => {
    if (this.isFirstPage()) {
      return;
    }
    this.currentPage--;
    await this.reloadData();
  };

  private handleLastPageClick = async () => {
    this.currentPage = this.totalPages;
    await this.reloadData();
  };

  private handleNextClick = async () => {
    if (this.isLastPage()) {
      return;
    }
    this.currentPage++;
    await this.reloadData();
  };

  private handlePageClick = async (event: MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    if (target.classList.contains('paginator__page-button')) {
      const pageNumber = +target.textContent;
      if (pageNumber !== this.currentPage) {
        this.currentPage = pageNumber;
        await this.reloadData();
      }
    }
  };

  private async reloadData() {
    await this.loadManagedComponentData(this.currentPage, this.perPage, this.totalPages);
    this.render(this.currentPage, this.perPage, this.totalPages);
  }
}