



# 📚Objective

Build a RESTful API using Node.js (with Express) for a basic Book Review system.


## 📝 1. Signup

**POST** `/auth/signup`

### ✅ Request Body (JSON)
```json
{
  "fname": "Test",
  "lname": "Tester",
  "email": "tester@example.com",
  "password": "123456"
}
````

### ✅ Response

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔐 2. Login

**GET** `/auth/login`

### ✅ Request Body (JSON)

```json
{
  "email": "tester@example.com",
  "password": "123456"
}
```

### ✅ Response

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📚 3. Add a Book

**POST** `/books`

> 🔒 Protected Route

### ✅ Request Headers

```
Authorization: Bearer <your_token>
Content-Type: application/json
```

### ✅ Request Body (JSON)

```json
{
  "title": "To revive a Mockingbird",
  "author": "Harper Lee the 2",
  "description": "A novel set in the American South during the 1930s that explores themes of racial injustice and moral growth.",
  "genre": "Fiction",
  "publishedYear": 1960
}
```

### ✅ Response

```json
{
  "message": "Book created successfully",
  "book": {
    "title": "To revive a Mockingbird",
    "author": "Harper Lee the 2",
    "description": "A novel set in the American South during the 1930s that explores themes of racial injustice and moral growth.",
    "genre": "Fiction",
    "publishedYear": 1960,
    "createdAt": "2025-05-24T09:47:46.369Z",
    "_id": "683195c2ce656e684795a901"
  },
  "user": {
    "userId": "68319308ce656e684795a8f5",
    "email": "tester@example.com",
    "iat": 1748079369,
    "exp": 1748082969
  }
}
```

---

## 🧪 Example cURL Command

```bash
curl -X POST http://localhost:5000/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "To revive a Mockingbird",
    "author": "Harper Lee the 2",
    "description": "A novel set in the American South during the 1930s that explores themes of racial injustice and moral growth.",
    "genre": "Fiction",
    "publishedYear": 1960
  }'
```

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT for Authentication
* bcrypt for Password Hashing

---


## 🚀 How to Run Locally

Follow these steps to run the project on your local machine:

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/ujjwal-07/Book_Review.git

````



### ⚙️ 2. Install Dependencies

```bash
npm install
```

---

### 🔐 3. Create `.env` File

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_jwt_secret_key
```

> Replace `your-db-name` and `your_jwt_secret_key` with your own values.

---

### ▶️ 4. Start the Server

```bash
npm start
```

> Or use `node index.js` if not using nodemon.

The server should start at:
`http://localhost:5000`

---

### 🧪 5. Test the API

Use [Postman](https://www.postman.com/) or `curl` to test the endpoints.


### Routes **Without** JWT Authentication
- `POST /auth/signup`  
- `POST /auth/login`  

---

### Routes **With** JWT Authentication (Require Token in Authorization Header)
- `POST /books`  
- `GET /books`  
- `POST /:id/review`  
- `DELETE /reviews/:id`  
- `PUT /reviews/:id`  
- `GET /searchByTitle`  
- `GET /searchByAuthor`  



---

### 📎 Helpful Commands

| Command       | Description               |
| ------------- | ------------------------- |
| `npm start` | Start server with nodemon |
| `node index.js`   | Start server normally     |


---

## 🗄️ Database Schema

This project uses **MongoDB** with **Mongoose** schemas defined as follows:

---

### 👤 User Schema (Signup/Login)

```js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SignupSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

SignupSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("signup", SignupSchema);
```


### 📚 Book Schema
```js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  genre: String,
  publishedYear: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);
```
### 📚 Book Review Schema
```js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  reviewerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'signup',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);


