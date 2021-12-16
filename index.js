process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var config = require('./config/config.js');

var app = express();
app.use(cors());

app.use(bodyParser.json({
        limit: '50mb'
    })
);
// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));

app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name: "connect.gc2",
    cookie: {secure: false}
}));

// Hack for oplevsyddjurs
app.use('^/$', function (req, res, next) {
    let url = '/app/syddjursgis/?';
    let go = false;

    if (req?.query?.uuid) {
        url += '&uuid=' + req?.query?.uuid;
        go = true;
    }
    if (req?.query?.layers) {
        url += '&layers=' + req?.query?.layers;
        go = true;
    }
    if (go) {
        res.redirect(302, url);
    }
    next();
});

app.use('/app/:db/:schema?', express.static(path.join(__dirname, 'public'), {maxage: '60s'}));

if (config.staticRoutes) {
    for (var key in config.staticRoutes) {
        if (config.staticRoutes.hasOwnProperty(key)) {
            console.log(key + " -> " + config.staticRoutes[key]);
            app.use('/app/:db/:schema/' + key, express.static(path.join(__dirname, config.staticRoutes[key]), {maxage: '60s'}));
        }
    }
}

app.use('/', express.static(path.join(__dirname, 'public'), {maxage: '1h'}));

app.use(require('./controllers'));

app.use(require('./extensions'));

app.enable('trust proxy');

var server = app.listen(3000, function () {
    console.log('Listening on port 3000...');
});

global.io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log(socket.id);
});
