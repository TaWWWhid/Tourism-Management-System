document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bookingModal = document.getElementById('booking-modal');
  const confirmationModal = document.getElementById('confirmation-modal');
  const closeModal = document.getElementById('close-modal');
  const closeConfirmModal = document.getElementById('close-confirm-modal');
  const bookingForm = document.querySelector('.booking-form');
  const confirmationDetails = document.getElementById('confirmation-details');
  const scrollButton = document.getElementById('scroll-button'); // optional

  // Helper used by app.js after auth passes
  window.openBookingFromCard = (card) => {
    const destination = card.querySelector('.Dest')?.textContent.trim() || '';
    const priceElement = card.querySelector('.price');
    const durationMatch = (priceElement?.textContent || '').match(/\d+\s*days/);
    const duration = durationMatch ? durationMatch[0] : '';

    const destInput = document.getElementById('destination');
    const durInput = document.getElementById('trip-duration');

    if (destInput) destInput.value = destination;
    if (durInput) durInput.value = duration;

    if (bookingModal) bookingModal.style.display = 'flex';
  };

  // Submit booking form
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const formData = new FormData(event.target);

        const response = await fetch('book_trip.php', {
          method: 'POST',
          body: formData
        });

        const ct = response.headers.get('content-type') || '';
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!ct.includes('application/json')) {
          const text = await response.text();
          throw new Error('Expected JSON, got: ' + text.slice(0, 200));
        }

        const result = await response.json();

        if (result.status === 'success') {
          const msg = `
Booking Details:
----------------
Full Name: ${formData.get('full_name')}
Contact Phone: ${formData.get('contact_phone')}
Contact Email: ${formData.get('contact_email')}
Destination: ${formData.get('destination')}
Duration: ${formData.get('trip_duration')}
Number of Participants: ${formData.get('participants')}
Hotel Type: ${formData.get('hotel_choice')}
Payment Method: ${formData.get('payment_method')}
          `;

          if (bookingModal) bookingModal.style.display = 'none';

          if (confirmationDetails) {
            confirmationDetails.innerHTML = msg.replace(/\n/g, '<br>');
          }
          if (confirmationModal) confirmationModal.style.display = 'flex';

          bookingForm.reset();
        } else {
          alert(result.message || 'Booking failed');
        }
      } catch (err) {
        console.error('Submission error:', err);
        alert('Error submitting form. Please try again.');
      }
    });
  }

  // Close buttons
  if (closeModal) {
    closeModal.addEventListener('click', () => { if (bookingModal) bookingModal.style.display = 'none'; });
  }
  if (closeConfirmModal) {
    closeConfirmModal.addEventListener('click', () => { if (confirmationModal) confirmationModal.style.display = 'none'; });
  }

  // Optional scroll button
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      const formSection = document.querySelector('.booking-form');
      if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Click outside to close
  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) bookingModal.style.display = 'none';
    if (e.target === confirmationModal) confirmationModal.style.display = 'none';
  });
});
