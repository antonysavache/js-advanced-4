import './CategoryCard.scss';
import { ExerciseGrid } from '../exercise-grid/ExerciseGrid.ts';

declare global {
  interface Window {
    exerciseGrid: ExerciseGrid;
    homePageController: any;
  }
}

interface CategoryData {
  _id: string;
  name: string;
  imgURL: string;
  filter: string;
}

export class CategoryCard {
  private data: CategoryData;
  private readonly element: HTMLElement;
  private exerciseGridInstance: ExerciseGrid;
  private homePageController: any;

  constructor(data: CategoryData, homePageController: any) {
    this.data = data;
    this.element = this.createCard();
    this.exerciseGridInstance = window.exerciseGrid;
    this.homePageController = homePageController;
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

    card.addEventListener('click', () => {
      this.handleCategoryClick().catch(error => {
        console.error('Помилка під час обробки кліку по категорії:', error);
      });
    });

    return card;
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  private async handleCategoryClick(): Promise<void> {
    try {
      const categoryGrid = document.getElementById('category-grid');
      if (categoryGrid) {
        categoryGrid.style.display = 'none';
      }
      this.exerciseGridInstance.setLoading();
      this.exerciseGridInstance.show();

      if (this.homePageController) {
        this.homePageController.updateExercisesTitle(this.data.name, true);
        // Тепер викликаємо loadExercises замість displayExercises
        await this.homePageController.loadExercises(this.data.name, 1, 12, '');
      }
    } catch (error: unknown) {
      console.warn('Вправи не знайдено або сталася помилка:', error);
      this.exerciseGridInstance.showError('Помилка завантаження вправ. Спробуйте пізніше.');
    }
  }
}
