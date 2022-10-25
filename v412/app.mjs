import bcrypt from 'bcrypt'

const myPassword = "πολύδύσκολονατομαντέψω"

const hash = await bcrypt.hash(myPassword, 10)
console.log(hash)

const match = await bcrypt.compare(myPassword, hash)
console.log(match)