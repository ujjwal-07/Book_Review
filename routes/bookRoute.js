const express = require("express");
const auth = require('../middleware/auth');

const { addBook, getBooks, getBookById,addReview,deleteReview,updateReview,searchByTitle,searchByAuthor} = require("../controllers/bookController");
const app = express();

const router = express.Router();

app.use(express.urlencoded({ extended: true }));

router.post("/",auth, addBook);
router.get("/",auth,getBooks);

router.get("/searchByTitle",auth,searchByTitle);
router.get("/searchByAuthor",auth,searchByAuthor)

router.get("/:id",auth,getBookById);
router.post("/:id/review",auth, addReview);
router.delete("/reviews/:id",auth,deleteReview)
router.put("/reviews/:id",auth,updateReview);

module.exports = router;
