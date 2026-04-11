const API_BASE = '';

async function apiFetch(path, { method = 'GET', body = null, headers = {} } = {}) {
    const token = localStorage.getItem('token');
    const opts = { method, headers: { ...headers } };

    if (token) opts.headers['Authorization'] = `Bearer ${token}`;

    if (body !== null) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    }

    const res = await fetch(API_BASE + path, opts);
    const text = await res.text();

    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const errMsg =
            data?.message ||
            (data?.errors && data.errors.map(e => e.msg).join('; ')) ||
            res.statusText;

        throw new Error(errMsg);
    }

    return data;
}

function setAuth(user, token) {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function currentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function el(tag, attrs = {}, text = '') {
    const node = document.createElement(tag);

    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') node.className = v;
        else node.setAttribute(k, v);
    });

    if (text) node.textContent = text;
    return node;
}

function fmtDate(s) {
    try {
        return new Date(s).toLocaleString();
    } catch {
        return s;
    }
}

function doLogout() {
    clearAuth();
    renderNav();
    window.location.href = './login.html';
}

function renderNav() {
    const navRoot = document.getElementById('nav-root');
    if (!navRoot) return;

    const user = currentUser();
    navRoot.innerHTML = '';

    navRoot.appendChild(el('a', { href: './index.html' }, 'Home'));
    navRoot.appendChild(el('a', { href: './stats.html' }, 'Stats'));

    if (user) {
        navRoot.appendChild(el('a', { href: './post_form.html' }, 'New Post'));
        navRoot.appendChild(el('a', { href: './profile.html' }, 'Profile'));

        navRoot.appendChild(el('span', { class: 'spacer' }));
        navRoot.appendChild(el('span', {}, `Signed in as ${user.username}`));

        const logoutBtn = el('button', { class: 'btn' }, 'Logout');
        logoutBtn.addEventListener('click', doLogout);
        navRoot.appendChild(logoutBtn);
    } else {
        navRoot.appendChild(el('a', { href: './login.html' }, 'Login'));
        navRoot.appendChild(el('a', { href: './register.html' }, 'Register'));
    }
}

document.addEventListener('DOMContentLoaded', renderNav);