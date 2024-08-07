document.addEventListener('DOMContentLoaded', () => {

    function injectRegister() {
        const registerHTML = `
            <!-- Registration Form -->
            <div id="register" class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md hidden">
                <h2 class="text-2xl font-bold mb-4">Register</h2>
                <div id="registerMessage" class="hidden p-2 mb-4 rounded"></div>
                <form id="registerForm">
                    <div class="mb-4">
                        <label class="block text-gray-700" for="regEmail">Email</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="regEmail" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="regPassword">Password</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="password" id="regPassword" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="regAccountType">Account Type</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="regAccountType" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Register</button>
                    <button id="toLogin" class="w-full bg-gray-500 text-white py-2 rounded mt-4" type="button">Already have an account? Login</button>
                </form>
            </div>
        `;

        return registerHTML;
    }

    function injectLogin() {
        const loginHTML = `
            <!-- Login Form -->
            <div id="login" class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Login</h2>
                <div id="loginMessage" class="hidden p-2 mb-4 rounded"></div>
                <form id="loginForm">
                    <div class="mb-4">
                        <label class="block text-gray-700" for="loginEmail">Email</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="loginEmail" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="loginPassword">Password</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="password" id="loginPassword" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="loginAccountType">Account Type</label>
                        <select class="w-full p-2 border border-gray-300 rounded mt-2" id="loginAccountType" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Login</button>
                    <button id="toRegister" class="w-full bg-gray-500 text-white py-2 rounded mt-4" type="button">Don't have an account? Register</button>
                    <button id="toForgotPassword" class="w-full bg-yellow-500 text-white py-2 rounded mt-4" type="button">Forgot Password?</button>
                </form>
            </div>
        `;

        return loginHTML;
    }

    function injectForgotPassword() {
        const forgotPasswordHTML = `
            <!-- Forgot Password Form -->
            <div id="forgotPassword" class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md hidden">
                <h2 class="text-2xl font-bold mb-4">Forgot Password</h2>
                <div id="forgotPasswordMessage" class="hidden p-2 mb-4 rounded"></div>
                <form id="forgotPasswordForm">
                    <div class="mb-4">
                        <label class="block text-gray-700" for="forgotEmail">Email</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="email" id="forgotEmail" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700" for="newPassword">New Password</label>
                        <input class="w-full p-2 border border-gray-300 rounded mt-2" type="password" id="newPassword" required>
                    </div>
                    <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Reset Password</button>
                    <button id="backToLogin" class="w-full bg-gray-500 text-white py-2 rounded mt-4" type="button">Back to Login</button>
                </form>
            </div>
        `;

        return forgotPasswordHTML;

    }


    
    

    document.body.innerHTML = `
                                ${injectLogin()}
                                ${injectRegister()}
                                ${injectForgotPassword()}
    `;


    document.getElementById('toLogin').addEventListener('click', () => {
        document.getElementById('register').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });

    document.getElementById('toRegister').addEventListener('click', () => {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('register').classList.remove('hidden');
    });

    document.getElementById('toForgotPassword').addEventListener('click', () => {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('forgotPassword').classList.remove('hidden');
    });


    document.getElementById('backToLogin').addEventListener('click', () => {
        document.getElementById('forgotPassword').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });
    // injectLogin();
    // injectRegister();
    // injectForgotPassword();
});
