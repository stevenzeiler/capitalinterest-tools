require("dotenv").config();

const express = require('express');

const port = 3000;

const app = express();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var exphbs  = require('express-handlebars');

const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_CALLBACK_URL
);

oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN
});

var passport = require('passport')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;

app.use(passport.initialize());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    return cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/userinfo.email'
  ]}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/channels', (req, res) => {

  var service = google.youtube('v3');

    service.channels.list({
    auth: oauth2Client,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    res.json(response);
  });

});

app.get('/playlists', (req, res) => {

  var youtube = google.youtube('v3');

  youtube.playlistItems.list({
    auth: oauth2Client,
    part: 'id,snippet,contentDetails',
    playlistId: 'PLtDBLDfob7PNMjOFwJHATITlEwoJXGgSf',
    maxResults: 50,
    forUsername: 'stevenzeiler'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    res.json(response.data.items.map(item => {

      return {

        title: item.snippet.title,
        
        thumbnail: item.snippet.thumbnails.high.url,

        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`

      }
    
    }));
  });

});

app.listen(port, () => {

  console.log(`express listening on port ${port}`);

});

