import fs from 'fs/promises'

const fileName = "myBooks.json"

class BookList {
    myBooks = { books: [] }

    async loadBooksFromFile() {
        try {
            const data = await fs.readFile(fileName, "utf-8")
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
                await fs.writeFile(fileName, JSON.stringify(this.myBooks, null, 2), {flag: "w+"})
            } catch (error) {
                throw error
            }
        }
    }

    isBookInList(book) {
        let bookFound = this.myBooks.books.find(item => (
            item.title===book.title &&
            item.author===book.author
        ));
        return bookFound
    }
}

export { BookList }