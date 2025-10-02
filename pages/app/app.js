// check if user is logged in
function isAuthenticated() {
  return sessionStorage.getItem('authenticated') === 'true';
}

// attach click handler to destination cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!isAuthenticated()) {
        // go to register page if not logged in
        window.location.href = 'register.html';
      } else {
        // do normal behavior if logged in (replace with your own logic)
        // e.g., open details page or booking
        console.log('User is authenticated, proceed to booking or details');
      }
    });
  });
});
