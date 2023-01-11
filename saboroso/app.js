var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const formidable = require('formidable');
var logger = require('morgan');
const session = require("express-session")
let RedisStore = require("connect-redis")(session)
const http = require('http');


// Configuration REDIS.
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true, })
redisClient.connect().catch(console.error)



var app = express();

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', function(socket){
    console.log('Novo usuário conectado!')

});

var indexRouter = require('./routes/index')(io);
var usersRouter = require('./routes/users')(io);
var adminRouter = require('./routes/admin')(io);


app.use(function(req,res,next){

    req.body = {};

    if(req.method === "POST"){
        var form = formidable({
        uploadDir: path.join(__dirname, "/public/images"),
        keepExtensions: true
    });

        form.parse(req, function(err, fields, files){
            req.body = fields;
            req.fields = fields;
            req.files = files;
        next();
    });
    } else {
        next();
    };
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: true,
        secret: "keyboard cat",
        resave: true,
    })
)

// app.use(session({
//   store: new RedisStore({
//     client: redisClient
//   }),
//   secret: 'p@ss0rd',
//   resave: true,
//   saveUninitialized: true,
// }));

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
