import express from 'express'
// use different models to demonstrate connection to different databases
import * as BookList from './model/booklist_model.mjs' // version 3 with ORM sequelize, postgress
// import { BookList } from './model/bookList_seq.mjs' // version 2 with ORM sequelize, sqlite3
// import { BookList } from './model/bookList_lite.mjs' // version 1 with sqlite, sqlite3
import { body, validationResult } from 'express-validator'
import validator from 'validator'

const router = express.Router()

//αν υπάρχει ενεργή συνεδρία, ανακατεύθυνε στο /books
router.get("/", (req, res) => {
    if (req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})

router.get("/books", checkIfAuthenticated, showBookList)

//έλεγξε αν έχει συνδεθεί ο χρήστης, μετά δείξε τα βιβλία
router.get("/books", checkIfAuthenticated, showBookList)

//δείξε τη φόρμα εισαγωγής νέου βιβλίου
router.get("/addbookform", checkIfAuthenticated, (req, res) => {
    res.render("addbookform")
})

//αυτή η διαδρομή υποδέχεται τη φόρμα εισόδου
router.post("/books",
    checkIfAuthenticated,
    body("username")
        .trim().escape().isLength({ min: 4 }) // Θα μπορούσαμε να έχουμε και άλλους ελέγχους
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    async (req, res, next) => {
        const errors = validationResult(req)
        try {
            if (errors.isEmpty()) {
                //έλεγχος εγκυρότητας οκ
                const user = await BookList.login(req.body.username, req.body.password)
                if (user) {
                    req.session.username = req.body.username // το username μπαίνει σαν μεταβλητή συνεδρίας
                    res.locals.username = req.session.username //τα μέλη του res.locals είναι απευθείας προσβάσιμα στο template
                    next() //το επόμενο middleware είναι το showBooklist
                }
                else {
                    throw new Error("άγνωστο σφάλμα")
                }
            }
            else {
                //ο έλεγχος εγκυρότητας δεν είναι ΟΚ, άρα δεν καλούμε τη next()
                res.render("home", { message: errors.mapped() })
            }
        } catch (error) {
            next(error)
        }
    },
    showBookList)

//υποδέχεται την φόρμα υποβολής νέου βιβλίου
router.post("/doaddbook",
    checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    body("newBookTitle") //έλεγχος εγκυρότητας για τον τίτλο
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    !validator.isNumeric(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 5 })
        .withMessage("Τουλάχιστον 5 γράμματα"),
    body("newBookAuthor") //έλεγχος εγκυρότητας για τον συγγραφέα
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 5 })
        .withMessage("Τουλάχιστον 5 γράμματα"),
    async (req, res, next) => {
        const errors = validationResult(req)
        let bookList
        if (errors.isEmpty()) {
            //έλεγχος εγκυρότητας οκ
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
        else {
            //απέτυχε ο έλεγχος εγκυρότητας, επιστροφή στη φόρμα
            res.render("addbookform", {
                message: errors.mapped(), // περιγραφές των σφαλμάτων εγκυρότητας
                title: req.body["newBookTitle"], // η τιμή που έδωσε ο χρήστης
                author: req.body["newBookAuthor"] // η τιμή που έδωσε ο χρήστης
            })
        }
    },
    showBookList)

// διαγραφή ενός βιβλίου με τίτλο title από τη λίστα του χρήστη
router.get("/delete/:title",
    checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    async (req, res, next) => {
        const title = req.params.title;
        try {
            const bookList = new BookList(req.session.username)
            await bookList.deleteBook({ title: title })
            next() //επόμενο middleware είναι το showBookList
        }
        catch (error) {
            next(error)//αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
        }
    },
    showBookList);

router.get("/logout", (req, res) => {
    req.session.destroy() //καταστρέφουμε τη συνεδρία στο session store
    res.redirect("/")
})

router.get("/register", (req, res) => {
    res.render("registrationform")
})

router.post("/doregister",
    body("username")
        .trim().escape().isLength({ min: 4 }) // Θα μπορούσαμε να έχουμε και άλλους ελέγχους
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    body("password-confirm")
        .trim()
        .isLength({ min: 4, max: 10 })
        .withMessage('Το συνθηματικό πρέπει να έχει από 4 μέχρι 10 χαρακτήρες')
        .custom((value, { req }) => {
            if (value != req.body.password)
                throw new Error("Το συνθηματικό πρέπει να είναι το ίδιο και στα δύο πεδία")
            else
                return true
        }),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("registrationform", {
                message: errors.mapped()
            })
        }
        else {
            next()
        }
    },
    async (req, res, next) => {
        const username = req.body.username
        const password = req.body.password

        try {
            const user = await BookList.addUser(username, password)
            if (user) {
                res.render("home", { newusermessage: "Η εγγραφή του χρήστη έγινε με επιτυχία`" })
            }
            else {
                throw new Error("άγνωστο σφάλμα κατά την εγγραφή του χρήστη")
            }
        } catch (error) {
            next(error)
        }

    })

function checkIfAuthenticated(req, res, next) {
    if (req.session.username) { //αν έχει τεθεί η μεταβλητή στο session store θεωρούμε πως ο χρήστης είναι συνδεδεμένος
        res.locals.username = req.session.username
        next() //επόμενο middleware
    }
    else
        res.redirect("/") //αλλιώς ανακατεύθυνση στην αρχική σελίδα
}

async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", { books: myBooks })
    } catch (error) {
        next(error)
    }
}

export { router }