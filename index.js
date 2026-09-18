const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>PhoneBook</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${phonebook.length} people.</p>
    <p>${date}</p>
    `)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  
  const person = phonebook.find(person => person.id === id)

  if (!person) {
    return response.status(404).json({
      error: 'person not found'
    })
  }
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  console.log(request.body)
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (phonebook.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000)
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})