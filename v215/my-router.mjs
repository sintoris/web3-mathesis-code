import express from 'express'

const router = express.Router()

router.get("/about", (req, res) => {
    console.log("Σχετικά με την εφαρμογή")
    res.send("Σχετικά με την εφαρμογή")
})

router.get("/random", (req, res) => {
    console.log("Ένα τυχαίο βιβλίο")
    res.send("Ένα τυχαίο βιβλίο")
})

export { router }