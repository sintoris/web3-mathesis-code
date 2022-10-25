import fs from 'fs/promises'

const fileName = "myBooks.txt"

try {
    const fd = await fs.open(fileName, "a+")
    await fd.write('{ title: "Τα ημερολόγια των άστρων", author: "Στάνισλαβ Λεμ"}\n')
    await fd.close()
    const data = await fs.readFile(fileName, "utf-8")
    console.log("Περιεχόμενα:\n", data)
}
catch (err) {
    console.log("Σφάλμα:", err.code)
}