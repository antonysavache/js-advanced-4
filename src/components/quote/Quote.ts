import './Quote.scss';

interface QuoteData {
  quote: string;
  author: string;
  date: string;
}

export class Quote {
  private readonly container: HTMLElement | null;
  private apiUrl: string = 'https://your-energy.b.goit.study/quote';
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
      this.fetchQuote();
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

  private fetchQuote(): void {
    fetch(this.apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Ошибка: ${res.status}`);
        }

        return res.json();
      })
      .then((data: { quote: string; author: string }) => {
        const today = this.getTodayDate();
        const quoteData: QuoteData = {
          quote: data.quote,
          author: data.author,
          date: today,
        };

        this.render(data.quote, data.author);
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
      <div class="quote-block p-4 rounded-2xl shadow">
        <p class="text-xl font-semibold mb-2">"${quote}"</p>
        <p class="text-sm text-gray-600 mb-4">— ${author}</p>
        <div class="text-sm text-gray-800">
          Щоденне заняття спортом: <strong>110 хвилин</strong>
        </div>
      </div>
    `;
  }
}
