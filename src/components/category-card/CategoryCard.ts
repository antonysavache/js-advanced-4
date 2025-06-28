import './CategoryCard.scss';
import { YourEnergyAPI } from '../../api';
import { ExerciseGrid } from '../exercise-grid/ExerciseGrid.ts';

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
  private exerciseGridInstance: ExerciseGrid;
  private homePageController: any;

  constructor(data: CategoryData, homePageController: any) {
    this.data = data;
    this.element = this.createCard();
    this.exerciseGridInstance = new ExerciseGrid('#exercise-container');
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
      const filterToParam: { [key: string]: string } = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Muscles: 'muscles',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Body parts': 'bodypart',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Equipment: 'equipment',
      };

      const paramName = filterToParam[this.data.filter];
      const exerciseParams = {
        page: 1,
        limit: 12,
        [paramName]: this.data.name,
      };

      const categoryGrid = document.getElementById('category-grid');
      if (categoryGrid) {
        categoryGrid.style.display = 'none';
      }
      this.exerciseGridInstance.setLoading();
      this.exerciseGridInstance.show();

      if (this.homePageController) {
        this.homePageController.updateExercisesTitle(this.data.name, true);
      }

      const response = await YourEnergyAPI.getExercises(exerciseParams);
      const exercises = response.results;

      if (exercises && exercises.length) {
        exercises.forEach(exerciseData => {
          if (!exerciseData.gifUrl) {
            console.warn(
              `Вправа "${exerciseData.name}" не має "gifUrl". Зображення може не відображатися.`,
            );
          }
        });
        this.exerciseGridInstance.render(exercises);
      } else {
        this.exerciseGridInstance.showError('Вправи за цією категорією не знайдено.');
      }
    } catch (error: unknown) {
      console.warn('Вправи не знайдено або сталася помилка:', error);
      this.exerciseGridInstance.showError('Помилка завантаження вправ. Спробуйте пізніше.');
    }
  }
}
