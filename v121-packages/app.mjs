import { BookList } from "./bookList.mjs";
import { say } from 'yodasay';
 
console.log(say({ text: 'meditating in the browser' }));

const bookList = new BookList()

await bookList.loadBooksFromFile()
console.log(bookList.myBooks)