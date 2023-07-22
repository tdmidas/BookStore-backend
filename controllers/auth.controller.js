const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
	//REGISTER
	registerUser: async (req, res) => {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(req.body.password, salt);

			// Check if the 'email' field is provided and not null or empty
			if (!req.body.email || req.body.email.trim() === "") {
				return res.status(400).json({ error: "Email is required." });
			}

			// Check if a user with the same email already exists in the database
			const existingUser = await User.findOne({ email: req.body.email });
			if (existingUser) {
				return res.status(409).json({ error: "Email is already registered." });
			}

			// Create new user
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: hashed,
			});

			// Save user to DB
			const user = await newUser.save();
			return res.status(200).json(user);
		} catch (err) {
			return res.status(500).json(err);
		}
	},

	generateAccessToken: (user) => {
		return jwt.sign(
			{
				_id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_ACCESS_KEY,
			{ expiresIn: "12h" }
		);
	},

	generateRefreshToken: (user) => {
		return jwt.sign(
			{
				_id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_REFRESH_KEY,
			{ expiresIn: "365d" }
		);
	},

	//LOGIN
	loginUser: async (req, res) => {
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return res.status(404).json("Incorrect email");
			}
			const validPassword = await bcrypt.compare(req.body.password, user.password);
			if (!validPassword) {
				return res.status(404).json("Incorrect password");
			}
			if (user && validPassword) {
				//Generate access token
				const accessToken = authController.generateAccessToken(user);
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: true,
					path: "/",
					sameSite: "strict",
				});
				//Generate refresh token
				const refreshToken = authController.generateRefreshToken(user);
				refreshTokens.push(refreshToken);
				//STORE REFRESH TOKEN IN COOKIE
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: true,
					path: "/",
					sameSite: "strict",
				});
				const { password, ...others } = user._doc;
				return res.status(200).json({ ...others, accessToken });
			}
		} catch (err) {
			res.status(500).json(err);
		}
	},

	requestRefreshToken: async (req, res) => {
		//Take refresh token from user
		const refreshToken = req.cookies.refreshToken;
		//Send error if token is not val_id
		if (!refreshToken) return res.status(401).json("You're not authenticated");
		if (!refreshTokens.includes(refreshToken)) {
			return res.status(403).json("Refresh token is not valid");
		}
		jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
			if (err) {
				console.log(err);
			}
			refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
			//create new access token, refresh token and send to user
			const newAccessToken = authController.generateAccessToken(user);
			const newRefreshToken = authController.generateRefreshToken(user);
			refreshTokens.push(newRefreshToken);
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: false,
				path: "/",
				sameSite: "strict",
			});
			res.status(200).json({
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			});
		});
	},

	//LOG OUT
	logOut: async (req, res) => {
		//Clear cookies when user logs out
		refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
		res.clearCookie("refreshToken");
		res.clearCookie("accessToken");
		return res.status(200).json("Logged out successfully!");
	},
};

module.exports = authController;
