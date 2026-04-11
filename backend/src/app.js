require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const client = require('prom-client');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const statsRoutes = require('./routes/stats');

const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDurationSeconds);

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();
    
    res.on('finish', () => {
        if (req.route) {
            const labels = {
                method: req.method,
                route: req.route.path,
                status: res.statusCode
            };
            
            httpRequestCounter.inc(labels);
            end(labels);
        }
    });
    next();
});

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    );
    next();
});

app.use(express.json());

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;