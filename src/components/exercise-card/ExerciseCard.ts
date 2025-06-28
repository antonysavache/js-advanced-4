import './ExerciseCard.scss';
import { Modal } from '../modal/Modal.ts';

interface ExerciseData {
  name: string;
  calories: number;
  bodyPart: string;
  target: string;
  rating: number;
}

export class ExerciseCard {
  private data: ExerciseData;
  private readonly element: HTMLElement;

  constructor(data: ExerciseData) {
    this.data = data;
    this.element = this.createCard();
  }

  private createCard(): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('exercise-card');
    card.innerHTML = `
    <span class="exercise-label">WORKOUT</span>

    <div class="exercise-rating">
      ${this.data.rating} 
      <span class="exercise-star">
        <svg style="margin-left: 5px" width="16" height="16">
          <use href="/src/images/sprite.svg#icon-Star-1" />
        </svg>
      </span>
    </div>

    <button class="exercise-start-btn">
      Start
      <svg class="arrow-icon" width="16" height="16">
        <use xlink:href="#icon-arrow-right"></use>
      </svg>
    </button>

    <div class="exercise-content">
      <div class="runner-icon">
        <svg width="14" height="16">
          <use xlink:href="#icon-run-man"></use>
        </svg>
      </div>

      <div class="exercise-text">
        <h3 class="exercise-name">${this.data.name}</h3>

        <div class="exercise-info-line">
          <span class="info-label">Burned calories:</span>
          <span class="info-value">${this.data.calories} / 3 min</span>
          <span class="info-label">Body part:</span>
          <span class="info-value">${this.data.bodyPart}</span>
          <span class="info-label">Target:</span>
          <span class="info-value">${this.data.target}</span>
        </div>
      </div>
    </div>
  `;

    card.addEventListener('click', () => {
      this.showExerciseModal();
    });

    const startBtn = card.querySelector('.exercise-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.startExercise();
      });
    }

    return card;
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  private startExercise(): void {
    console.warn(`Починаємо вправу: ${this.data.name}`);
    // todo: Тут можна вставити реальну логіку запуску вправи
  }

  private showExerciseModal(): void {
    const modal = new Modal();
    modal.open(`
    <div class="exercise-modal-content">
      <h2>${this.data.name}</h2>
      <p>Burned calories: ${this.data.calories} ккал за 3 хв</p>
      <p>Body part: ${this.data.bodyPart}</p>
      <p>Target: ${this.data.target}</p>
      <p>Rating: ${this.data.rating} ⭐</p>
      <button class="exercise-start-btn">Start</button>
    </div>
  `);
  }
}
