import './ExerciseGrid.scss';
import { fetchAndShowDetails } from '../../partials/modal/modal.js';

interface ExerciseData {
  name: string;
  burnedCalories: number;
  bodyPart: string;
  target: string;
  rating: number;
  _id: string;
}

export class ExerciseGrid {
  private container: HTMLElement | null;

  constructor(containerSelector: string) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error(`Контейнер для ExerciseGrid не знайдено за селектором: ${containerSelector}`);
    }
  }

  public render(exercises: ExerciseData[]): void {
    if (!this.container) {
      return;
    }

    this.container.innerHTML = '';

    if (exercises && exercises.length > 0) {
      exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.classList.add('exercise-item');

        card.innerHTML = `
            <div class="exercise-grid-header">
              <div class="exercise-grid-header-left">
                <span class="exercise-grid-workout">WORKOUT</span>
                <span class="exercise-grid-rating">${exercise.rating ? exercise.rating.toFixed(1) : 'N/A'}
                  <svg style="margin-left: 5px" width="16" height="16">
                    <use href="/sprite.svg#icon-Star-1" />
                  </svg>
                </span>
              </div>
              <button class="exercise-grid-start-btn">Start
                <svg width="16" height="16">
                  <use href="/sprite.svg#icon-arrow-ex" />
                </svg>
              </button>
            </div>
            <div class="exercise-grid-body">
              <div class="run-icon">
                <svg width="16" height="16">
                  <use href="/sprite.svg#icon-run" />
                </svg>
              </div>
              <h3 class="exercise-grid-title">${exercise.name}</h3>
            </div>
            <div class="exercise-grid-footer">
              <p class="calories-info">Burned calories: <span class="exercise-grid-value">${exercise.burnedCalories} / 3 min</span></p>
              <p class="bodypart-info">Body part: <span class="exercise-grid-value">${exercise.bodyPart}</span></p>
              <p class="target-info">Target: <span class="exercise-grid-value">${exercise.target}</span></p>
            </div>
        `;

        const startButton = card.querySelector('.exercise-grid-start-btn');
        startButton.addEventListener('click', () => {
          fetchAndShowDetails(exercise._id);
        });

        this.container.appendChild(card);
      });
    } else {
      this.container.innerHTML =
        '<p class="empty-state-message-custom">Вправи за цією категорією не знайдено.</p>';
    }
  }

  public setLoading(): void {
    if (this.container) {
      this.container.innerHTML = '<p class="loading-message-custom">Завантаження вправ...</p>';
    }
  }

  public showError(message: string): void {
    if (this.container) {
      this.container.innerHTML = `<p class="error-message-custom">${message}</p>`;
    }
  }

  public show(): void {
    if (this.container) {
      this.container.style.display = 'grid';
    }
  }

  public hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
}
