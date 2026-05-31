const express = require('express')
const cors = require('cors')
require('dotenv').config()

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middleware()
    this.rutas()
  }

  middleware () {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  //rutas () {
    //this.app.use('/alumnos', require('../routes/alumno.routes'))
    //this.app.use('/materias', require('../routes/extras/materia.routes'))
    //this.app.use('/notas', require('../routes/extras/nota.routes'))
    //this.app.use('/profesores', require('../routes/extras/profesor.routes'))

    // manejo de errores
    this.app.use((req, res, next) => {
      return res.status(404).json({ msg: 'Ruta no encontrada' })
    })
    this.app.use((err, req, res, next) => {
      console.error(err.stack)
      return res.status(404).json({ msg: 'Error. Pagina no encontrada' })
    })
    this.app.use((err, req, res, next) => {
      console.error(err.stack)
      return res.status(500).json({ msg: 'Internal Server Error' })
    })
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando el el puerto: ${this.port}`)
    })
  }
}

module.exports = Server
