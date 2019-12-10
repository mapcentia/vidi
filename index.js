/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var path = require('path');
require('dotenv').config({path: path.join(__dirname, ".env")});

var express = require('express');
var cluster = require('express-cluster');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var redis = require("redis");
//var redisStore = require('connect-redis')(session);
//var client = redis.createClient();
var cors = require('cors');
var config = require('./config/config.js');

cluster(function (worker) {
    var app = express();
    app.use(compression());
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json({
            limit: '50mb'
        })
    );
// to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true,
        limit: '50mb'
    }));

    app.set('trust proxy', 1); // trust first proxy

    app.use(session({
        store: new fileStore({
            ttl: 86400,
            logFn: function () {
            },
            path: "/tmp/sessions"
        }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        name: "connect.gc2",
        cookie: {secure: false}
    }));

    /*
    app.use(session({
        // create new redis store.
        store: new redisStore({
            host: '172.18.0.4',
            port: 6379,
            client: client,
            ttl: 260
        }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        name: "connect.gc2",
        cookie: {secure: false}

    }));
    */

    app.use('/app/:db/:schema?', express.static(path.join(__dirname, 'public'), {maxage: '60s'}));

    if (config.staticRoutes) {
        for (var key in config.staticRoutes) {
            if (config.staticRoutes.hasOwnProperty(key)) {
                console.log(key + " -> " + config.staticRoutes[key]);
                app.use('/app/:db/:schema/' + key, express.static(path.join(__dirname, config.staticRoutes[key]), {maxage: '60s'}));
            }
        }
    }

    app.use('/', express.static(path.join(__dirname, 'public'), {maxage: '100d'}));
    app.use(require('./controllers'));
    app.use(require('./extensions'));
    app.enable('trust proxy');

    const port = process.env.PORT ? process.env.PORT : 3000;

    var server = app.listen(port, function () {
        console.log(`Worker ${worker.id} Listening on port ${port}...`);
        global.workerId = worker.id;
    });

    global.io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log(socket.id);
    });
    return server
}, {verbose: true});

