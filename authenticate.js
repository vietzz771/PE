var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id })
            .then((user) => {
                console.log("find user: ", user)
                if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            })
            .catch((err) => {
                console.log("not find user: ")
                return done(err, false)
            });
    }));

exports.verifyOrdinaryUser = function (req, res, next) {

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists and if it starts with "Bearer "
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token by removing the "Bearer " prefix
        const token = authHeader.substring(7);
        
        // decode token
        console.log("token in verifyOrdinaryUser: ", token);
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log("decode: ", decoded);
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 401;
        return next(err);
    }
};

exports.verifyAdmin = function (req, res, next) {
    User.findOne({ _id: req.decoded._id })
        .then((user) => {
            if (!user.admin) {
                // if there is no token
                // return an error
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403 ;
                return next(err);
            } else {
                return next();
            }
        })
};

exports.verifyUser = passport.authenticate('jwt', { session: false });
