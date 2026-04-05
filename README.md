# Blogging

### Project overview

A simple blogging web application demonstrating advanced NoSQL design and MongoDB features.
It contains a Node.js + Express backend (REST API) with MongoDB (Mongoose) and a plain HTML, JS frontend.
Goal: demonstrate embedded & referenced data models, multi-stage aggregations, compound indexes, transactions , and real business logic (posts, comments, tags, likes, stats).

### Features

- Authentication (JWT) — register / login.
- Posts: full CRUD, tags, categories, status-, likes.
- Comments: referenced comments collection + embedded commentsPreview in posts.
- Aggregations: top posts, popular tags, posts by author, monthly posts and average comments per post.
- Indexing: compound and text indexes to optimize common queries.
- Admin role: admin (set via DB) can edit/delete any post/comment.
- Frontend: pages for posts list, post detail, create/edit post, login/register, profile/my posts, stats.

### Quick Start

```
cd backend
node src/server.js
```

### Advanced Patterns
- **Hybrid Modeling**: Use a combination of References (for Users/Posts) and Embedding (for Comment Previews) to satisfy the "One-to-Many" relationship efficiently.
- **ACID Transactions**: Implemented in `commentController.js` to ensure that when a comment is added, both the `Comments` collection and the `Post.commentsPreview` are updated atomically.

### Indexing Strategy
- **Compound Index**: `db.posts.createIndex({ status: 1, createdAt: -1 })` optimized for the main feed.
- **Performance Justification**: Reduces query execution time by avoiding memory sorts.

### Aggregation Example (Stats Page)
`/api/stats` endpoint uses a 5-stage pipeline:
1. `$match`: Filter posts by timeframe.
2. `$group`: Calculate total likes and average comments per post.
3. `$lookup`: Join with User data for top authors.
4. `$project`: Shape final data for Chart.js.

## API Endpoints (10 Total)
- **Auth**: `POST /auth/login`, `POST /auth/register`
- **Posts**: `GET /posts`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`
- **Comments**: `POST /comments/:postId`, `DELETE /comments/:commentId`
- **Stats**: `GET /stats/summary` (Aggregation)
- **Likes**: `POST /posts/:id/like` ($inc operator)
