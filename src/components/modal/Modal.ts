import './Modal.scss';

export class Modal {
  private readonly container: HTMLElement;

  constructor() {
    this.container = this.createModal();
    document.body.appendChild(this.container);
    this.addEventListeners();
  }

  private createModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.classList.add('modal-backdrop');
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Закрити">&times;</button>
        <div class="modal-body"></div>
      </div>
    `;
    modal.style.display = 'none';

    return modal;
  }

  private addEventListeners(): void {
    this.container.addEventListener('click', e => {
      if (
        e.target === this.container ||
        (e.target as HTMLElement).classList.contains('modal-close')
      ) {
        this.close();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  public open(contentHtml: string): void {
    const body = this.container.querySelector('.modal-body');
    if (body) {
      body.innerHTML = contentHtml;
    }
    this.container.style.display = 'flex';
  }

  public close(): void {
    this.container.style.display = 'none';
  }
}
