import 'modern-normalize/modern-normalize.css';
import './styles/main.scss';
import './components';
import { Quote } from './components/quote/Quote';
import { Modal } from './components/modal/Modal';
import { EmptyState } from './components/empty-state/EmptyState';
import { ExerciseCard } from './components/exercise-card/ExerciseCard';
import { CategoryCard } from './components/category-card/CategoryCard';
import { YourEnergyAPI } from './api/your-energy-api.ts';
(window as any).YourEnergyAPI = YourEnergyAPI;

const modal = new Modal();
const emptyState = new EmptyState('#empty-container');
const exerciseContainer = document.getElementById('exercise-container');
const categoryContainer = document.getElementById('category-container');

document.addEventListener('DOMContentLoaded', () => {
    new Quote('#quote-container');
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('open-modal-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            modal.open('<h2>Детальна інформація про вправу</h2><p>Текст всередині модалки.</p>');
        });
    }
});

fetch('/api/categories')
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            emptyState.show('Категорії не знайдено.');
        } else {
            emptyState.clear();
            // todo: логіка рендера категорій
        }
    })
    .catch(() => {
        emptyState.show('Сталася помилка при завантаженні даних');
    });

if (exerciseContainer) {
    const card = new ExerciseCard({
        name: 'Присідання',
        calories: 50,
        bodyPart: 'Ноги',
        target: 'Сила',
        rating: 4.5,
    });

    card.render(exerciseContainer);
}

if (categoryContainer) {
    const category = new CategoryCard({
        id: '1',
        name: 'Кардіо',
        imageUrl: 'https://example.com/images/cardio.jpg',
        filter: 'body',
        url: '/exercises/cardio',
    });

    category.render(categoryContainer);
}
