const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const loginRoutes = require("./routes/loginRoute");
const bookRoutes = require("./routes/bookRoute");
const cors = require("cors")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/book", loginRoutes,bookRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
