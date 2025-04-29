// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Setting up port number
const PORT = process.env.PORT || 5000;

// Connecting to database
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true
	})
);

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/expense", expenseRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
