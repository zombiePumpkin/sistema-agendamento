// Dependencias
const mongoose = require('mongoose')

// Modelo
const AppointmentSchema = require('../models/Appointment')
const AppointmentModel = mongoose.model('Appointment', AppointmentSchema)

// Classe principal
class Appointment {
  async Create(name, email, description, cpf, date, time) {
    try {
      const newAppointment = new AppointmentModel({ name, email, description, cpf, date, time, isFinished: false })
      await newAppointment.save()
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

// Exportando a classe principal
module.exports = new Appointment();