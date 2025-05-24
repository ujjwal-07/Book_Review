const express = require("express");


const { addUser, loginUser} = require("../controllers/userController");
const app = express();

const router = express.Router();

app.use(express.urlencoded({ extended: true }));

router.get("/login", loginUser);
router.post("/signup", addUser);

module.exports = router;
