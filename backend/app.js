import express from 'express';
import submissionsRouter from './routes/submissions.js';
import problemsRouter from './routes/problems.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/submissions', submissionsRouter);
app.use('/problems', problemsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});