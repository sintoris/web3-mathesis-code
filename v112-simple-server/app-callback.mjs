import fs from 'fs'

const fileName = "myBooks.txt"

fs.open(fileName, 'a+', (err, fd) => {
    if (err) {
        console.log("Σφάλμα:", err.code)
        return
    }
    fs.write(fd, '{ title: "Τα ημερολόγια των άστρων", author: "Στάνισλαβ Λεμ"}', (err) => {
        fs.close(fd)
        if (err) {
            console.log("Σφάλμα:", err.code)
            return
        }
        fs.readFile(fileName, "utf-8", (err, data) => {
            if (err) {
                console.log("Σφάλμα:", err.code)
                return
            }
            console.log("Περιεχόμενα:\n", data)
        })
    
    })
})