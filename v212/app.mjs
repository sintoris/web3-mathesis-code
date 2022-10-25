import express from 'express'
const app = express()

const myMW1 = (req, res, next) => {
    console.log("myMW1")
    next()
}

const myMW2 = (req, res, next) => {
    console.log("myMW2")
    next()
}

const myMW3 = (req, res, next) => {
    console.log("myMW3")
    res.send("Ok!")
    next()
}

app.route("/book").put((req, res) => {
    console.log("ενημέρωση βιβλίου")
}).post((req, res) => {
    console.log("προσθήκη βιβλίου")
}).get((req, res) => {
    console.log("ανάκτηση βιβλίου")
})


app.listen(3000, () => { console.log("Η εφαρμογή ξεκίνησε") })