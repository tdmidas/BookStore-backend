const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();
const db = require("./database/config");
const path = require("path");
const { notFound, errorHandler } = require("./middlewares/error.middlewares");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passportStrategy = require("./utils/passport");
const passport = require("passport");
//Routes
const authorRoute = require("./routes/author.route");
const bookRoutes = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const orderRoutes = require("./routes/order.route");
const uploadRoutes = require("./routes/upload.route");
const authRoute = require("./routes/auth.route");

//dotenv conffig
dotenv.config();

//Port
const PORT = process.env.PORT || 8000;

//Cookie
app.use(cookieParser());
app.use(
	cookieSession({
		name: "session",
		keys: ["bookstore"],
		maxAge: 24 * 60 * 60 * 100,
	})
);
// HTTP Logger
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(morgan("common"));
app.use(passport.initialize());
app.use(passport.session());

//connect database
db.connect();

//Routes
app.use("/api/v1/auth", authRoute);

app.use("/api/v1/author", authorRoute);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/user", userRoute);
//Path
const dirname = path.resolve();
app.use("/upload", express.static(path.join(dirname, "/upload")));
//Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
