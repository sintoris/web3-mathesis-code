import * as BookList from './model/booklist_model.mjs' // version 3 with ORM sequelize, postgress

const doLogin = async (req, res, next) => {

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

const doRegister = async (req, res, next) => {
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
}

const doLogout = (req, res, next) => {
    req.session.destroy() //καταστρέφουμε τη συνεδρία στο session store
    next()
}

function checkIfAuthenticated(req, res, next) {
    if (req.session.username) { //αν έχει τεθεί η μεταβλητή στο session store θεωρούμε πως ο χρήστης είναι συνδεδεμένος
        res.locals.username = req.session.username
        next() //επόμενο middleware
    }
    else
        res.redirect("/") //αλλιώς ανακατεύθυνση στην αρχική σελίδα
}

export { checkIfAuthenticated, doLogin, doRegister, doLogout ``}