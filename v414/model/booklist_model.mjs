import { Book, User } from './bookList_seq_pg.mjs'
import bcrypt from 'bcrypt'

async function addUser(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (user)
            throw new Error("Υπάρχει ήδη χρήστης με όνομα " + username)

        const hash = await bcrypt.hash(password, 10)
        user = await User.create({ name: username, password: hash })
        return user
    } catch (error) {
        throw error
    }
}

async function login(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (!user)
            throw new Error("Δεν υπάρχει χρήστης με όνομα " + username)

        const match = await bcrypt.compare(password, user.password)
        if (match)
            return user
        else
            throw new Error("Λάθος στοιχεία πρόσβασης")
    } catch (error) {
        throw error
    }
}

async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        const myBooks = await user.getBooks({ raw: true }); //με raw επιστρέφεται το "καθαρό" αντικείμενο (ο πίνακας) χωρίς πληροφορίες που αφορούν τη sequelize  
        return myBooks
    } catch (error) {
        throw error
    }
}

async function addBook(newBook, username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        const [book, created] = await Book.findOrCreate({
            where: {
                title: newBook.title,
                author: newBook.author
            }
        })
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

// το βιβλίο διαγράφεται από τον πίνακα "BookUser" 
async function deleteBook(book) {
    try {
        await this.findOrAddUser()
        const bookToRemove = await Book.findOne(
            { where: { title: book.title } }
        )
        await bookToRemove.removeUser(this.user)
        // this.user.removeBook(bookToRemove) // εναλλακτικά, από την πλευρά του User

        // Αν δεν υπάρχουν άλλοι χρήστες, διαγράφουμε το βιβλίο
        const numberOfUsers = await bookToRemove.countUsers()
        if (numberOfUsers == 0) {
            Book.destroy(
                { where: { title: book.title } }
            )
        }
    } catch (error) {
        throw error
    }
}

async function findOrAddUser() {
    //στο this.user θα φυλάσσεται το αντικείμενο που αντιπροσωπεύει τον χρήστη στη sequelize
    //αν δεν υπάρχει, τότε το ανακτούμε από τη sequalize
    //αλλιώς, υπάρχει το this.user και δεν χρειάζεται να κάνουμε κάτι άλλο
    if (this.user == undefined)
        try {
            const [user, created] = await User.findOrCreate({ where: { name: this.username } })
            this.user = user
        } catch (error) {
            throw error
        }
}

export { addUser, login, loadBooks, addBook }