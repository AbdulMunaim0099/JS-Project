// document.addEventListener('DOMContentLoaded', () => {
//     const user = JSON.parse(sessionStorage.getItem('user'));
//     if (!user) {
//         window.location.href = './loginAndRgister.html';
//     } else {
//         document.getElementById('userDetails').innerText = `Welcome, ${user.email} (${user.accountType})`;
//     }

//     document.getElementById('logout').addEventListener('click', () => {
//         sessionStorage.removeItem('user');
//         window.location.href = './loginAndRgister.html';
//     });

//     document.getElementById('profile').addEventListener('click', () => {
//         alert('Profile page is under construction.');
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userDetails').innerText = `Welcome, ${user.email} (${user.accountType})`;
        document.getElementById('profileEmail').innerText = user.email;
        document.getElementById('profileAccountType').innerText = user.accountType;
    }

    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    document.getElementById('profile').addEventListener('click', () => {
        document.getElementById('profileModal').classList.remove('hidden');
    });

    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('profileModal').classList.add('hidden');
    });

    // Close modal when clicking outside of it
    document.getElementById('profileModal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('profileModal')) {
            document.getElementById('profileModal').classList.add('hidden');
        }
    });
});