const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String, 
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length === 3) {
//   Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(person)
//     })
//     mongoose.connection.close()
//   })
// } else if (process.argv.length === 5) {
//     const person = new Person({
//       name: process.argv[3],
//       number: process.argv[4]
//     })
    
//     person.save().then(result => {
//       console.log(`added ${result.name} number ${result.number} to phonebook`)
//       mongoose.connection.close()
//     })
// } else {
//     console.log("add password or password, name and number")
//     mongoose.connection.close()
//   }

module.exports = mongoose.model('Person', personSchema)