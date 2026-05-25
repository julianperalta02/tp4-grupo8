const { Router } = require('express')
const { alumnoValidator } = require('../middleware/alumno-validator.middleware')
const {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno,
  putAlumnoByLegajo,
  deleteAlumnoByLegajo
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)
rutas.post('/', alumnoValidator, postNewAlumno)
rutas.put('/:legajo', alumnoValidator, putAlumnoByLegajo)
rutas.delete('/:legajo', deleteAlumnoByLegajo)

module.exports = rutas