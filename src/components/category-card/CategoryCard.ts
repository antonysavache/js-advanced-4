import './CategoryCard.scss';

interface CategoryData {
  id: string;
  name: string;
  imageUrl: string;
  filter: string;
  url: string;
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
      <div class="category-image" style="background-image: url('${this.data.imageUrl}')"></div>
      <h3 class="category-name">${this.data.name}</h3>
    `;

    card.addEventListener('click', () => {
      window.location.href = this.data.url;
    });

    return card;
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  public getFilter(): string {
    return this.data.filter;
  }
}
