var Promise = require('bluebird');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var Provider = require('react-redux').Provider;
var exphbs = require('express-handlebars');
var jwt = require('jsonwebtoken');
var sass = require('node-sass-middleware');
var webpack = require('webpack');
var config = require('./webpack.config');

// Load environment variables from .env file
dotenv.load();

// Models
var User = require('./models/User');

// Controllers
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var articleController = require('./controllers/article');

// React and Server-Side Rendering
var routes = require('./app/routes');
var configureStore = require('./app/store/configureStore').default;

var app = express();

var compiler = webpack(config);

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function ifeq(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON: function toJSON(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(sass({ src: path.join(__dirname, 'public'), dest: path.join(__dirname, 'public') }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function checkIsAuthenticated(req, res, next) {
  req.isAuthenticated = function isAuthenticatedReq() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1])
      || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    new User({ id: payload.sub })
      .fetch()
      .then(function isAuthenticatedUser(user) {
        req.user = user;
        next();
      });
  } else {
    next();
  }
});

if (app.get('env') === 'development') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

// Article
app.post('/article', articleController.articlePost);
app.get('/article', articleController.articleGet);

app.post('/contact', contactController.contactPost);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset/:token', userController.resetPost);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.post('/auth/facebook', userController.authFacebook);
app.get('/auth/facebook/callback', userController.authFacebookCallback);
app.post('/auth/twitter', userController.authTwitter);
app.get('/auth/twitter/callback', userController.authTwitterCallback);


// React server rendering
app.use(function reactServerRendering(req, res) {
  var initialState = {
    auth: { token: req.cookies.token, user: req.user },
    messages: {}
  };

  var store = configureStore(initialState);

  Router.match({
    routes: routes.default(store), location: req.url
  }, function reactRouter(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const fetchedData = renderProps.components
            .filter((component) => component.fetchData)
            .map((component) => component.fetchData(store, renderProps.params));

      Promise.all(fetchedData)
              .then(() => {
                var html = ReactDOM.renderToString(
                  <Provider store={store}>
                    <Router.RouterContext {...renderProps} />
                  </Provider>
                );
                res.render('layouts/main', {
                  html,
                  initialState: store.getState()
                });
              })
              .catch((errFetch) => {
                console.log(errFetch);
                res.sendStatus(500);
              });
    } else {
      res.sendStatus(404);
    }
  });
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function productionErrorHandler(err, req, res) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function appListen() {
  console.log(`Express server listening on port ${app.get('port')}`);
});

module.exports = app;
