const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
console.log("The password is: " + password)

const name = process.argv[3]
console.log("The name is: " + name)

const number = process.argv[4]
console.log("The number is: " + number)


const username = "cx24"

//const url = `mongodb+srv://cx24:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://${username}:${password}@cluster0.qpntvpc.mongodb.net/?appName=Cluster0`
console.log(url)
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// auto added
const person = new Person({
  name: name,
  number: number,
})

if (username && number) {
  person.save().then( result => {
    console.log(result)
  console.log('person saved!')
  mongoose.connection.close()
})
}else {
  Person.find({}).then((persons) => {

    console.log("Phonebook:")
    persons.forEach((element) => {
      let { name , number } = element
      console.log(name + " " + number)
    } )
    mongoose.connection.close()

  })

}

