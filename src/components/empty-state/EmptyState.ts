import './EmptyState.scss';

export class EmptyState {
  private container: HTMLElement;

  constructor(containerSelector: string) {
    const element = document.querySelector<HTMLElement>(containerSelector);
    if (!element) {
      console.error(`EmptyState: контейнер ${containerSelector} не знайдено`);
      throw new Error('Контейнер не знайдено');
    }
    this.container = element;
  }

  public show(message: string): void {
    this.container.innerHTML = `
      <div class="empty-state">
        <p class="empty-message">${message}</p>
      </div>
    `;
  }

  public clear(): void {
    this.container.innerHTML = '';
  }
}
