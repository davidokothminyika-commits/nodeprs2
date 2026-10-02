import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'node:path'; // 1. Added path module
import db from './config/db.js';
import authRouter from './routes/auth.js';
import pagesRouter from './routes/pages.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(import.meta.dirname, 'public')));

app.set('views', path.join(import.meta.dirname, 'view'));
app.set('view engine', 'ejs'); // Note: 'view engine' does not have a hyphen

db.connect((err) => {
    if (err) throw err;
    console.log("Database connected successfully");
});

app.use('/auth', pagesRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
    res.status(404).sendFile(path.join(import.meta.dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});