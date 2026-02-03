const Auth = (() => {
    function init() {
        try {
            if (typeof renderNav === 'function') renderNav();
        } catch (e) {}

        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.type = 'button';
            loginBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                console.log('login button clicked');
                login();
            });
        }

        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.type = 'button';
            registerBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                console.log('register button clicked');
                register();
            });
        }

        const pwd = document.getElementById('login-password');
        if (pwd) {
            pwd.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    login();
                }
            });
        }

        const loginForm = document.querySelector('form#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                login();
            });
        }
    }

    async function login() {
        console.log('Auth.login called');
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        const err = document.getElementById('login-error');
        if (err) err.textContent = '';

        if (!emailEl || !passEl || !err) {
            console.error('Missing DOM nodes: ', { emailEl, passEl, err });
            return;
        }

        const email = emailEl.value.trim();
        const password = passEl.value;
        if (!email || !password) {
            err.textContent = 'Email and password required';
            return;
        }

        try {
            const res = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
            console.log('login response:', res);
            setAuth(res.user, res.token);
            renderNav();
            window.location.href = './index.html';
        } catch (e) {
            console.error('login error', e);
            const msg = e?.message || e?.body?.message || 'Login failed';
            err.textContent = msg;
        }
    }

    async function register() {
        console.log('Auth.register called');
        const username = document.getElementById('reg-username')?.value.trim();
        const email = document.getElementById('reg-email')?.value.trim();
        const password = document.getElementById('reg-password')?.value;
        const err = document.getElementById('register-error');
        if (err) err.textContent = '';
        if (!username || !email || !password) { if (err) err.textContent = 'All fields required'; return; }
        try {
            const res = await apiFetch('/api/auth/register', { method: 'POST', body: { username, email, password } });
            setAuth(res.user, res.token);
            renderNav();
            window.location.href = './index.html';
        } catch (e) {
            console.error('register error', e);
            const msg = e?.message || e?.body?.message || 'Register failed';
            if (err) err.textContent = msg;
        }
    }

    return { init, login, register };
})();

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof Auth !== 'undefined' && Auth && typeof Auth.init === 'function') {
            Auth.init();
        }
    } catch (err) {
        console.error('Auth init error', err);
    }
});
