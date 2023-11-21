class Appointment {
  Build(appointment) {
    const day = appointment.date.getDate() + 1
    const month = appointment.date.getMonth()
    const year = appointment.date.getFullYear()
    const [hour, minutes] = appointment.time.split(':')
    const startDate = new Date(year, month, day, hour, minutes, 0, 0)
    // startDate.setHours(startDate.getHours() - 3) // Converte para o horário padrão Brasileiro (-3hrs)

    return {
      id: appointment._id,
      title: `${appointment.name} - ${appointment.description}`,
      start: startDate,
      end: startDate,
      isNotified: appointment.isNotified
    }
  }
}

module.exports = new Appointment() 