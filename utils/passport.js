const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User");
require("dotenv").config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
			scope: ["profile", "email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Look for an existing user with the Google ID in the profile
				let existingUser = await User.findOne({ googleId: profile.id });

				if (existingUser) {
					// If an existing user is found, call done with the user object
					done(null, existingUser);
				} else {
					// If no existing user is found, create a new user
					const newUser = new User({
						name: profile.displayName,
						email: profile.emails[0].value,
						googleId: profile.id,
					});

					// Save the new user to the database
					let savedUser = await newUser.save();

					// Call done with the newly created user object
					done(null, savedUser);
				}
			} catch (err) {
				// If there's an error, call done with the error
				done(err, null);
			}
		}
	)
);
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
