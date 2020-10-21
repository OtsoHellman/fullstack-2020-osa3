import express from 'express'
const app = express()

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info of ${persons.length} people</p>
    <p>${new Date(Date.now()).toLocaleString()}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personObject = persons.find(person => person.id === id)

  personObject ? res.json(personObject) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personObject = persons.find(person => person.id === id)

  if (personObject) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const personObject = {
    name: body.name,
    number: body.number,
    id: Math.ceil(Math.random()*314159265358)
  }

  persons = persons.concat(personObject)

  res.json(personObject)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`)
})