function injectNavbar() {
    return `
        <!-- Navbar -->
        <nav class="bg-blue-500 p-4">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
                <span class="text-white text-lg font-bold">Task Manager</span>
                <div class="flex flex-row gap-1" >
                    <a href="./userDashboard.html" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Dashboard</a>
                    <button id="toggleView" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Switch to Kanban</button>
                    <button id="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </div>
        </nav>
    `;  
}

function injectKanbanView() {
    return `
        <!-- Kanban Board -->
        
        <div id="kanbanView" class="hidden">
        <button id="addTask" class="bg-green-500 text-white px-4 py-2 w-full sm:w-40 rounded mb-4">+ Add Task</button>
    
        <div class="flex gap-4 justify-start md:justify-center w-full overflow-x-auto">
            <!-- Tasks Column -->
            <div id="tasks" class="column flex-shrink-0 flex flex-col border-2 rounded-xl p-5 pb-28 w-96 bg-white" ondrop="drop(event)" ondragover="allowDrop(event)">
                <h2 class="text-xl font-bold mb-4 flex justify-between">Tasks
                    <div id="tasks_count">0</div>
                </h2>
                <div id="tasksContainer" class="flex flex-col gap-5"></div> 
            </div>
            <!-- Inprocess Column -->
            <div id="inprocess" class="column flex-shrink-0 flex flex-col border-2 rounded-xl p-5 pb-28 w-96 bg-white" ondrop="drop(event)" ondragover="allowDrop(event)">
                <h2 class="text-xl font-bold mb-4 flex justify-between">Inprocess
                    <div id="inProcess_count">0</div>
                </h2>
                <div id="inprocessContainer" class="flex flex-col gap-5"></div>
            </div>
            <!-- Done Column -->
            <div id="done" class="column flex-shrink-0 flex flex-col border-2 rounded-xl p-5 pb-28 w-96 bg-white" ondrop="drop(event)" ondragover="allowDrop(event)">
                <h2 class="text-xl font-bold mb-4 flex justify-between">Done</h2>
                <div id="doneContainer" class="flex flex-col gap-5"></div>
            </div>
        </div>
    </div>
    
    `;
}

function injectListView() {
    return `
    <!-- Task List -->
<div id="listView" class="w-full overflow-x-auto">
    <button id="addTaskList" class="bg-green-500 text-white px-4 py-2 w-full sm:w-auto rounded mb-4">+ Add Task</button>
    <div class="overflow-x-auto">
        <table class="w-full bg-white min-w-[640px] sm:min-w-[800px]">
            <thead>
                <tr>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">Task ID</th>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">Task</th>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">Due Date</th>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">Priority</th>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">List</th>
                    <th class="py-3 px-4 border-b border-gray-200 text-left">Action</th>
                </tr>
            </thead>
            <tbody id="taskTableBody"></tbody>
        </table>
    </div>
</div>

    
    `;
}

function injectAddTaskModal() {
    return `
        <!-- Add Task Modal -->
        <div id="addTaskModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Add Task</h2>
                    <button id="closeAddTask" class="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form id="addTaskForm">
                    <div class="mb-4">
                        <label class="block text-gray-700" for="taskTitle">Title</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="text" id="taskTitle" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="taskDueDate">Due Date</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="date" id="taskDueDate" required />
                    </div>
                    <!-- <div class="mb-4">
                        <label class="block text-gray-700" for="taskPriority">Priority</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="taskPriority" required>
                            <option value="do_first">Do First</option>
                            <option value="do_next">Do Next</option>
                            <option value="delegate">Delegate</option>
                            <option value="eliminate">Eliminate</option>
                        </select>
                    </div> -->
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Add</button>
                </form>
            </div>
        </div>
    `;
}

function injectEditTaskModal() {
    return `
        <!-- Edit Task Modal -->
        <div id="editTaskModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Edit Task</h2>
                    <button id="closeEditTask" class="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form id="editTaskForm">
                    <input type="hidden" id="editTaskId" />
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editTaskTitle">Title</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="text" id="editTaskTitle" required/>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editTaskDueDate">Due Date</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="date" id="editTaskDueDate" required/>
                    </div>
                    <!-- <div class="mb-4">
                        <label class="block text-gray-700" for="editTaskPriority">Priority</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="editTaskPriority" required>
                            <option value="do_first">Do First</option>
                            <option value="do_next">Do Next</option>
                            <option value="delegate">Delegate</option>
                            <option value="eliminate">Eliminate</option>
                        </select>
                    </div> -->
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editTaskList">List</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="editTaskList" required>
                            <option value="tasks">Task</option>
                            <option value="inprocess">Inprocess</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Update</button>
                </form>
            </div>
        </div>
    `;
}

function renderTaskView() {
    const taskView = document.getElementById('taskView');
    taskView.innerHTML = `
        ${injectNavbar()}
        <div class="flex flex-col gap-4 justify-center pl-20 pr-20">
            ${injectKanbanView()}
            ${injectListView()}
            ${injectAddTaskModal()}
            ${injectEditTaskModal()}
        </div>
    `;
}

renderTaskView();
