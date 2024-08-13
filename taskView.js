const urlParams = new URLSearchParams(window.location.search);
let p = urlParams.get('myVariable');
let db;
    // let currentPriorityFilter = "do_first";

document.addEventListener("DOMContentLoaded", function () {

    let currentView = localStorage.getItem('taskView');
    if (currentView) {

        const kanbanView = document.getElementById("kanbanView");
        const listView = document.getElementById("listView");

        if (currentView == 'list') {
            kanbanView.classList.add("hidden");
            listView.classList.remove("hidden");
            document.getElementById("toggleView").textContent = "Switch to Kanban";
        }
        else{

            kanbanView.classList.remove("hidden");
            listView.classList.add("hidden");
            document.getElementById("toggleView").textContent = "Switch to List";
        }
        // console.log(currentView);
    }
    else{
        
        localStorage.setItem('taskView', 'list');
    }

    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = './loginAndRgister.html';
    }

    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = './loginAndRgister.html';
    });

    const request = indexedDB.open("Tasks", 1);

    request.onerror = function (event) {
        console.error("Database error:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadTasks(p);
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
    document.getElementById("addTaskList").addEventListener("click", openAddTaskModal);
    document.getElementById("closeAddTask").addEventListener("click", closeAddTaskModal);
    document.getElementById("addTaskForm").addEventListener("submit", addTask);
    document.getElementById("closeEditTask").addEventListener("click", closeEditTaskModal);
    document.getElementById("editTaskForm").addEventListener("submit", updateTask);

    document.getElementById("toggleView").addEventListener("click", function () {
        const kanbanView = document.getElementById("kanbanView");
        const listView = document.getElementById("listView");

        if (kanbanView.classList.contains("hidden")) {

            kanbanView.classList.remove("hidden");
            listView.classList.add("hidden");
            this.textContent = "Switch to List";

            localStorage.setItem('taskView', 'kanban');
            // console.log(localStorage.getItem('taskView'));
        } else {

            kanbanView.classList.add("hidden");
            listView.classList.remove("hidden");
            this.textContent = "Switch to Kanban";

            localStorage.setItem('taskView', 'list');
            // console.log(localStorage.getItem('taskView'));
        }
    });
});

    function openAddTaskModal() {
    document.getElementById("addTaskModal").classList.remove("hidden");
    }

    function closeAddTaskModal() {
    document.getElementById("addTaskModal").classList.add("hidden");
    }

    function openEditTaskModal(task) {
        document.getElementById("editTaskId").value = task.id;
        document.getElementById("editTaskTitle").value = task.title;
        document.getElementById("editTaskDueDate").value = task.dueDate;
        // document.getElementById("editTaskPriority").value = task.priority;
        // document.getElementById("editTaskList").value = task.column;
        document.getElementById("editTaskModal").classList.remove("hidden");
    }

    function closeEditTaskModal() {
    document.getElementById("editTaskModal").classList.add("hidden");
    }

    function addTask(event) {
        event.preventDefault();
        const title = document.getElementById("taskTitle").value;
        const dueDate = document.getElementById("taskDueDate").value;
        const priority = p;
        const column = 'tasks';

        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;

        const task = { title, dueDate, priority, column , email };

        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.add(task);

        request.onsuccess = function () {

            closeAddTaskModal();
            loadTasks(task.priority);
        };
        
        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };

        document.getElementById("taskTitle").value = null;
        document.getElementById("taskDueDate").value = null;
        // document.getElementById("taskPriority").value = null;
        // document.getElementById("taskList").value = null;
    }

    function updateTask(event) {
        event.preventDefault();
        const id = parseInt(document.getElementById("editTaskId").value);
        const title = document.getElementById("editTaskTitle").value;
        const dueDate = document.getElementById("editTaskDueDate").value;
        // const priority = document.getElementById("editTaskPriority").value;
        const priority = p;
        const column = document.getElementById("editTaskList").value;

        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;

        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.get(id);

        request.onsuccess = function (event) {
            const task = event.target.result;
            task.title = title;
            task.dueDate = dueDate;
            task.priority = priority;
            task.column = column;
            task.email = email;

            const updateRequest = objectStore.put(task);

            updateRequest.onsuccess = function () {
                document.getElementById("editTaskId").value = null;
                document.getElementById("editTaskTitle").value = null;
                document.getElementById("editTaskDueDate").value = null;
                // document.getElementById("editTaskPriority").value = null;
                // document.getElementById("editTaskList").value = null;
                closeEditTaskModal();
                loadTasks(task.priority);
            };

            updateRequest.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };
        location.reload();
    }

    function loadTasks(currentPriorityFilter) {
        // console.log("123");
        const transaction = db.transaction(["tasks"], "readonly");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
            let tasks = event.target.result;

             // Filter tasks by the current user's email
            let user = JSON.parse(sessionStorage.getItem('user'));
            let email = user.email;

            tasks = tasks.filter(task => task.email == email);

            // Sort tasks by dueDate in ascending order
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            // console.log(tasks);


            // Clear existing tasks
            document.getElementById("tasksContainer").innerHTML = "";
            document.getElementById("inprocessContainer").innerHTML = "";
            document.getElementById("doneContainer").innerHTML = "";
            document.getElementById("taskTableBody").innerHTML = "";

            // let user = JSON.parse(sessionStorage.getItem('user'));
            // let email = user.email;
            let index = 0;
            tasks.forEach((task) => {
                // if (task.email == email) {
                    
                    if (task.priority !== currentPriorityFilter) {
                        return;
                    }
        
                    // console.log(index-1);
                    if (index == 0) {
                        
                        countTask(task.priority);
                        // console.log(task.priority);
                    }
                    index++;

                    const taskElement = document.createElement("div");
                    taskElement.className = "draggable border w-full rounded-lg p-4 flex flex-col gap-3";
                    taskElement.draggable = true;
                    taskElement.dataset.id = task.id;
                    taskElement.innerHTML = `
                            <p><strong>${task.title}</strong></p>
                            <p>Due: ${task.dueDate}</p>
                            <p>Priority: ${task.priority}</p>
                            <p>List: ${task.column}</p>
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-2" onclick='openEditTaskModal(${JSON.stringify(
                                task
                            )})'>Update</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteTask(${
                                task.id
                            })">Delete</button>
                        `;
        
                    const rowElement = document.createElement("tr");
                    // rowElement.className=""
                    rowElement.innerHTML = `
                            <td class="py-2 px-4 border-b border-gray-200">${
                                task.id
                            }</td>
                            <td class="py-2 px-4 border-b border-gray-200">${
                                task.title
                            }</td>
                            <td class="py-2 px-4 border-b border-gray-200">${
                                task.dueDate
                            }</td>
                            <td class="py-2 px-4 border-b border-gray-200">${
                                task.priority
                            }</td>
                            <td class="py-2 px-4 border-b border-gray-200">${
                                task.column
                            }</td>
                            <td class="py-2 px-4 border-b border-gray-200 flex">
                                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-2" onclick='openEditTaskModal(${JSON.stringify(
                                    task
                                )})'>Update</button>
                                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteTask(${
                                    task.id
                                })">Delete</button>
                            </td>
                        `;
        
                        // console.log("done");
                    if (task.column === "tasks") {

                        document.getElementById("tasksContainer").appendChild(taskElement);
                    } else if (task.column === "inprocess") {

                        document.getElementById("inprocessContainer").appendChild(taskElement);
                    } else if (task.column === "done") {
                        document.getElementById("doneContainer").appendChild(taskElement);
                    }
        
                    document.getElementById("taskTableBody").appendChild(rowElement);
                // }
            });
            
        };

        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };
    }

    // Function to count tasks
    const countTask = (priority) => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let email = user.email;
        const transaction = db.transaction(["tasks"], "readonly");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const tasks = event.target.result;
            const userTasks = tasks.filter(task => task.email === email && task.priority === priority);
            const tasksColumnCount = userTasks.filter(task => task.column === 'tasks').length;
            const inprocessColumnCount = userTasks.filter(task => task.column === 'inprocess').length;

            document.getElementById('tasks_count').innerText = tasksColumnCount;
            document.getElementById('inProcess_count').innerText = inprocessColumnCount;
        };

        request.onerror = function(event) {
            console.error("Error fetching tasks:", event.target.errorCode);
        };
    };

    // function filterTasks(priority) {
    //     window.location.href = './ZYdisplayPagee.html';
    //     currentPriorityFilter = priority;
        // loadTasks();
        // console.log("wwww");
    // }
// console.log("qqqq");
    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const taskId = parseInt(event.dataTransfer.getData("text"));
        const column = event.target.id;

        if (!["tasks", "inprocess", "done"].includes(column)) return;

        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const request = objectStore.get(taskId);

        request.onsuccess = function (event) {
            const task = event.target.result;
            task.column = column;

            const updateRequest = objectStore.put(task);

            updateRequest.onsuccess = function () {
                loadTasks(task.priority);
            };

            updateRequest.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };
    }

    function deleteTask(id) {
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");
        const getTask = objectStore.get(id);
        // 
        let task
        getTask.onsuccess = function (event) {
            
            task = event.target.result;
            task = task.priority;
        };
        // 
        const request = objectStore.delete(id);

        request.onsuccess = function () {
            loadTasks(task);
        };

        request.onerror = function (event) {
            console.error("Error:", event.target.errorCode);
        };
    }

    document.addEventListener('dragstart', function(event) {
        if (event.target.classList.contains('draggable')) {
            event.dataTransfer.setData('text', event.target.dataset.id);
        }
    });