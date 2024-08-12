let redirect = (priorityFlag) =>{
    // const myVariable = 'Hello, World!';
    window.location.href = `./taskView.html?myVariable=${encodeURIComponent(priorityFlag)}`;
}

// let currentPriorityFilter = "do_first";

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = './loginAndRgister.html';
    });

    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = './loginAndRgister.html';
    } else {
        // document.getElementById('userDe  tails').innerText = `Welcome, ${user.email} (${user.accountType})`;
        document.getElementById('profileEmail').innerText = user.email;
        document.getElementById('profileAccountType').innerText = user.accountType;
    }


    // TO ADD TASKS
    let db;
    const request = indexedDB.open("Tasks", 1);

    request.onerror = function (event) {
        console.error("Database error:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        // loadTasks(p);
        countTask();
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("tasks", {
        keyPath: "id",
        autoIncrement: true,
        });
        objectStore.createIndex("title", "title", { unique: false });
        objectStore.createIndex("dueDate", "dueDate", { unique: false });
        objectStore.createIndex("priority", "priority", { unique: false });
        objectStore.createIndex("column", "column", { unique: false });
        objectStore.createIndex("email", "email", { unique: false });
    };

    document.getElementById("addTask").addEventListener("click", openAddTaskModal);
    document.getElementById("closeAddTask").addEventListener("click", closeAddTaskModal);
    document.getElementById("addTaskForm").addEventListener("submit", addTask);
    document.getElementById("requestManage").addEventListener("click", openRequestModal);
    document.getElementById("closeRequest").addEventListener("click", closeRequestModal);
    document.getElementById("sendRequestForm").addEventListener("submit", sendRequest);


    // Function to count tasks
    const countTask = () => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;
        const transaction = db.transaction(["tasks"], "readonly");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const tasks = event.target.result;
            const userTasks_doFirst = tasks.filter(task => task.email === email && task.priority === 'do_first');
            const tasksColumnCount_doFirst = userTasks_doFirst.filter(task => task.column === 'tasks').length;
            const inprocessColumnCount_doFirst = userTasks_doFirst.filter(task => task.column === 'inprocess').length;

            const userTasks_doNext = tasks.filter(task => task.email === email && task.priority === 'do_next');
            const tasksColumnCount_doNext = userTasks_doNext.filter(task => task.column === 'tasks').length;
            const inprocessColumnCount_doNext = userTasks_doNext.filter(task => task.column === 'inprocess').length;

            const userTasks_delegate = tasks.filter(task => task.email === email && task.priority === 'delegate');
            const tasksColumnCount_delegate = userTasks_delegate.filter(task => task.column === 'tasks').length;
            const inprocessColumnCount_delegate = userTasks_delegate.filter(task => task.column === 'inprocess').length;

            const userTasks_eleminate = tasks.filter(task => task.email === email && task.priority === 'eliminate');
            const tasksColumnCount_eleminate = userTasks_eleminate.filter(task => task.column === 'tasks').length;
            const inprocessColumnCount_eleminate = userTasks_eleminate.filter(task => task.column === 'inprocess').length;

            document.getElementById('doFirst_count').innerText = tasksColumnCount_doFirst + inprocessColumnCount_doFirst;
            document.getElementById('doNext_count').innerText = tasksColumnCount_doNext + inprocessColumnCount_doNext;
            document.getElementById('delegate_count').innerText = tasksColumnCount_delegate + inprocessColumnCount_delegate;
            document.getElementById('eliminate_count').innerText = tasksColumnCount_eleminate + inprocessColumnCount_eleminate;
        };

        request.onerror = function(event) {
            console.error("Error fetching tasks:", event.target.errorCode);
        };
    };
    // document.getElementById("editTaskForm").addEventListener("submit", updateTask);

    // document.getElementById("toggleView").addEventListener("click", function () {
    //     const kanbanView = document.getElementById("kanbanView");
    //     const listView = document.getElementById("listView");
    //     if (kanbanView.classList.contains("hidden")) {
    //         kanbanView.classList.remove("hidden");
    //         listView.classList.add("hidden");
    //         this.textContent = "Switch to List";
    //     } else {
    //         kanbanView.classList.add("hidden");
    //         listView.classList.remove("hidden");
    //         this.textContent = "Switch to Kanban";
    //     }
    // });


    function openAddTaskModal() {
    document.getElementById("addTaskModal").classList.remove("hidden");
    }

    function closeAddTaskModal() {
        document.getElementById("addTaskModal").classList.add("hidden");
    }

    function addTask(event) {
        event.preventDefault();
        const title = document.getElementById("taskTitle").value;
        const dueDate = document.getElementById("taskDueDate").value;
        const priority = document.getElementById("taskPriority").value;
        const column = 'tasks';
        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;

        const task = { title, dueDate, priority, column , email};

        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.add(task);

        request.onsuccess = function () {
            document.getElementById("taskTitle").value = null;
            document.getElementById("taskDueDate").value = null;
            document.getElementById("taskPriority").value = null;
            // document.getElementById("taskList").value = null;
            closeAddTaskModal();
            location.reload();
            // loadTasks(task.priority);
            // console.log("Done");
        };

        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };
    }


    // IndexedDB setup for users
    let db4;
    const request4 = indexedDB.open('UserDatabase', 1);

    request4.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };

    request4.onsuccess = function(event) {
        db4 = event.target.result;
        // console.log('User database opened successfully');
    };

    request4.onupgradeneeded = function(event) {
        db4 = event.target.result;
        const objectStore = db4.createObjectStore('users', { keyPath: 'email' });
        objectStore.createIndex('password', 'password', { unique: false });
        objectStore.createIndex('accountType', 'accountType', { unique: false });
    };

    

    // IndexedDB setup for requests
    let db2;
    const request2 = indexedDB.open("Requests", 1);

    request2.onerror = function(event) {
        console.error("Database error:", event.target.errorCode);
    };

    request2.onsuccess = function(event) {
        db2 = event.target.result;
        // console.log('Requests database opened successfully');
    };

    request2.onupgradeneeded = function(event) {
        db2 = event.target.result;
        const objectStore = db2.createObjectStore("requests", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("sender_Email", "sender_Email", { unique: false });
        objectStore.createIndex("receiver_Email", "receiver_Email", { unique: false });
        objectStore.createIndex("requestStatus", "requestStatus", { unique: false });
    };

    // Function to open request modal
    function openRequestModal() {
        document.getElementById("requestModal").classList.remove("hidden");
    }

    // Function to close request modal
    function closeRequestModal() {
        document.getElementById("requestModal").classList.add("hidden");
    }

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

    // Function to send request
    function sendRequest(event) {
        event.preventDefault();
        let user = JSON.parse(sessionStorage.getItem('user'));
        let sender_Email = user.email;
        let receiver_Email = document.getElementById("userID").value;
        let requestStatus = "pending";

        const transaction = db4.transaction(["users"]);
        const objectStore = transaction.objectStore("users");
        const request = objectStore.get(receiver_Email);

        request.onsuccess = function(event) {
            const receiver = event.target.result;
            // console.log(receiver.accountType);
            if (receiver && receiver.accountType == "admin") {
                const transaction2 = db2.transaction(["requests"], "readwrite");
                const objectStore2 = transaction2.objectStore("requests");
                const request2 = objectStore2.add({ sender_Email, receiver_Email, requestStatus });

                request2.onsuccess = function() {
                    document.getElementById("userID").value= null;
                    displayMessage('requestMessage', 'Request sent successfully', 'success');
                    setTimeout(closeRequestModal, 2000);
                };

                request2.onerror = function(event) {
                    document.getElementById("userID").value= null;
                    displayMessage('requestMessage', 'Unable to send request', 'error');
                    console.error("Error:", event.target.errorCode);
                };
            } else {
                document.getElementById("userID").value= null;
                displayMessage('requestMessage', 'Receiver email not found', 'error');
            }
        };

        request.onerror = function(event) {
            displayMessage('requestMessage', 'Error checking receiver email', 'error');
            console.error("Error:", event.target.errorCode);
        };
    }



    // TO UPDATE PROFILE

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
    
    //     // Check if the new email already exists
    //     const emailCheckRequest = objectStore.get(newEmail);
    
    //     emailCheckRequest.onsuccess = function(event) {
    //         const existingUser = event.target.result;
    
    //         if (existingUser && newEmail !== user.email) {
    //             // Email already exists and it's not the current user's email
    //             displayMessage('editProfileMessage', 'Email already exists', 'error');
    //         } else {
    //             // Proceed with updating the profile
    //             if (newEmail !== user.email) {
    //                 // Delete the old record if the email has changed
    //                 objectStore.delete(user.email).onsuccess = function() {
    //                     const updateRequest = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });
    
    //                     updateRequest.onsuccess = function() {
    //                         sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
    //                         displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
    //                         document.getElementById('editProfileModal').classList.add('hidden');
    //                         window.location.reload();
    //                     };
    
    //                     updateRequest.onerror = function(event) {
    //                         displayMessage('editProfileMessage', 'Unable to update profile', 'error');
    //                         console.error('Error:', event.target.errorCode);
    //                     };
    //                 };
    //             } else {
    //                 const updateRequest = objectStore.put({ email: newEmail, password: hashedPassword, accountType: newAccountType });
    
    //                 updateRequest.onsuccess = function() {
    //                     sessionStorage.setItem('user', JSON.stringify({ email: newEmail, password: hashedPassword, accountType: newAccountType }));
    //                     displayMessage('editProfileMessage', 'Profile updated successfully', 'success');
    //                     document.getElementById('editProfileModal').classList.add('hidden');
    //                     window.location.reload();
    //                 };
    
    //                 updateRequest.onerror = function(event) {
    //                     displayMessage('editProfileMessage', 'Unable to update profile', 'error');
    //                     console.error('Error:', event.target.errorCode);
    //                 };
    //             }
    //         }
    //     };
    
    //     emailCheckRequest.onerror = function(event) {
    //         console.error('Error checking email:', event.target.errorCode);
    //     };
    // });
    

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


