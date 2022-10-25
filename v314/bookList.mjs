import fs from 'fs/promises'

class BookList {
    myBooks = { books: [] }

    constructor(username) {
        if (username == undefined)
            throw new Error("Δεν έχει δοθεί τιμή για το username")
        this.fileName = "myBooks_" + username + ".json"
    }

    async loadBooksFromFile() {
        try {
            const data = await fs.readFile(this.fileName, { flag: "a+", encoding: "utf-8" })
            if (data!='')
                this.myBooks = JSON.parse(data)
        } catch (error) {
            throw error
        }
    }

    async addBookToFile(newBook) {
        await this.loadBooksFromFile()
        if (!this.isBookInList(newBook)) {
            this.myBooks.books.push(newBook)
            try {
                await fs.writeFile(this.fileName, JSON.stringify(this.myBooks, null, 2), { flag: "w+" })
            } catch (error) {
                throw error
            }
        }
    }

    isBookInList(book) {
        let bookFound = this.myBooks.books.find(item => (
            item.title === book.title &&
            item.author === book.author
        ));
        return bookFound
    }
}

export { BookList }