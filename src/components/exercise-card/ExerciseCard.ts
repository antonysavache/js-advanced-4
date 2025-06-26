import './ExerciseCard.scss';

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
      <h3 class="exercise-name">${this.data.name}</h3>
      <p class="exercise-info">Калорії: ${this.data.calories} ккал за 3 хв</p>
      <p class="exercise-info">Частина тіла: ${this.data.bodyPart}</p>
      <p class="exercise-info">Мета: ${this.data.target}</p>
      <p class="exercise-info">Рейтинг: ${this.data.rating} ⭐</p>
      <button class="exercise-start-btn">Start</button>
    `;

    const startBtn = card.querySelector('.exercise-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
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
}
