const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
    
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


function numberValidation(numberString) {

  let length = numberString.length

  if (length < 8) {
    return false
  }

  if (!numberString.includes("-")) {
    return false
  }

  let parts = numberString.split("-")

  let partsLength = parts.length
  if (partsLength !== 2) {
    return false
  }

  let [firstPart, secondPart] = parts


  if (firstPart.length < 2) {
    return false
  }
  if (isNaN(Number(firstPart)) || isNaN(Number(secondPart))) {
    return false
  }

  return true









}



const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: numberValidation
    },
    message: props => `${props.value} is not a valid phone number!`
    ,
    required: [true, 'User phone number required']
  }
})

//const Person = mongoose.model('Person', personSchema)


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)