import express from 'express'
import { myRoutes } from './my-routes.mjs'

const app = express()

app.use(express.static("public"))

app.use(express.urlencoded({extended: false}))

app.get("/book", (req, res) => {
    console.log("Ερώτημα:", req.query)
    res.send("Ζητήθηκε το βιβλίο: " + req.query["title"])
})

app.use("/book", myRoutes)

app.get("/book/:title", (req, res) => {
    console.log("Ερώτημα 2:", req.params)
    res.send("Ζητήθηκε το βιβλίο: " + req.params["title"])

})

app.post("/book", (req, res) => {
    console.log("Ερώτημα 3:", req.body)
    res.send("Ζητήθηκε το βιβλίο: " + req.body["title"])
})



app.listen(3000, () => { console.log("Η εφαρμογή ξεκίνησε") })