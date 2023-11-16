// Dependencias
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Instanciamento
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Engine de visualização
app.set('view engine', 'ejs')

// Banco
mongoose.connect(
  'mongodb://localhost:27017/agendamento',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// Roteamento
app.get('/', (req, res) => {
  res.send('Oi!')
})

// Inicialização
app.listen(8080, () => {})
