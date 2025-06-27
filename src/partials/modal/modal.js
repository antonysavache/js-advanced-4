import axios from 'axios';

const BACKEND_HOST = 'https://your-energy.b.goit.study/api';
axios.defaults.baseURL = BACKEND_HOST;

const FAVORITES_KEY = 'yourEnergyFavorites';

export async function fetchAndShowDetails(id) {
  try {
    const { data } = await axios.get(`/exercises/${id}`);
    openExerciseModal(data);
  } catch (error) {
    console.error('Failed to fetch exercise details:', error);
  }
}

function capitalizeFirstLetter(string) {
  if (string && string.charAt(0)) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}

function openExerciseModal(data) {
  document.getElementById('exercise-img').src = data.gifUrl;
  document.getElementById('exercise-name').textContent = capitalizeFirstLetter(data.name);
  document.getElementById('target').textContent = capitalizeFirstLetter(data.target);
  document.getElementById('bodyPart').textContent = capitalizeFirstLetter(data.bodyPart);
  document.getElementById('equipment').textContent = capitalizeFirstLetter(data.equipment);
  document.getElementById('popularity').textContent = data.popularity;
  document.getElementById('calories').textContent = `${data.burnedCalories}/3 min`;
  document.getElementById('exercise-description').textContent = data.description;

  renderStars(data.rating);

  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const isFav = favorites.find(item => item._id === data._id);
  const favBtn = document.getElementById('favorite-btn');
  const favBtnText = document.getElementById('favorite-btn-text');
  if (isFav) {
    favBtnText.textContent = 'Remove from favorites';
    document.getElementById('favorite-btn-icon-add').style.display = 'none';
    document.getElementById('favorite-btn-icon-remove').style.display = 'block';
  } else {
    favBtnText.textContent = 'Add to favorites';
    document.getElementById('favorite-btn-icon-add').style.display = 'block';
    document.getElementById('favorite-btn-icon-remove').style.display = 'none';
  }

  favBtn.onclick = () => toggleFavorite(data);

  document.getElementById('exercise-modal').classList.remove('is-hidden');
}

function closeExerciseModal() {
  document.getElementById('exercise-modal').classList.add('is-hidden');
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  document.getElementById('rating-text1').textContent = `${rating.toFixed(1)}`;
  for (let index = 5; index > fullStars; index--) {
    document.getElementById(`stars-icon${index}`).querySelector('path').setAttribute('fill', 'rgba(244, 244, 244, 0.20)');
  }
}

function toggleFavorite(ex) {
  let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const exists = favs.find(item => item._id === ex._id);
  favs = exists ? favs.filter(f => f._id !== ex._id) : [...favs, ex];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  openExerciseModal(ex); // перерендер кнопки
}

// Event Listeners для закриття модалки
document.getElementById('close-modal-btn').onclick = closeExerciseModal;
document.getElementById('exercise-modal').addEventListener('click', e => {
  if (e.target.id === 'exercise-modal') closeExerciseModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeExerciseModal();
});
