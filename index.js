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

app.use('/app/:db/:schema', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

app.use(require('./controllers/extensions'));

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});