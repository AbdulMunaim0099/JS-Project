function injectNavbar() {
    return `
        <!-- Navbar -->
        <nav class="bg-blue-500 p-4">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <span class="text-white text-lg font-bold">Task Manager</span>
                <div>
                    <button id="requestDisplay" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Requests</button>
                    <button id="profile" class="bg-blue-700 text-white px-4 py-2 rounded mr-2">Profile</button>
                    <button id="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </div>
        </nav>
    `;
}

function injectStatistics() {
    return `
        <div class="flex gap-8 self-center">
            <div class="bg-white rounded-xl border p-10 flex flex-col gap-5 text-green-500">
                <div class="text-2xl font-bold text-center">Total Approved Requests</div>
                <div id="totalApprovedRequests" class="text-6xl font-bold text-center">0</div>
            </div>
        
            <div class="bg-white rounded-xl border p-10 flex flex-col gap-5 text-orange-500">
                <div class="text-2xl font-bold text-center">Total Tasks</div>
                <div id="totalTasks" class="text-6xl font-bold text-center">0</div>
            </div>
        </div>
    `;
}

function injectRequestModal() {
    return `
        <!-- Request Modal -->
        <div id="requestModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Requests</h2>
                    <button id="closeRequest" class="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <div id="displayRequest_DIV">
                    <!-- Requests will be dynamically added here -->
                </div>
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
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editEmail">Email</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="editEmail" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editPassword">Password</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="password" id="editPassword">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="editAccountType">Account Type</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="editAccountType" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Save</button>
                </form>
            </div>
        </div>
    `;
}

// Inject HTML
document.getElementById('dashboard').innerHTML = `
    ${injectNavbar()}
    ${injectStatistics()}
    ${injectRequestModal()}
    ${injectProfileModal()}
    ${injectEditProfileModal()}
`;
