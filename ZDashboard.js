
// document.addEventListener('DOMContentLoaded', () => {
//     const user = JSON.parse(sessionStorage.getItem('user'));
//     if (!user) {
//         window.location.href = './loginAndRgister.html';
//     } else {
//         document.getElementById('userDetails').innerText = `Welcome, ${user.email} (${user.accountType})`;
//         document.getElementById('profileEmail').innerText = user.email;
//         document.getElementById('profileAccountType').innerText = user.accountType;
//     }

//     document.getElementById('logout').addEventListener('click', () => {
//         sessionStorage.removeItem('user');
//         window.location.href = './loginAndRgister.html';
//     });

//     document.getElementById('profile').addEventListener('click', () => {
//         document.getElementById('profileModal').classList.remove('hidden');
//     });

//     document.getElementById('closeProfile').addEventListener('click', () => {
//         document.getElementById('profileModal').classList.add('hidden');
//     });

//     // Close modal when clicking outside of it
//     document.getElementById('profileModal').addEventListener('click', (event) => {
//         if (event.target === document.getElementById('profileModal')) {
//             document.getElementById('profileModal').classList.add('hidden');
//         }
//     });
// });









document.addEventListener('DOMContentLoaded', () => {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = './loginAndRgister.html';
    } else {
        document.getElementById('userDetails').innerText = `Welcome, ${user.email} (${user.accountType})`;
        document.getElementById('profileEmail').innerText = user.email;
        document.getElementById('profileAccountType').innerText = user.accountType;
    }

    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = './loginAndRgister.html';
    });

    document.getElementById('profile').addEventListener('click', () => {
        document.getElementById('profileModal').classList.remove('hidden');
    });

    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('profileModal').classList.add('hidden');
    });

    document.getElementById('profileModal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('profileModal')) {
            document.getElementById('profileModal').classList.add('hidden');
        }
    });

    document.getElementById('editProfile').addEventListener('click', () => {
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editAccountType').value = user.accountType;
        document.getElementById('profileModal').classList.add('hidden');
        document.getElementById('editProfileModal').classList.remove('hidden');
    });

    document.getElementById('closeEditProfile').addEventListener('click', () => {
        document.getElementById('editProfileModal').classList.add('hidden');
    });

    document.getElementById('editProfileModal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('editProfileModal')) {
            document.getElementById('editProfileModal').classList.add('hidden');
        }
    });

    document.getElementById('editProfileForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const newEmail = document.getElementById('editEmail').value;
        const newPassword = document.getElementById('editPassword').value;
        const newAccountType = document.getElementById('editAccountType').value;
        const hashedPassword = newPassword ? CryptoJS.SHA256(newPassword).toString() : user.password;

        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');

        // Delete the old record if the email has changed
        if (newEmail !== user.email) {
            objectStore.delete(user.email).onsuccess = function() {
                const request = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

                request.onsuccess = function() {
                    sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
                    // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
                    document.getElementById('editProfileModal').classList.add('hidden');
                    window.location.reload();
                };

                request.onerror = function(event) {
                    // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
                    console.error('Error:', event.target.errorCode);
                };
            };
        } else {
            const request = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

            request.onsuccess = function() {
                sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
                // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
                document.getElementById('editProfileModal').classList.add('hidden');
                window.location.reload();
            };

            request.onerror = function(event) {
                // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
                console.error('Error:', event.target.errorCode);
            };
        }
    });

    // function displayMessage(elementId, message, type) {
    //     const messageDiv = document.getElementById(elementId);
    //     messageDiv.classList.remove('hidden');
    //     messageDiv.innerText = message;
    //     if (type === 'success') {
    //         messageDiv.classList.remove('bg-red-500');
    //         messageDiv.classList.add('bg-green-500');
    //     } else {
    //         messageDiv.classList.remove('bg-green-500');
    //         messageDiv.classList.add('bg-red-500');
    //     }
    // }
});

// IndexedDB setup
let db;
const request = indexedDB.open('UserDatabase', 1);

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('users', { keyPath: 'email' });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('accountType', 'accountType', { unique: false });
};