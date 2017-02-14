var express = require('express');
var path = require('path');
var app = express();
var bulk = require('bulk-require');
var bodyParser = require('body-parser');

app.use(bodyParser.json({
        limit: '50mb'
    })
);
// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));
//app.use(bodyParser({limit: '50mb'}));

app.use('/app/:db/:schema?', express.static(path.join(__dirname, 'public'), { maxage: '100d' }));
app.use('/', express.static(path.join(__dirname, 'public'), { maxage: '100d' }));


app.use(require('./controllers'));

app.use(require('./controllers/extensions'));

var server = app.listen(3000, function () {
    console.log('Listening on port 3000...');
});

global.io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log(socket.id);
});