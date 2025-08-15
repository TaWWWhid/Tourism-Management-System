
let checkAuthentication = () => {
    if (!sessionStorage.getItem('authenticated')) {
        window.location.href = 'register.html';
    }
}

// Prevent redirect on subsequent page loads
if (!sessionStorage.getItem('redirected')) {
    setTimeout(checkAuthentication, 2000); // 2 seconds delay
    sessionStorage.setItem('redirected', true);
}
