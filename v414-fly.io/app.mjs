import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import { router } from './routes.mjs'
import session from 'express-session'
import createMemoryStore from 'memorystore'

const MemoryStore = createMemoryStore(session)

const myBooksSession = session({
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore({ checkPeriod: 86400 * 1000 }),
    resave: false,
    saveUninitialized: false,
    name: "myBooks-sid", // connect.sid
    cookie: {
        maxAge: 1000 * 60 * 20 // 20 λεπτά
    }
})

const app = express();

app.use(myBooksSession)
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))

app.engine('hbs', engine({ extname: ".hbs" }))
app.set('view engine', 'hbs')

app.use("/", router)

//οτιδήποτε άλλο θα ανακατευθύνεται στο "/"
app.use((req, res) => {
    res.redirect('/')
}
);

app.use((err, req, res, next) => {
    console.log("error occured: " + err.message)
    next(err)
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.render("error", { message: err.message })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log("Η εφαρμογή ξεκίνησε στη θύρα " + PORT))