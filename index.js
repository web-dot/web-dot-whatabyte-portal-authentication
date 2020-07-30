// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const { domain } = require("process");

require("dotenv").config();

const authRouter = require("./auth");


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";


/**
 *Session configuration 
 */

 //session (configuration object)
const session = {
  secret : "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production"){
// Serve secure cookies, require HTTPS
session.cookie.secure = true;
}

 /**
 * Passport configuration
 */

const strategy = new Auth0Strategy(
  {
    domain: "dev-vdscszyl.us.auth0.com",
    clientID: "v8IXPCeB1Q06CqGBKSCYGmIsEeFk5d83",
    clientSecret: "Mux5uaFbJleNV10CmEHvwOhUJGC4ay8Ro_ulGsVGMGZeyVzsLRo_aU78B_fmrzSC",
    callbackURL:
    "http://localhost:8000/callback" || "http://localhost:3000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);


/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creating custom middleware with express

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next()
});

// Router mounting
app.use("/", authRouter);

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
