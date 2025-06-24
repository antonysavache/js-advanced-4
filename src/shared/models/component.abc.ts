export interface IComponent {
  // Elements init
  initializeElements(): void;

  // Subscribe and unsubscribe events
  bindEvents(): void;
  removeEvents(): void;

  // entry point
  // for extra logic of our component
  // - API calls
  // - JS animation
  // - Calculate something

  onReady(): void;
}

export abstract class BaseComponent extends HTMLElement implements IComponent {
  constructor(template: string) {
    super();
    this.innerHTML = template;
  }

  // Browser requested methods
  connectedCallback(): void {
    this.initializeElements();
    this.bindEvents();
  }

  disconnectedCallback(): void {
    this.removeEvents();
  }

  // Abstract methods that should be realized
  abstract initializeElements(): void;
  abstract bindEvents(): void;
  abstract removeEvents(): void;
  abstract onReady(): void;
}
