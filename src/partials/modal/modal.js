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
  document.getElementById('my-exercise-img').src = data.gifUrl;
  document.getElementById('my-exercise-name').textContent = capitalizeFirstLetter(data.name);
  document.getElementById('my-target').textContent = capitalizeFirstLetter(data.target);
  document.getElementById('my-bodyPart').textContent = capitalizeFirstLetter(data.bodyPart);
  document.getElementById('my-equipment').textContent = capitalizeFirstLetter(data.equipment);
  document.getElementById('my-popularity').textContent = data.popularity;
  document.getElementById('my-calories').textContent = `${data.burnedCalories}/3 min`;
  document.getElementById('my-exercise-description').textContent = data.description;

  renderStars(data.rating);

  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const isFav = favorites.find(item => item._id === data._id);
  const favBtn = document.getElementById('my-favorite-btn');
  const favBtnText = document.getElementById('my-favorite-btn-text');
  if (isFav) {
    favBtnText.textContent = 'Remove from favorites';
    document.getElementById('my-favorite-btn-icon-add').style.display = 'none';
    document.getElementById('my-favorite-btn-icon-remove').style.display = 'block';
  } else {
    favBtnText.textContent = 'Add to favorites';
    document.getElementById('my-favorite-btn-icon-add').style.display = 'block';
    document.getElementById('my-favorite-btn-icon-remove').style.display = 'none';
  }

  favBtn.onclick = () => toggleFavorite(data);

  document.getElementById('my-exercise-modal').classList.remove('is-hidden');
}

function closeExerciseModal() {
  document.getElementById('my-exercise-modal').classList.add('is-hidden');
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  document.getElementById('my-rating-text1').textContent = `${rating.toFixed(1)}`;
  for (let index = 5; index > fullStars; index--) {
    document.getElementById(`my-stars-icon${index}`).querySelector('path').setAttribute('fill', 'rgba(244, 244, 244, 0.20)');
  }
}

function toggleFavorite(ex) {
  let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const exists = favs.find(item => item._id === ex._id);
  favs = exists ? favs.filter(f => f._id !== ex._id) : [...favs, ex];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  openExerciseModal(ex);

  if (window.location.hash === '#favorites' && window.renderFavorites) {
    window.renderFavorites(1);
  }
}

document.getElementById('my-close-modal-btn').onclick = closeExerciseModal;
document.getElementById('my-exercise-modal').addEventListener('click', e => {
  if (e.target.id === 'my-exercise-modal') closeExerciseModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeExerciseModal();
});
