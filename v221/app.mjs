import express from 'express';
import { engine } from 'express-handlebars';

const app = express()

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');