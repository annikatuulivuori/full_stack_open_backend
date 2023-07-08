require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())


morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* let persons = [
    { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
    },
    { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
    },
    { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
    },
    { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
    }
] */
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const length = persons.length
    const currentDate = new Date().toUTCString()
    const msg = `Phonebook has info for ${length} people.<br>${currentDate}`

    response.send(`<p>${msg}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })    
        .catch(error => next(error))
})

const generateId = () => {
    const id = Math.floor(Math.random() * 100 + 1)
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (body.number === undefined) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number:body.number,
        id: generateId,
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch((error) => {
            return response.status(400).json({
                error: 'name must be unique'
            })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})