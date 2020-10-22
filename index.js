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

app.get('/info', (req, res) => {
  Person.count({})
    .then(count => {
      res.send(
        `<p>Phonebook has info of ${count} people</p>
    <p>${new Date(Date.now()).toLocaleString()}</p>`)
    })
})

app.get('/api/persons', (req, res, next) => Person
  .find({})
  .then(persons => res.json(persons))
  .catch(err => next(err)))

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(personObject => personObject ? res.json(personObject) : res.status(404).end())
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(personObject => personObject ? res.status(204).end() : res.status(404).end())
    .catch(err => next(err))

})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'missing name or number'
    })
  }

  const personObject = new Person({
    name: body.name,
    number: body.number,
  })

  personObject
    .save()
    // .then(() => { throw new Error("testiä") })
    .then(DBres => res.json(DBres))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  console.log(req)
  Person.findByIdAndUpdate(req.params.id, req.body)
    .then(personObject => personObject ? res.json(req.body) : res.status(404).end())
    .catch(err => next(err))
})


app.use((err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'malformatted id' })
  }

  return res.status(500).send(err.message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`)
})
