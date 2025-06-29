const QUOTE_KEY = 'yourEnergyQuote1';
const QUOTE_DATE_KEY = 'yourEnergyQuoteDate1';
import axios from 'axios';

const BACKEND_HOST = 'https://your-energy.b.goit.study/api';
axios.defaults.baseURL = BACKEND_HOST;

export async function renderQuote() {
  const today = new Date().toLocaleDateString();
  const savedDate = localStorage.getItem(QUOTE_DATE_KEY);
  const savedQuote = localStorage.getItem(QUOTE_KEY);
  const quoteDiv = document.getElementById('my-quote');

  if (savedDate === today && savedQuote) {
    quoteDiv.innerHTML = savedQuote;
    return;
  }

  try {
    const { data } = await axios.get(`/quote`);

    const html = `<div class="my-quote-card">"${data.quote}"<p class="my-quote-card-author">${data.author}</p></div>`;
    localStorage.setItem(QUOTE_KEY, html);
    localStorage.setItem(QUOTE_DATE_KEY, today);
    quoteDiv.innerHTML = html;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
  }
}
