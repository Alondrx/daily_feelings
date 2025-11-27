document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feelingForm');
  const cardsDiv = document.getElementById('cards');
  const dateInput = document.getElementById('date');

  // Fecha de hoy por defecto
  dateInput.value = new Date().toISOString().split('T')[0];

  function getMoodColor(mood) {
    const colors = {
      'Feliz': '#FFD700', 'Triste': '#87CEEB', 'Enojado': '#FF6347',
      'Calmado': '#98FB98', 'Emocionado': '#FF69B4', 'Ansioso': '#DDA0DD'
    };
    return colors[mood] || '#ccc';
  }

  function loadCards() {
    const cards = JSON.parse(localStorage.getItem('feelingCards') || '[]');
    cardsDiv.innerHTML = '';
    cards.forEach((card, i) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.style.borderLeftColor = getMoodColor(card.mood);
      div.innerHTML = `
        <button class="delete-btn" onclick="deleteCard(${i})">X</button>
        <h3><span class="mood">${card.mood}</span> ${card.date}</h3>
        <p>${card.notes.replace(/\n/g, '<br>')}</p>
      `;
      cardsDiv.appendChild(div);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const card = {
      date: dateInput.value,
      mood: document.getElementById('mood').value,
      notes: document.getElementById('notes').value
    };
    const cards = JSON.parse(localStorage.getItem('feelingCards') || '[]');
    cards.push(card);
    localStorage.setItem('feelingCards', JSON.stringify(cards));
    form.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
    loadCards();
  });

  window.deleteCard = index => {
    const cards = JSON.parse(localStorage.getItem('feelingCards') || '[]');
    cards.splice(index, 1);
    localStorage.setItem('feelingCards', JSON.stringify(cards));
    loadCards();
  };

  loadCards();
});