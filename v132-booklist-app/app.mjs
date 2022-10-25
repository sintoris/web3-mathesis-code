import http from 'http';
import { BookList } from './bookList.mjs'

const bookList = new BookList()

http.createServer(async (req, res) => {
    if (req.url === '/books') {
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
    }
    else if (req.url==='/addbookform') {
        res.write(pageTopChunk)
        res.write(pageFormChunk)
        res.write(pageBottomChunk)

        res.end()
    }
    else if (req.url.startsWith('/doaddbook?')) {
        const myUrl = new URL("http://" + req.headers.host + req.url)
        
        const newBook = {
            "title": myUrl.searchParams.get("newBookTitle"),
            "author": myUrl.searchParams.get("newBookAuthor")
        }

        await bookList.addBookToFile(newBook)
        res.writeHead(303, { location: "/books" })
        res.end()  
    }
    else {
        res.writeHead(303, { location: "/books" })
        res.end()
    }

}).listen(3000)

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

const pageFormChunk =`
<form action="/doaddbook" method="get">
<input type="text" name="newBookTitle" placeholder="Τίτλος">
<br><br>
<input type="text" name="newBookAuthor" placeholder="Συγγραφέας">
<br><br>
<input type="submit" value="Καταχώριση">
</form>
`
