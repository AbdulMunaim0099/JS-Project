// app.js

document.addEventListener('DOMContentLoaded', () => {
    // IndexedDB setup
    let db;
    const request = indexedDB.open('UserDatabase', 1);

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Database opened successfully');
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('users', { keyPath: 'email' });
        objectStore.createIndex('password', 'password', { unique: false });
        objectStore.createIndex('accountType', 'accountType', { unique: false });
    };

    // Registration Form Submission
    document.getElementById('registerForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const accountType = document.getElementById('regAccountType').value;

        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');

        // Check if an admin already exists
        if (accountType === 'admin') {
            const index = objectStore.index('accountType');
            const request = index.get('admin');

            request.onsuccess = function(event) {
                if (event.target.result) {
                    alert('An admin already exists. Only one admin is allowed.');
                } else {
                    registerUser(email, password, accountType, objectStore);
                }
            };

            request.onerror = function(event) {
                console.error('Error checking for existing admin:', event.target.errorCode);
            };
        } else {
            registerUser(email, password, accountType, objectStore);
        }
    });

    // Function to register a new user
    function registerUser(email, password, accountType, objectStore) {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const user = { email, password: hashedPassword, accountType };
        const request = objectStore.add(user);

        request.onsuccess = function() {
            alert('User registered successfully');
        };

        request.onerror = function(event) {
            alert('Unable to register user');
            console.error('Error:', event.target.errorCode);
        };
    }

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const accountType = document.getElementById('loginAccountType').value;

        const transaction = db.transaction(['users']);
        const objectStore = transaction.objectStore('users');
        const request = objectStore.get(email);

        request.onsuccess = function(event) {
            const user = event.target.result;
            const hashedPassword = CryptoJS.SHA256(password).toString();
            if (user && user.password === hashedPassword && user.accountType === accountType) {
                alert('Login successful');
                sessionStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        };

        request.onerror = function(event) {
            alert('Unable to login');
            console.error('Error:', event.target.errorCode);
        };
    });

    // Switch to Register Form
    document.getElementById('toRegister').addEventListener('click', () => {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('register').classList.remove('hidden');
    });

    // Switch to Login Form
    document.getElementById('toLogin').addEventListener('click', () => {
        document.getElementById('register').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });
});
