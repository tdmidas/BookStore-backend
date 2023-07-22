const User = require("../models/User");
const userController = {
	// @desc    Get user profile
	// @route   GET /api/users/profile
	// @access  Private
	getUserProfile: async (req, res) => {
		const user = await User.findById(req.user._id);

		if (user) {
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			});
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	},

	// @desc    Update user profile
	// @route   PUT /api/users/profile
	// @access  Private
	updateUserProfile: async (req, res) => {
		const user = await User.findById(req.user._id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updateUser = await user.save();

			res.json({
				_id: updateUser._id,
				name: updateUser.name,
				email: updateUser.email,
				isAdmin: updateUser.isAdmin,
				token: generateToken(updateUser._id),
			});
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	},

	// @desc    Get all users
	// @route   GET /api/users
	// @access  Private/admin
	getAllUsers: async (req, res) => {
		try {
			const user = await User.find();
			res.status(200).json(user);
		} catch (err) {
			res.status(500).json(err);
		}
	},

	// @desc    Delete user
	// @route   GET /api/users/:id
	// @access  Private/admin
	deleteUser: async (req, res) => {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json("User deleted");
		} catch (err) {
			res.status(500).json(err);
		}
	},

	// @desc    Get user by ID
	// @route   GET /api/users/:id
	// @access  Private/Admin
	getUserById: async (req, res) => {
		const user = await User.findById(req.params.id).select("-password");

		if (user) {
			res.json(user);
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	},

	// @desc    Update user
	// @route   PUT /api/users/:id
	// @access  Private/Admin
	updateUser: async (req, res) => {
		const user = await User.findById(req.params.id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.isAdmin = req.body.isAdmin;

			const updateUser = await user.save();

			res.json({
				_id: updateUser._id,
				name: updateUser.name,
				email: updateUser.email,
				isAdmin: updateUser.isAdmin,
			});
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	},
};
module.exports = userController;
