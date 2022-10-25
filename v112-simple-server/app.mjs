import fs from 'fs'

const fileName = "myBooks.txt"

try {
    const fd = fs.openSync(fileName, 'a+')
    fs.writeSync(fd, '{ title: "Τα ημερολόγια των άστρων", author: "Στάνισλαβ Λεμ"}\n')
    fs.closeSync(fd)
} catch (err) {
    if (err.code=="EACCES")
        console.log("Δεν έχω πρόσβαση σε αυτό το αρχείο")
    else 
     console.log("Σφάλμα:", err.code)
}

const data = fs.readFileSync(fileName, "utf-8")
console.log("Περιεχόμενα του αρχείου:\n", data)