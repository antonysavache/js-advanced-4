import './CategoryCard.scss';
import { YourEnergyAPI } from '../../api';
import { ExerciseCard } from '../exercise-card/ExerciseCard.ts';

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
      const filterToParam = {
        Muscles: 'muscles',
        'Body parts': 'bodypart',
        Equipment: 'equipment',
      };

      const paramName = filterToParam[this.data.filter];
      const exerciseParams = {
        page: 1,
        limit: 12,
        [paramName]: this.data.name,
      };

      const response = await YourEnergyAPI.getExercises(exerciseParams);

      const exercises = response.results;
      const container = document.getElementById('exercise-container');

      if (!container) {
        console.error('Контейнер для вправ не знайдено');

        return;
      }

      container.innerHTML = '';

      if (exercises && exercises.length) {
        exercises.forEach(exerciseData => {
          const card = new ExerciseCard({
            name: exerciseData.name,
            calories: exerciseData.burnedCalories,
            bodyPart: exerciseData.bodyPart,
            target: exerciseData.target,
            rating: exerciseData.rating,
          });

          card.render(container);
        });
      } else {
        this.renderEmptyState(container);
      }
    } catch (error: unknown) {
      const container = document.getElementById('exercise-container');
      if (!container) {
        return;
      }

      container.innerHTML = '';
      this.renderEmptyState(container);

      console.warn('Вправи не знайдено або сталася помилка:', error);
    }
  }

  private renderEmptyState(container: HTMLElement): void {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state');
    emptyState.textContent = 'На жаль, вправи за цією категорією не знайдено.';
    container.appendChild(emptyState);
  }
}
