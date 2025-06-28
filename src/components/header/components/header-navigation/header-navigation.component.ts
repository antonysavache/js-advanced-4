import navigationTemplate from './header-navigation.component.html?raw';
import './header-navigation.component.scss';
import { BaseComponent } from '../../../../shared/models/component.abc.ts';

export class HeaderNavigationComponent extends BaseComponent {
  constructor() {
    super(navigationTemplate);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeElements(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  bindEvents(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeEvents(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReady(): void {}
}

customElements.define('app-header-navigation', HeaderNavigationComponent);
