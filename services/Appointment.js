// Dependencias
const mongoose = require('mongoose')
const nodeMailer = require('nodemailer')
const AppointmentFactory = require('../factories/Appointment')

// Modelo
const AppointmentSchema = require('../models/Appointment')
const AppointmentModel = mongoose.model('Appointment', AppointmentSchema)

// Classe principal
class Appointment {
  async Create(name, email, description, cpf, date, time) {
    try {
      const newAppointment = new AppointmentModel({ 
        name,
        email,
        description,
        cpf,
        date,
        time,
        isFinished: false,
        isNotified: false,
      })
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
        const appointmentList = await AppointmentModel.find()
        return appointmentList
      } else {
        const appointmentSearch = await AppointmentModel.find({ 'isFinished': false })
        const appointmentList = appointmentSearch.map(appointment => {
          if (appointment.date && appointment.time) {
            return AppointmentFactory.Build(appointment)
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
      return false
    }
  }

  async FinishAppointment(id) {
    try {
      await AppointmentModel.findByIdAndUpdate(id, { isFinished: true })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async Find(query) {
    try {
      const appointmentList = await AppointmentModel.find().or([{ email: query }, { cpf: query }])
      return appointmentList
    } catch(err) {
      console.log(err)
      return false
    }
  }

  async SendNotification () {
    const appointmentList = await this.GetAll(false)

    // Criando o transporter do nodemailer
    console.log('Passo 1: Criando transporter do nodemailer.')
    const transporter = nodeMailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 465,
      secure: false,
      auth: {
        user: 'a852156c0b02ce',
        pass: '7549bf44c8bd87'
      }
    })

    // Verificando conexão com o servidor de email
    console.log('Passo 2: Verificando conexão com o servidor de email.')
    await transporter.verify((error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Server is ready to take our messages');
      }
    })

    appointmentList.forEach(appointment => {
      const date = appointment.start.getTime()
      const hour = 1000 * 60  * 60
      const gap = date - Date.now()

      if (gap <= hour) {
        if (!appointment.isNotified) {
          // Tentativa de envio do email
          console.log('Passo 3: Tentativa do envio do email.');
          transporter.sendMail({
            from: 'Jose Pena <jose.pena@teste.com>',
            to: appointment.email,
            subject: 'Sua consulta vai acontecer em menos de uma hora!',
            text: 'Conteúdo interno do email'
          }).then(async () => {
            // Registro de envio de email
            await AppointmentModel.findByIdAndUpdate(appointment.id, { isNotified: true })
            console.log('Passo 4: Registro de envio de email');
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  }
}

// Exportando a classe principal
module.exports = new Appointment();