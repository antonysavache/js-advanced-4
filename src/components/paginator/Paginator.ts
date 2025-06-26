import './Paginator.scss';

export class Paginator {
  private totalPages: number;
  private currentPage: number;
  private perPage: number;
  private totalItems: number;
  private onPageChangeCallback: (page: number, limit: number) => void;

  constructor(
    totalItems: number,
    perPage: number,
    currentPage: number,
    onPageChangeCallback: (page: number, limit: number) => void,
  ) {
    this.totalItems = totalItems;
    this.perPage = perPage;
    this.currentPage = currentPage;
    this.totalPages = Math.ceil(totalItems / perPage);
    this.onPageChangeCallback = onPageChangeCallback;
  }

  render(container: HTMLElement) {
    container.innerHTML = ''; // Clear previous content

    const paginatorElement = document.createElement('div');
    paginatorElement.className = 'paginator';

    // Previous Block: Single and Double Arrow Buttons
    const prevBlock = `
    <div class="paginator__previous-container">
        <button class="paginator__arrow-button" ${this.isFirstPage() ? 'disabled' : ''} data-action="first">
          <svg class="paginator__arrow-icon" width="20" height="20">
            <use href="src/images/sprite.svg#icon-arrow-double-left"></use>
          </svg>
        </button>
        <button class="paginator__arrow-button" ${this.isFirstPage() ? 'disabled' : ''} data-action="prev">
          <svg class="paginator__arrow-icon" width="20" height="20">
            <use href="src/images/sprite.svg#icon-arrow-left"></use>
          </svg>
        </button>
    </div>
      `;

    // Next Block: Single and Double Arrow Buttons
    const nextBlock = `
    <div class="paginator__next-container">
        <button class="paginator__arrow-button" ${this.isLastPage() ? 'disabled' : ''} data-action="next">
          <svg class="paginator__arrow-icon" width="20" height="20">
            <use href="src/images/sprite.svg#icon-arrow-left"></use>
          </svg>
        </button>
        <button class="paginator__arrow-button" ${this.isLastPage() ? 'disabled' : ''} data-action="last">
          <svg class="paginator__arrow-icon" width="20" height="20">
            <use href="src/images/sprite.svg#icon-arrow-double-left"></use>
          </svg>
        </button>
    </div>
      `;

    // Combine the blocks with page info
    paginatorElement.innerHTML = `
        ${prevBlock}
        <div class="paginator__pages-container">
          ${this.createPageButtons()
            .map(button => button.outerHTML)
            .join('')}
        </div>
        ${nextBlock}
      `;

    // Append the paginator to the container
    container.appendChild(paginatorElement);
  }

  private changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) {
      return;
    }

    this.currentPage = newPage;
  }

  private isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  private isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  private createPageButtons(): HTMLElement[] {
    const buttons: HTMLElement[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.innerText = '...';
        buttons.push(ellipsis);
        break;
      }
      const pageElement = document.createElement('button');
      pageElement.classList.add('paginator__page-button');
      if (i === this.currentPage) {
        pageElement.classList.add('paginator__page-button--active');
      }
      pageElement.innerText = i.toString();
      pageElement.disabled = i === this.currentPage;
      buttons.push(pageElement);
    }

    return buttons;
  }
}
