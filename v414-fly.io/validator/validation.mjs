import { body, validationResult } from 'express-validator'
import validator from 'validator'

const validateLogin = [
    body("username")
        .trim().escape().isLength({ min: 4 }) // Θα μπορούσαμε να έχουμε και άλλους ελέγχους
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("home", { message: errors.mapped() })
        }
    }
]

const validateNewBook = [
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
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("addbookform", {
                message: errors.mapped(), // περιγραφές των σφαλμάτων εγκυρότητας
                title: req.body["newBookTitle"], // η τιμή που έδωσε ο χρήστης
                author: req.body["newBookAuthor"] // η τιμή που έδωσε ο χρήστης
            })
        }
    }
]

const validateNewUser = [
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
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("registrationform", {
                message: errors.mapped()
            })
        }
    }
]

export { validateLogin, validateNewBook, validateNewUser }