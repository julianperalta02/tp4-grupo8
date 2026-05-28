const { Router } = require('express')
const { profesorValidator } = require('../../middleware/profesor-validator.middleware')

const {
  getProfesorAll,
  getProfesorById,
  postNewProfesor,
  putProfesorById,
  deleteProfesorById
} = require('../../controllers/Profesor.controller')

const rutas = Router()

rutas.get('/', getProfesorAll)
rutas.get('/:legajoProfesor', getProfesorById)
rutas.post('/', profesorValidator, postNewProfesor)
rutas.put('/:legajoProfesor', putProfesorById)
rutas.delete('/:legajoProfesor', deleteProfesorById)

module.exports = rutas