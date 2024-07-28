document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userDetails').innerText = `Welcome, ${user.email} (${user.accountType})`;
    }

    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});