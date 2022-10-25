import express from 'express'
import { BookList } from './bookList.mjs'
import { body, validationResult } from 'express-validator'
import validator from 'validator'
import e from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    res.render("home")
})

router.get("/books",
    checkIfAuthenticated,
    showBookList)

router.post("/books",
    (req, res, next) => {
        req.session.username = req.body["username"]
        next()
    },
    showBookList)

router.get("/addbookform",
    checkIfAuthenticated,
    (req, res) => {
        res.render("addbookform")
    })

router.post(
    "/doaddbook",
    checkIfAuthenticated,
    body("newBookTitle")
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlphanumeric(ch, 'el-GR') &&
                    !validator.isAlphanumeric(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 5 })
        .withMessage("Τουλάχιστον 5 γράμματα"),
    async (req, res, next) => {
        const errors = validationResult(req)
        console.log(errors)
        if (errors.isEmpty()) {
            const newBook = {
                "title": req.body.newBookTitle,
                "author": req.body["newBookAuthor"]
            }
            try {
                const bookList = new BookList(req.session.username)
                await bookList.addBookToFile(newBook)
            } catch (error) {
                next(error)                
            }
            res.redirect("/books")
        }
        else {
            res.render("addbookform", {
                message: errors.mapped(),
                title: req.body["newBookTitle"],
                author: req.body["newBookAuthor"]
            })
        }
    })

router.get("/logout",
    checkIfAuthenticated,
    (req, res) => {
        req.session.destroy()
        res.redirect("/")
    })

async function showBookList(req, res, next) {
    res.locals.username = req.session.username
    try {
        const bookList = new BookList(req.session.username)
        await bookList.loadBooksFromFile()
        res.render("booklist", { books: bookList.myBooks.books })
    } catch (error) {
        next(error)
    }
}

function checkIfAuthenticated(req, res, next) {
    if (req.session.username)
        next()
    else
        res.redirect("/")
}

export { router }