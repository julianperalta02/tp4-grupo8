const { Router } = require('express')
const { notaValidator } = require('../../middleware/nota-validator.middleware')

const {
  getNotaAll,
  getNotaById,
  postNewNota,
  putNotaById,
  deleteNotaById
} = require('../../controllers/Nota.controller')

const rutas = Router()

rutas.get('/', getNotaAll)
rutas.get('/:id', getNotaById)
rutas.post('/', notaValidator, postNewNota)
rutas.put('/:id', putNotaById)
rutas.delete('/:id', deleteNotaById)

module.exports = rutas