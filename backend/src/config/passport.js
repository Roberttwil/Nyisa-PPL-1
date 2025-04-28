// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// function extractProfileGoogle(profile) {
//     return {
//         email: profile.emails[0].value,
//         username: profile.displayName || profile.emails[0].value
//     };
// }

// function extractProfileFacebook(profile) {
//     const email = profile.emails && profile.emails[0]?.value;
//     return {
//         email,
//         username: profile.displayName || email
//     };
// }

// // GOOGLE STRATEGY
// passport.use(new GoogleStrategy(
//     {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: '/api/auth/social/google/callback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const userProfile = extractProfileGoogle(profile);
//         return done(null, userProfile);
//     }
// ));

// // FACEBOOK STRATEGY
// passport.use(new FacebookStrategy(
//     {
//         clientID: process.env.FACEBOOK_APP_ID,
//         clientSecret: process.env.FACEBOOK_APP_SECRET,
//         callbackURL: '/api/auth/social/facebook/callback',
//         profileFields: ['id', 'emails', 'name', 'displayName']
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const userProfile = extractProfileFacebook(profile);
//         return done(null, userProfile);
//     }
// ));