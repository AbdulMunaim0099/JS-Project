const urlParams = new URLSearchParams(window.location.search);
let p = urlParams.get('myVariable');
let db;
    // let currentPriorityFilter = "do_first";

document.addEventListener("DOMContentLoaded", function () {
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
        } else {
            kanbanView.classList.add("hidden");
            listView.classList.remove("hidden");
            this.textContent = "Switch to Kanban";
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
    document.getElementById("editTaskPriority").value = task.priority;
    document.getElementById("editTaskList").value = task.column;
    document.getElementById("editTaskModal").classList.remove("hidden");
    }

    function closeEditTaskModal() {
    document.getElementById("editTaskModal").classList.add("hidden");
    }

    function addTask(event) {
    event.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;
    const column = document.getElementById("taskList").value;

    const task = { title, dueDate, priority, column };

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
    }

    function updateTask(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById("editTaskId").value);
    const title = document.getElementById("editTaskTitle").value;
    const dueDate = document.getElementById("editTaskDueDate").value;
    const priority = document.getElementById("editTaskPriority").value;
    const column = document.getElementById("editTaskList").value;

    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.get(id);

    request.onsuccess = function (event) {
        const task = event.target.result;
        task.title = title;
        task.dueDate = dueDate;
        task.priority = priority;
        task.column = column;

        const updateRequest = objectStore.put(task);

        updateRequest.onsuccess = function () {
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
    }

    function loadTasks(currentPriorityFilter) {
    const transaction = db.transaction(["tasks"], "readonly");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const tasks = event.target.result;

        // Clear existing tasks
        document.getElementById("tasksContainer").innerHTML = "";
        document.getElementById("inprocessContainer").innerHTML = "";
        document.getElementById("doneContainer").innerHTML = "";
        document.getElementById("taskTableBody").innerHTML = "";

        tasks.forEach((task) => {
        if (task.priority !== currentPriorityFilter) {
            return;
        }

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
                <td class="py-2 px-4 border-b border-gray-200">
                    <button class="bg-blue-500 text-white px-2 py-1 rounded mr-2" onclick='openEditTaskModal(${JSON.stringify(
                        task
                    )})'>Update</button>
                    <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteTask(${
                        task.id
                    })">Delete</button>
                </td>
            `;

        if (task.column === "tasks") {
            document
            .getElementById("tasksContainer")
            .appendChild(taskElement);
        } else if (task.column === "inprocess") {
            document
            .getElementById("inprocessContainer")
            .appendChild(taskElement);
        } else if (task.column === "done") {
            document.getElementById("doneContainer").appendChild(taskElement);
        }

        document.getElementById("taskTableBody").appendChild(rowElement);
        });
    };

    request.onerror = function (event) {
        console.error("Error:", event.target.errorCode);
    };
    }

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