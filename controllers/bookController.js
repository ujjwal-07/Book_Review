const express = require('express');
const router = express.Router();
const Book = require('../models/addBooks');
const Review = require('../models/bookReview');
const { parse } = require('dotenv');


exports.addBook = async (req, res) => {
    const { title, author,description, genre, publishedYear } = req.body;
    if (!title || !author || !description || !genre || !publishedYear) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    console.log(req.body, "this is body for book");
    const newBook = new Book({
        title,
        author,
        description,
        genre,
        publishedYear,
        createdAt: new Date(),
    });

    newBook.save()
        .then(() => {
            console.log('Book saved successfully');
        })
        .catch((error) => {
            console.error('Error saving book:', error);
            return res.status(500).json({ message: 'Error saving book' });
        });
    
    console.log('New Book:', newBook);
    res.status(201).json({
        message: 'Book created successfully',
        book: newBook,
        user: req.user 
    });
}


exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
}


exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const reviews = await Review.find({ book: bookId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

   
    const ratingStats = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const avgRating = ratingStats[0]?.avgRating || 0;
    const totalReviews = ratingStats[0]?.count || 0;

    res.json({
      book,
      averageRating: avgRating.toFixed(2),
      totalReviews,
      page,
      limit,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user.userId; 
    console.log(req.user.userId)
    console.log(req.body, "this is body for review");
    const check_book = await Book.findById(bookId);
       if (!check_book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    const reviewExists = await Review.findOne({ book: bookId, reviewerName: userId });
    if (reviewExists) {
        return res.status(400).json({ message: 'You have already reviewed this book' });
    }
 
    try {
        const review = new Review({
        book: bookId,
        reviewerName: userId,
        rating,
        comment,
        });
    
        await review.save();
    
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
    }

    exports.deleteReview = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId; 

        try {
        const rev = await Review.find()
        console.log(rev,id ,"this is review");
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            if (review.reviewerName.toString() !== userId) {
                return res.status(403).json({ message: 'You can only delete your own reviews' });
            }

            await Review.findByIdAndDelete(id);
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ message: 'Error deleting review' });
        }
    }

exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId; 

    try {
        const review = await Review.findById(id);   
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.reviewerName.toString() !== userId) {
            return res.status(403).json({ message: 'You can only update your own reviews' });
        }
        review.rating = rating;
        review.comment = comment;   
        await review.save();
        res.status(200).json({ message: 'Review updated successfully', review });
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Error updating review' });
    }
}

exports.searchByTitle = async (req, res) => {
    console.log(req.query, "this is query for title");
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ message: 'Title query parameter is required' });
    }

    try {
        const books = await Book.find({ title: new RegExp(title, 'i') }); // 'i' for case-insensitive search
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found with that title' });
        }
        res.status(200).json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Error searching books' });
    }
}


exports.searchByAuthor = async (req, res) => {
    const { author } = req.query;
    if (!author) {
        return res.status(400).json({ message: 'Author query parameter is required' });
    }

    try {
        const books = await Book.find({ author: new RegExp(author, 'i') }); // 'i' for case-insensitive search
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found with that title' });
        }
        res.status(200).json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Error searching books' });
    }
}