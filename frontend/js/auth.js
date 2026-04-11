const Auth = (() => {
    function init() {
        renderNav();

        document.getElementById('login-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            login();
        });

        document.getElementById('register-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            register();
        });

        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }

    async function login() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const err = document.getElementById('login-error');
        err.textContent = '';

        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            });

            setAuth(res.user, res.token);
            window.location.href = './index.html';
        } catch (e) {
            err.textContent = e.message;
        }
    }

    async function register() {
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const err = document.getElementById('register-error');
        err.textContent = '';

        try {
            const res = await apiFetch('/api/auth/register', {
                method: 'POST',
                body: { username, email, password }
            });

            setAuth(res.user, res.token);
            window.location.href = './index.html';
        } catch (e) {
            err.textContent = e.message;
        }
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', Auth.init);