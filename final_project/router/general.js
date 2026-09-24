const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;

let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register user

public_users.post("/register", (req, res) => {

  const username = req.body.username;

  const password = req.body.password;

  if (isValid(username)) {

    return res.status(400).json({
      message: "Username already exists"
    });

  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });

});


// Get all books using Axios and async/await

public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/books');

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving books"
    });

  }

});


// Internal route used by Axios to get all books

public_users.get('/books', function (req, res) {

  res.status(200).json(books);

});


// Get book details based on ISBN using Axios and Promise

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/books/isbn/${isbn}`)
    .then(response => {

      res.status(200).json(response.data);

    })
    .catch(error => {

      res.status(404).json({
        message: "Book not found"
      });

    });

});


// Internal route used by Axios for ISBN

public_users.get('/books/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (!books[isbn]) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

  res.status(200).json(books[isbn]);

});


// Get book details based on author using Axios and async/await

public_users.get('/author/:author', async function (req, res) {

  try {

    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/books/author/${encodeURIComponent(author)}`
    );

    res.status(200).json(response.data);

  } catch (error) {

    res.status(404).json({
      message: "Book not found"
    });

  }

});


// Internal route used by Axios for author

public_users.get('/books/author/:author', function (req, res) {

  const author = req.params.author;

  const result = Object.values(books).filter(book =>
    book.author.toLowerCase() === author.toLowerCase()
  );

  res.status(200).json(result);

});


// Get books based on title using Axios and Promise

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  axios.get(
    `http://localhost:5000/books/title/${encodeURIComponent(title)}`
  )
    .then(response => {

      res.status(200).json(response.data);

    })
    .catch(error => {

      res.status(404).json({
        message: "Book not found"
      });

    });

});


// Internal route used by Axios for title

public_users.get('/books/title/:title', function (req, res) {

  const title = req.params.title;

  const result = Object.values(books).filter(book =>
    book.title.toLowerCase() === title.toLowerCase()
  );

  res.status(200).json(result);

});


// Get book review

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (!books[isbn]) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

  res.status(200).json(books[isbn].reviews);

});


module.exports.general = public_users;