import './Quote.scss';
import { YourEnergyAPI } from '../../api';
import { type Quote as QuoteModel } from '../../api/api.interface';

interface QuoteData {
  quote: string;
  author: string;
  date: string;
}

export class Quote {
  private readonly container: HTMLElement | null;
  private storageKey: string = 'daily-quote';

  constructor(containerSelector: string) {
    this.container = document.querySelector<HTMLElement>(containerSelector);

    if (!this.container) {
      console.error(`Quote component: контейнер ${containerSelector} не найден`);

      return;
    }

    this.init();
  }

  private init(): void {
    const cached = this.getCachedQuote();
    const today = this.getTodayDate();

    if (cached && cached.date === today) {
      this.render(cached.quote, cached.author);
    } else {
      this.getQuote();
    }
  }

  private getCachedQuote(): QuoteData | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as QuoteData;
    } catch {
      return null;
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getQuote(): void {
    YourEnergyAPI.getQuote()
      .then((quote: QuoteModel) => {
        const today = this.getTodayDate();
        const quoteData: QuoteData = {
          quote: quote.quote,
          author: quote.author,
          date: today,
        };

        this.render(quote.quote, quote.author);
        localStorage.setItem(this.storageKey, JSON.stringify(quoteData));
      })
      .catch(err => {
        console.warn('Ошибка загрузки цитаты, используется дефолт', err);
        this.render("Здоров'я — це не все, але без нього все — ніщо.", 'Сократ');
      });
  }

  private render(quote: string, author: string): void {
    if (!this.container) {
      return;
    }

    this.container.innerHTML = `
      <div class="quote-block">
<!--        <div class="quote-content">-->
          <div class="quote-header">
            <div class="quote-icon">
              <img src="images/running-man/run-man.png" 
                  srcset="images/running-man/run-man.png 1x, 
                          images/running-man/run-man@2x.png 2x, 
                          images/running-man/run-man@3x.png 3x" 
                  alt="icon" 
              />
            </div>
            <h2 class="quote-title">Quote of the day</h2>
            <div class="quote-decor">
              <svg class="icon">
                <use xlink:href="sprite.svg#inverted-commas"></use>
              </svg>
            </div>
          </div>
          <div class="quote-textual">${quote}</div>
          <div class="quote-author">${author}</div>
<!--        </div>-->
      </div>
    `;
  }
}
