const mongoose = require("mongoose");
async function connect() {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("Connect database sucessfully");
	} catch (error) {
		console.log("Connect database failed");
	}
}
module.exports = {
	connect,
};
