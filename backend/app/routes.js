var express  = require('express');
var moment = require('moment-timezone');
// workaround as suggested in http://momentjs.com/docs/
require('moment/locale/de');

//console.log(moment().tz("Europe/Berlin").startOf('day').format());
//console.log(moment('2016-06-24').tz('Europe/Berlin').startOf('day').format())
var Event = require('../models/event');
var User = require('../models/user');

module.exports = function(app, passport){// route for home page

    app.get('/api/events', function(req, res) {
        Event.find({}, function(err, event) {

            if (err) {
                return done(err);
            }

            if (event) {
                res.send(JSON.stringify({
                    events: event
                }));
            } else {
                res.send(JSON.stringify({
                    events: []
                }));
            }
        });
    });

    app.get('/api/events/:date', function(req, res) {
        var date = moment(req.params.date).tz('Europe/Berlin').startOf('day').format();

        // Story
        //     .findOne({ title: 'Once upon a timex.' })
        //     .populate('_creator')
        //     .exec(function (err, story) {
        //         if (err) return handleError(err);
        //         console.log('The creator is %s', story._creator.name);
        //         // prints "The creator is Aaron"
        //     });

        Event
            .findOne({date: date})
            .populate('users', 'facebook.name')
            .exec(function (err, event) {

                if (err) {
                    return done(err);
                }

                if (event) {
                    res.send(JSON.stringify({
                        events: event
                    }));
                } else {
                    res.send(JSON.stringify({
                        events: []
                    }));
                }
            });
        ;
    });

    // post to events with date to create new event
    app.post('/api/events', function(req, res) {
        var date = moment(req.body.date).tz('Europe/Berlin').startOf('day').format();


        Event.find({date: date}, function(err, event) {

            if (err) {
                return done(err);
            }

            // console.log(new Date(date))
            // res.send(JSON.stringify({
            //     event: event
            // }));
            // return;
            // return done(null, event);
            //


            // event already available on this date
            if (event.length > 0) {

                // add user to this event
                if(req.user) {
                    var userIndex = event.users.indexOf(user._id);

                    // remove
                    if(userIndex > 0) {
                        event.users.splice(userIndex, 1);
                    } else {
                        event.users.push(user._id);
                    }

                    event.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log("User added to this event");
                    });

                    console.log('no user found');
                    // User.findOne({ email: req.user.facebook.email }, function(err, user) {
                    //     if (err) {
                    //         return done(err);
                    //     }
                    //     if (user.length > 0) {
                    //
                    //     }
                    //
                    // });
                }


                res.send(JSON.stringify({
                    event: event
                }));

            // create new event on this date
            } else {
                var newEvent = new Event();
                //console.log(moment().tz('Europe/Berlin').startOf('day').format());
                newEvent.date = date;

                newEvent.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    res.send(JSON.stringify({
                        event: newEvent
                    }));
                });
            }
        });
    });

    app.get('/api/authenticated', function(req, res) {
        res.send(JSON.stringify({
            authenticated: req.isAuthenticated()
        }));
    });

    app.get('/', isLoggedIn, function(req, res) {

        res.render('index', {
            user: req.user
        });
        //res.send('<a href="/auth/facebook" class="btn btn-primary"><span class="fa fa-facebook"></span> Facebook</a>'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {
        res.send('<a href="/auth/facebook" class="btn btn-primary"><span class="fa fa-facebook"></span>Facebook Login</a>'); // load the index.ejs file
    });
    

    app.get('/profile', function(req, res) {
    // app.get('/profile', isLoggedIn, function(req, res) {
        // res.send('back from facebook');

        //res.send(App);
        //res.send(JSON.stringify(req.user));
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/profile'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use('/', express.static(__dirname + "/../../public/"));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/login');
}