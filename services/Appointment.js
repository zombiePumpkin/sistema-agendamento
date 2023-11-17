// Dependencias
const mongoose = require('mongoose')
const AppointmentFactory = require('../factories/Appointment')

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

  async GetAll(showFinished) {
    try {
      if (showFinished) {
        return AppointmentModel.find()
      } else {
        const appointmentSearch = await AppointmentModel.find({ 'isFinished': false })
        const appointmentList = []
        appointmentSearch.forEach(appointment => {
          if (appointment.date && appointment.time) {
            appointmentList.push(AppointmentFactory.Build(appointment))
          }
        })
        return appointmentList
      }
    } catch(err) {
      console.log(err)
      return false
    }
  }

  async GetById(id) {
    try {
      const appointment = await AppointmentModel.findOne({ '_id': id })
      return appointment
    } catch (err) {
      console.log(err)
    }
  }
}

// Exportando a classe principal
module.exports = new Appointment();