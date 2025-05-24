const express = require("express");
const auth = require('../middleware/auth');

const { addBook, getBooks, getBookById,addReview,deleteReview,updateReview,searchByTitle,searchByAuthor} = require("../controllers/bookController");
const app = express();

const router = express.Router();

app.use(express.urlencoded({ extended: true }));

router.post("/addbook",auth, addBook);
router.get("/getbooks",auth,getBooks);
router.get("/getbook/:id",auth,getBookById);
router.post("/addReview",auth, addReview);
router.delete("/delteReview/:id",auth,deleteReview)
router.put("/updateReview/:id",auth,updateReview);
router.get("/searchByTitle/",auth,searchByTitle);
router.get("/searchByAuthor",auth,searchByAuthor) // Assuming you want to update the review with the same endpoint
module.exports = router;
