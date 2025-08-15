document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements
    const cards = document.querySelectorAll('.card');
    const bookingModal = document.getElementById('booking-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModal = document.getElementById('close-modal');
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    const scrollButton = document.getElementById('scroll-button');
    const bookingForm = document.querySelector('.booking-form');
    const confirmationDetails = document.getElementById('confirmation-details');

    // Verify all elements are found
    console.log('Confirmation Modal Element:', confirmationModal);
    console.log('Confirmation Details Element:', confirmationDetails);

    // Handle card clicks
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.querySelector('.Dest').textContent.trim();
            const priceElement = card.querySelector('.price');
            const durationMatch = priceElement.textContent.match(/\d+\s*days/);
            const duration = durationMatch ? durationMatch[0] : '';

            document.getElementById('destination').value = destination;
            document.getElementById('trip-duration').value = duration;
            bookingModal.style.display = 'flex';
        });
    });

    // Single form submission handler
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // Create FormData
            const formData = new FormData(event.target);

            // Send to server
            const response = await fetch('book_trip.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Create confirmation message
                const confirmationMessage = `
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

                // Hide booking modal
                bookingModal.style.display = 'none';

                // Update confirmation details and show modal
                if (confirmationDetails && confirmationModal) {
                    confirmationDetails.innerHTML = confirmationMessage.replace(/\n/g, '<br>');
                    confirmationModal.style.display = 'flex';
                    
                    // Log for debugging
                    console.log('Showing confirmation modal');
                    console.log('Modal style:', confirmationModal.style.display);
                } else {
                    console.error('Confirmation modal elements not found!');
                }

                // Reset form
                bookingForm.reset();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form. Please try again.');
        }
    });

    // Modal close handlers
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            bookingModal.style.display = 'none';
        });
    }

    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }

    // Scroll button handler
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            const formSection = document.querySelector('.booking-form');
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Outside click handlers
    window.addEventListener('click', (event) => {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});