// Dependencias
const mongoose = require('mongoose')

// Schema das informações da tabela
const Appointment = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  cpf: String,
  date: Date,
  time: String,
  isFinished: Boolean
})

// Exportando o Schema como um módulo
module.exports = Appointment
