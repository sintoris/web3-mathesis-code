import express from 'express'

const myRoutes = express.Router()

myRoutes.get("/about", (req, res) => {
    res.send("Πληροφορίες σχετικά με την εφαρμογή")
})

myRoutes.get("/random", (req, res) => {
    res.send("Ένα τυχαίο βιβλίο")
})

export { myRoutes }