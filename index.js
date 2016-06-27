var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use('/app/:db/:schema', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});