

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  async function checkAuth() {
    try {
      const res = await fetch('auth_check.php', { cache: 'no-store' });
      const text = (await res.text()).trim();
      return text === 'authenticated';
    } catch (e) {
      console.error('Auth check failed:', e);
      return false;
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', async (e) => {
      e.preventDefault();

      const isLoggedIn = await checkAuth();
      if (!isLoggedIn) {
        window.location.href = 'register.html';
        return;
      }

      // Open booking modal via helper in com.js
      if (typeof window.openBookingFromCard === 'function') {
        window.openBookingFromCard(card);
      } else {
        // Fallback if helper not loaded for some reason
        const destination = card.querySelector('.Dest')?.textContent.trim() || '';
        const priceElement = card.querySelector('.price');
        const m = (priceElement?.textContent || '').match(/\d+\s*days/);
        const duration = m ? m[0] : '';

        const destInput = document.getElementById('destination');
        const durInput = document.getElementById('trip-duration');

        if (destInput) destInput.value = destination;
        if (durInput) durInput.value = duration;

        const bookingModal = document.getElementById('booking-modal');
        if (bookingModal) bookingModal.style.display = 'flex';
      }
    });
  });
});

 