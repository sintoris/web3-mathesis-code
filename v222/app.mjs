import express from 'express'
import { engine } from 'express-handlebars'
import { BookList } from './bookList.mjs'

const app = express()
app.engine('hbs', engine({extname: ".hbs"}))
app.set('view engine', 'hbs')

const bookList = new BookList()

app.get("/books", async (req, res) => {
    await bookList.loadBooksFromFile()
    res.render("booklist", {books: bookList.myBooks.books})
})

app.use((req, res) => {
    res.redirect("/books")
})

app.listen(3000, () => console.log("Η εφαρμογή ξεκίνησε"))
