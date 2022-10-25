import express from 'express'
import { router } from './my-router.mjs'

const app = express()

app.use(express.urlencoded({extended: false}))

app.use("/book", router)

app.get("/book", (req, res) => {
    console.log("Ερώτημα:", req.query)
    res.send("Ζητήθηκε το βιβλίο: " + req.query["title"])
})

app.get("/book/:title", (req, res) => {
    console.log("Ερώτημα 2:", req.params)
    res.send("Ζητήθηκε το βιβλίο: " + req.params["title"])
})

app.post("/book", (req, res) => {
    console.log("Ερώτημα 3:", req.body)
    res.send("Ζητήθηκε το βιβλίο: " + req.body["title"])
})



app.listen(3000, () => { console.log("Η εφαρμογή ξεκίνησε") })