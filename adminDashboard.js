
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById('logout').addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = './loginAndRgister.html';
        });

    const requestDisplayButton = document.getElementById('requestDisplay');
    const requestModal = document.getElementById('requestModal');
    const closeRequestButton = document.getElementById('closeRequest');
    const dataDisplayDiv = document.getElementById('diplayRequest_DIV');

    const totalApprovedRequestsElement = document.getElementById('totalApprovedRequests');
    const totalTasksElement = document.getElementById('totalTasks');

    let db;
    const request = indexedDB.open('Requests', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('requests')) {
            const objectStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
            // objectStore.createIndex('sender_Email', 'sender_Email', { unique: false });
            objectStore.createIndex('requestStatus', 'requestStatus', { unique: false });
            objectStore.createIndex('receiver_Email', 'receiver_Email', { unique: false });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        updateTotals(); // Initial totals update
    };

    let db2;
    const request2 = indexedDB.open("Tasks", 1);

    request2.onupgradeneeded = function(event) {
        db2 = event.target.result;
        if (!db2.objectStoreNames.contains('tasks')) {
            db2.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        }
    };

    request2.onsuccess = function(event) {
        db2 = event.target.result;
    };

    requestDisplayButton.addEventListener('click', function () {
        displayRequests();
        requestModal.classList.remove('hidden');
    });

    closeRequestButton.addEventListener('click', function () {
        requestModal.classList.add('hidden');
    });

    function displayRequests() {
        const transaction = db.transaction(['requests'], 'readonly');
        const objectStore = transaction.objectStore('requests');
        const request = objectStore.getAll();

        let dataDisplayDiv = document.getElementById('displayRequest_DIV');

        dataDisplayDiv.innerHTML = ''; // Clear previous requests

        request.onsuccess = function(event) {
            const allData = event.target.result;
            const pendingRequests = allData.filter(dataItem => dataItem.requestStatus !== 'approved' && dataItem.requestStatus !== 'rejected');
            
            if (pendingRequests.length === 0) {
                dataDisplayDiv.innerHTML = '<p>No pending requests.</p>';
            } else {
                pendingRequests.forEach(dataItem => {
                    const div = document.createElement('div');
                    div.className = "flex justify-between items-center mb-2";
                    div.innerHTML = `
                        <div class="self-center font-semibold text-xl">${dataItem.sender_Email}</div>
                        <div class="flex gap-2 self-center">
                            <button onclick="editRequest('approve', ${dataItem.id})" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Approve</button>
                            <button onclick="editRequest('reject', ${dataItem.id})" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                        </div>`;
                    dataDisplayDiv.appendChild(div);
                });
            }
        };
    }

    window.editRequest = function (action, id) {
        const transaction = db.transaction(['requests'], 'readwrite');
        const objectStore = transaction.objectStore('requests');
        const request = objectStore.get(id);

        request.onsuccess = function(event) {
            const data = event.target.result;


            if (action == 'approve') {
                data.requestStatus = 'approved';
            }
            else{
                data.requestStatus ='rejected';
            }
            const updateRequest = objectStore.put(data);

            updateRequest.onsuccess = function(event) {
                displayRequests(); // Refresh the displayed requests
                updateTotals(); // Update the totals after approving a request
            };
        };
    };


    function updateTotals() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;


        // const transaction = db.transaction(['requests'], 'readonly');
        // const objectStore = transaction.objectStore('requests');

        // const approvedRequestCount = objectStore.index('requestStatus').count('approved');

        // approvedRequestCount.onsuccess = function(event) {
        //     totalApprovedRequestsElement.textContent = event.target.result;
        // };


        const requestTransaction = db.transaction(['requests'], 'readonly');
        const requestObjectStore = requestTransaction.objectStore('requests');
        const requestQuery = requestObjectStore.index('receiver_Email').getAll(email);

        requestQuery.onsuccess = function(event) {
            const userRequests = event.target.result;
            const approvedUserRequests = userRequests.filter(request => request.requestStatus === 'approved');

            if (approvedUserRequests.length > 0) {

                
                totalApprovedRequestsElement.textContent = approvedUserRequests.length;
                let countTasks = 0;
                for (let i = 0; i < approvedUserRequests.length; i++) {
                    
                    const senderEmail = approvedUserRequests[i].sender_Email;
                    const taskTransaction = db2.transaction(['tasks'], 'readonly');
                    const taskObjectStore = taskTransaction.objectStore('tasks');
                    const taskQuery = taskObjectStore.index('email').count(senderEmail);
    
                    taskQuery.onsuccess = function(event) {
                        // console.log(event.target.result);
                        countTasks += event.target.result;
                        totalTasksElement.textContent = countTasks ;
                    };
                    // console.log(event.target.result);
                }
                // console.log(countTasks);
            } else {
                totalTasksElement.textContent = '0';
            }
        };
    }





    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = './loginAndRgister.html';
    } else {
        // document.getElementById('userDe  tails').innerText = `Welcome, ${user.email} (${user.accountType})`;
        document.getElementById('profileEmail').innerText = user.email;
        document.getElementById('profileAccountType').innerText = user.accountType;
    }

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
            document.getElementById('oldEmail').value = user.email;
            // document.getElementById('editAccountType').value = user.accountType;
            document.getElementById('profileModal').classList.add('hidden');
            document.getElementById('editProfileModal').classList.remove('hidden');
        });

        let closeEditModal = () =>{

            document.getElementById('editProfileModal').classList.add('hidden');
            document.getElementById('oldEmail').value = null;
            document.getElementById('editEmail').value = null;
            document.getElementById('editPassword').value = null;
        }
        document.getElementById('closeEditProfile').addEventListener('click', () => {
            closeEditModal();
        });

        document.getElementById('editProfileModal').addEventListener('click', (event) => {
            if (event.target === document.getElementById('editProfileModal')) {
                document.getElementById('editProfileModal').classList.add('hidden');
            }
        });

        let db3;
        const request3 = indexedDB.open('UserDatabase', 1);

        request3.onerror = function(event) {
            console.error('Database error:', event.target.errorCode);
        };

        request3.onsuccess = function(event) {
            db3 = event.target.result;
        };

        request3.onupgradeneeded = function(event) {
            db3 = event.target.result;
            const objectStore = db3.createObjectStore('users', { keyPath: 'email' });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('accountType', 'accountType', { unique: false });
        };

        // Function to display messages
        function displayMessage(elementId, message, type) {
            const messageDiv = document.getElementById(elementId);
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('text-white');
            messageDiv.innerText = message;
            if (type === 'success') {
                messageDiv.classList.remove('bg-red-500');
                messageDiv.classList.add('bg-green-500');
            } else {
                messageDiv.classList.remove('bg-green-500');
                messageDiv.classList.add('bg-red-500');
            }
        }

        document.getElementById('editProfileForm').addEventListener('submit', (event) => {
            event.preventDefault();
        
            // Check if the user is logged in
            const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
            if (!loggedInUser) {
                console.error('User not logged in');
                return;
            }
        
            const oldEmail = document.getElementById('oldEmail').value;
            const newEmail = document.getElementById('editEmail').value;
            const newPassword = document.getElementById('editPassword').value;
            const newAccountType = loggedInUser.accountType;
            const hashedPassword = newPassword ? CryptoJS.SHA256(newPassword).toString() : loggedInUser.password;
        
            // Check if the user trying to update is the same as the logged-in user
            if (oldEmail !== loggedInUser.email) {
                displayMessage('editProfileMessage', 'User attempting to update a different profile', 'error');
                return;
            }
        
            const transaction = db3.transaction(['users'], 'readwrite');
            const objectStore = transaction.objectStore('users');
        
            // Check if the new email already exists in the database, excluding the current user
            const index = objectStore.index('email'); // Assuming 'email' is an index on the 'users' object store
            const getRequest = index.get(newEmail);
            
            getRequest.onsuccess = function(event) {
                const existingUser = event.target.result;
        
                if (existingUser && existingUser.email !== loggedInUser.email) {
                    // New email already exists and is not the current user's email
                    displayMessage('editProfileMessage', 'Email is already in use', 'error');
                    return;
                }
        
                // Delete the old record if the email has changed
                if (newEmail !== user.email) {
                    objectStore.delete(user.email).onsuccess = function() {
                        const request3 = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

                        request3.onsuccess = function() {
                            sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
                            // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
                            // document.getElementById('editProfileModal').classList.add('hidden');
                            closeEditModal();
                            window.location.reload();
                        };

                        request3.onerror = function(event) {
                            // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
                            console.error('Error:', event.target.errorCode);
                        };
                    };
                } else {
                    const request3 = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

                    request3.onsuccess = function() {
                        sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
                        // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
                        // document.getElementById('editProfileModal').classList.add('hidden');
                        closeEditModal();
                        window.location.reload();
                    };

                    request3.onerror = function(event) {
                        // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
                        console.error('Error:', event.target.errorCode);
                    };
                }
            };
        
            getRequest.onerror = function(event) {
                console.error('Error fetching email:', event.target.errorCode);
            };
        });
              

        // document.getElementById('editProfileForm').addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     const newEmail = document.getElementById('editEmail').value;
        //     const newPassword = document.getElementById('editPassword').value;
        //     const newAccountType = user.accountType;
        //     const hashedPassword = newPassword ? CryptoJS.SHA256(newPassword).toString() : user.password;

        //     const transaction = db3.transaction(['users'], 'readwrite');
        //     const objectStore = transaction.objectStore('users');

        //     // Delete the old record if the email has changed
        //     if (newEmail !== user.email) {
        //         objectStore.delete(user.email).onsuccess = function() {
        //             const request3 = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

        //             request3.onsuccess = function() {
        //                 sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
        //                 // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
        //                 document.getElementById('editProfileModal').classList.add('hidden');
        //                 window.location.reload();
        //             };

        //             request3.onerror = function(event) {
        //                 // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
        //                 console.error('Error:', event.target.errorCode);
        //             };
        //         };
        //     } else {
        //         const request3 = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });

        //         request3.onsuccess = function() {
        //             sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
        //             // displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
        //             document.getElementById('editProfileModal').classList.add('hidden');
        //             window.location.reload();
        //         };

        //         request3.onerror = function(event) {
        //             // displayMessage('editProfileMessage', 'Unable to update profile', 'error');
        //             console.error('Error:', event.target.errorCode);
        //         };
        //     }
        // });

});
