import './CategoryCard.scss';

interface CategoryData {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id: string;
  name: string;
  imgURL: string;
  filter: string;
}

export class CategoryCard {
  private data: CategoryData;
  private readonly element: HTMLElement;

  constructor(data: CategoryData) {
    this.data = data;
    this.element = this.createCard();
  }

  private createCard(): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('category-card');

    card.innerHTML = `
      <div class="category-image" style="background-image: url('${this.data.imgURL}')">
        <div class="category-overlay">
          <h3 class="category-name">${this.data.name}</h3>
          <p class="category-filter">${this.data.filter}</p>
        </div>
      </div>
    `;

    return card;
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.element);
  }
}
