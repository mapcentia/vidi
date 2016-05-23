var express = require('express');
var path = require('path');

var app = express();

app.use('/:db/:schema', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});