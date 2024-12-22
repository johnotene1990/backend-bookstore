const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT // 5000
const mongoose = require('mongoose');
const cors = require('cors')


//middleware
app.use(cors())
app.use(express.json())

// db configuration
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://bookstore:uj9iIJNuzkYjFaFl@cluster0.51fq2.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const bookstoreSchema = new mongoose.Schema({
  bookTitle: String,
  authorName: String,
  imageUrl: String,
  category: String,
  bookPdfUrl: String,
  description: String,
  price: Number

});
const bookModel = mongoose.model('book', bookstoreSchema);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// upload-book/create
app.post('/upload-book', async (req, res) => {
  const data = req.body;
  await bookModel.create(data)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// get-all-books
app.get('/all-books', async (req, res) => {
  await bookModel.find({})
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// get price for all-books
app.get('/price-all-books', async (req, res) => {
  await bookModel.find({})
    .then(result => res.json(result.map(book => book.price)))
    .catch(err => res.json(err))
})

// get book by ID
// app.get('/book/:id',async(req,res)=>{
//   if(id){
//     return res.status(400).send('ID not available');
//   }
//   await bookModel.findById(req.params.id)
//  .then(result =>res.json(result))
//  .catch(err=>res.json(err))
// })

// update book by ID
app.put('/book/:id', async (req, res) => {
  await bookModel.findByIdAndUpdate(req.params.id, req.body)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// delete book by ID
app.delete('/book/:id', async (req, res) => {
  await bookModel.findByIdAndDelete(req.params.id)
    .then(result => res.json({ result }))
    .catch(err => res.json(err))
})

// get book by category
app.get('/book-by-category/:category', async (req, res) => {
  await bookModel.find({ category: req.params.category })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// search book by title
app.get('/search-book/:title', async (req, res) => {
  await bookModel.find({ bookTitle: { $regex: req.params.title, $options: 'i' } })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// // getting a single book
app.get('/book/:id', async (req, res) => {
  const id = req.params.id;
  const result = await bookModel.findById({ _id: id })
  if (!result) {
    return res.json({ message: 'Book id not found' });
  }
  res.json(result);
  //  .then(result =>res.json(result))
  //  .catch(err=>res.json(err))
})

// get book by author
app.get('/book-by-author/:author', async (req, res) => {
  await bookModel.find({ authorName: { $regex: req.params.author, $options: 'i' } })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

// Add a route handler for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})