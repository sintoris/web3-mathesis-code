import express from 'express'
import { BookList } from './bookList.mjs'

const app = express()
const bookList = new BookList()

app.get("/books", async (req, res) => {
    await bookList.loadBooksFromFile()
        res.write(pageTopChunk)
        res.write("<h1>Τα βιβλία μου</h1>")
        res.write("<a href='/addbookform'>Προσθήκη νέου βιβλίου</a>")
        res.write("<ul>")
        bookList.myBooks.books.forEach((book) => {
            res.write(`<li>${book.title} - ${book.author}</li>`)
        })
        res.write("</ul>")
        res.write(pageBottomChunk)

        res.end()
})

app.use((req, res) => {
    res.redirect("/books")
})

app.listen(3000, () => console.log("Η εφαρμογή ξεκίνησε"))

const pageTopChunk = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>`

const pageBottomChunk = `
</body>
</html>
`