import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './router/userRouter';
import { postRouter } from './router/postRouter';
import { authRouter } from './middlewares/handleauth';

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.use('/', authRouter)
app.use('/Users', userRouter);
app.use('/Posts', postRouter);


app.use('/', (req, res, next) => {
    res.sendFile('index.html', {root: 'public'});
});


app.listen(port);