const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: '4season',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

const auth = require('./controllers/auth');
const todos = require('./controllers/todos');

app.get('/', (req, res) => {
  res.send('toDoList server connected');
});

app.post('/login', auth.login);
app.post('/logout', auth.logout);
app.post('/signup', auth.signup);

app.get('/calendar', todos.get);
app.get('/calendar/:yearMonth', todos.get);
app.post('/calendar', todos.post);
app.patch('/calendar', todos.update);
app.delete('/calendar', todos.delete);

app.listen(5000, () => {
  console.log('server on port 5000');
});
