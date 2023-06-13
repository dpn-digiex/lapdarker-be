import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import route from './src/routes/index.js';
import connectDB from './src/config/db/index.js';
import methodOverride from 'method-override';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// * config
connectDB();
app.use(bodyParser.json({ limit: '30mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '30mb'
  })
);
app.use(cors());
app.use(methodOverride('_method'));

// * Routes init
route(app);

// * config passport
app.use(passport.initialize());

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'https://0e74-210-2-99-130.ngrok.io/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      console.log(profile);
    }
  )
);
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// * Access port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
