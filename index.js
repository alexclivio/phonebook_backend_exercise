require('dotenv').config()
const express = require('express');
const Person = require('./models/person')
const app = express();
const morgan = require('morgan')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message})
  }
  next(error)
}

app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>PhoneBook</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()

  Person.find({}).then(persons => {
    response.send(`
      <p>Phonebook has info for ${persons.length} people.</p>
      <p>${date}</p>
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000)
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const { name, number } = request.body

  Person.findById(request.params.id).then(person => {
    console.log("found")
    if (!person) {
      return response.status(400).end()
    }

    person.name = name
    person.number = number

    return person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})