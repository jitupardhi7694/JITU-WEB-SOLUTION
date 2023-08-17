const express = require('express');
const app = express();
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const port = process.env.PORT || 3000;

app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout/main_layout');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/indexRoute'));

app.listen(port, (error) => {
    if (error) throw error;
    else console.log('listening on port http://localhost:3000');
});
