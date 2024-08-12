function injectNavbar() {
    return `
        <!-- Navbar -->
        <nav class="bg-blue-500 p-4">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
                <span class="text-white text-lg font-bold">Task Manager</span>
                <div class="flex flex-row gap-1" >
                    <button id="requestManage" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Request</button>
                    <button id="addTask" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Add Task</button>
                    <button id="profile" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Profile</button>
                    <button id="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </div>
        </nav>
    `;
}

function injectPriorityCards() {
    return `
        <!-- Cards for Priority Flags -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div class="card flex flex-col gap-4 bg-white text-blue-500 p-6 rounded-lg shadow-lg text-center cursor-pointer" onclick="redirect('do_first')">
                <h2 class="text-3xl font-bold">Do First</h2>
                <div id="doFirst_count" class="text-6xl font-semibold">0</div>
            </div>
            <div class="card flex flex-col gap-4 bg-white text-green-500 p-6 rounded-lg shadow-lg text-center cursor-pointer" onclick="redirect('do_next')">
                <h2 class="text-3xl font-bold">Do Next</h2>
                <div id="doNext_count" class="text-6xl font-semibold">0</div>
            </div>
            <div class="card flex flex-col gap-4 bg-white text-yellow-500 p-6 rounded-lg shadow-lg text-center cursor-pointer" onclick="redirect('delegate')">
                <h2 class="text-3xl font-bold">Delegate</h2>
                <div id="delegate_count" class="text-6xl font-semibold">0</div>
            </div>
            <div class="card flex flex-col gap-4 bg-white text-red-500 p-6 rounded-lg shadow-lg text-center cursor-pointer" onclick="redirect('eliminate')">
                <h2 class="text-3xl font-bold">Eliminate</h2>
                <div id="eliminate_count" class="text-6xl font-semibold">0</div>
            </div>
        </div>
    `;
}

function injectProfileModal() {
    return `
        <!-- Profile Modal -->
        <div id="profileModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Profile</h2>
                    <button id="closeProfile" class="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <div>
                    <p><strong>Email:</strong> <span id="profileEmail"></span></p>
                    <p><strong>Account Type:</strong> <span id="profileAccountType"></span></p>
                </div>
                <button id="editProfile" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
            </div>
        </div>
    `;
}

function injectEditProfileModal() {
    return `
    <!-- Edit Profile Modal -->
    <div id="editProfileModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Edit Profile</h2>
                <button id="closeEditProfile" class="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            <form id="editProfileForm">
                <div id="editProfileMessage" class="hidden text-center"> </div>
                <div class="mb-4">
                    <label class="block text-gray-700" for="oldEmail">Old Email</label>
                    <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="oldEmail" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700" for="editEmail">Email</label>
                    <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="editEmail" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700" for="editPassword">Password</label>
                    <input class="w-full p-2 border border-gray-300 rounded mt-2" type="password" id="editPassword" required>
                </div>
                
                <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Save</button>
            </form>
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
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="text" id="taskTitle" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="taskDueDate">Due Date</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="date" id="taskDueDate" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="taskPriority">Priority</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="taskPriority" required>
                            <option value="do_first">Do First</option>
                            <option value="do_next">Do Next</option>
                            <option value="delegate">Delegate</option>
                            <option value="eliminate">Eliminate</option>
                        </select>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Add</button>
                </form>
            </div>
        </div>
    `;
}

function injectRequestModal() {
    return `
        <!-- Add Request Modal -->
        <div id="requestModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Send Request</h2>
                    <button id="closeRequest" class="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form id="sendRequestForm">
                    <div class="mb-4">
                        <label class="block text-gray-700" for="userID">User Email</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="text" id="userID" required>
                    </div>
                    <div id="requestMessage" class="hidden mt-4 p-2 rounded"></div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Send</button>
                </form>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = `
        ${injectNavbar()}
        <div class="max-w-7xl mx-auto mt-10">
            ${injectPriorityCards()}
        </div>
        ${injectProfileModal()}
        ${injectEditProfileModal()}
        ${injectAddTaskModal()}
        ${injectRequestModal()}
    `;
}

renderDashboard();
