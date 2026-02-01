require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    );
    next();
});

app.use(express.json());

const frontendPath = path.join(__dirname, '../../frontend');
console.log('Serving static files from:', frontendPath);
app.use(express.static(frontendPath));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.get(/(.*)/, (req, res) => {
    const requestedPath = req.params[0];
    
    if (requestedPath && requestedPath.includes('.')) {
        res.sendFile(path.join(frontendPath, requestedPath));
    } else {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;