import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body'))

app.get('/info', (req, res) => res.send(
  `<p>Phonebook has info of ??? people</p>
    <p>${new Date(Date.now()).toLocaleString()}</p>`))

app.get('/api/persons', (req, res) => Person.find({}).then(persons => res.json(persons)))

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const personObject = persons.find(person => person.id === id)

  personObject ? res.json(personObject) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(DBres => res.status(204).end())
    .catch(error => res.status(400).end())
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'missing name or number'
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: 'name already exists!'
  //   })
  // }

  const personObject = new Person({
    name: body.name,
    number: body.number,
  })

  personObject.save().then(DBres => res.json(DBres))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`)
})
