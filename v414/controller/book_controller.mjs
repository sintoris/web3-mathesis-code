import * as BookList from './model/booklist_model.mjs' // version 3 with ORM sequelize, postgress

async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", { books: myBooks })
    } catch (error) {
        next(error)
    }
}

const addBook = async (req, res, next) => {

    try {
        await BookList.addBook({
            "title": req.body["newBookTitle"],
            "author": req.body["newBookAuthor"]
        }, req.session.username)
        next() //επόμενο middleware είναι το showBookList
    }
    catch (error) {
        next(error) //αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

const deleteBook = async (req, res, next) => {
    const title = req.params.title;
    try {
        const bookList = new BookList(req.session.username)
        await bookList.deleteBook({ title: title })
        next() //επόμενο middleware είναι το BookController.showBookList
    }
    catch (error) {
        next(error)//αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}
export { showBookList, addBook, deleteBook }