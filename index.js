// Dependencias
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Serviços
const AppointmentService = require('./services/Appointment')

// Instânciamento
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Engine de visualização
app.set('view engine', 'ejs')

// Banco
mongoose.connect('mongodb://127.0.0.1:27017/agendamento')
 
// Roteamento
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/cadastro', (req, res) => {
  res.render('create')
})

app.get('/event/:id', async (req, res) => {
  const appointment = await AppointmentService.GetById(req.params.id)
  res.render('event', { appointment })
})

// Controladores
app.post('/create', async (req, res) => {
  const status = await AppointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time,
  )

  if (status) {
    console.log('show de bola!')
    res.redirect('/')
  } else {
    res.send('Deu ruim!')
  }
})

app.get('/search', async (req, res) => {
  const status = await AppointmentService.GetAll(false)

  if (status) {
    console.log('show de bola!')
    res.json(status)
  } else {
    res.send('Deu ruim!')
  }
})

app.post('/finish', async (req, res) => {
  const id = req.body.id
  await AppointmentService.FinishAppointment(id)
  res.redirect('/')
})

app.get('/list', async (req, res) => {
  const appointmentList = await AppointmentService.GetAll(true)
  if (appointmentList) {
    res.render('list', { appointmentList })
  } else {
    res.render('Deu ruim!')
  }
})

app.get('/searchResult', async (req, res) => {
  const query = req.query.search
  const appointmentList = await AppointmentService.Find(query)
  if (appointmentList) {
    return res.render('list', { appointmentList })
  } else {
    res.render('Deu ruim!')
  }
})

// Polling
const pollTime = 1000 * 60 * 60 // 1 hora
setInterval(async () => {
  AppointmentService.SendNotification()
}, pollTime)


// Inicialização
app.listen(8080, () => {})
