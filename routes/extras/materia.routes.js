const { Router } = require('express')
const { materiaValidator } = require('../../middleware/materia-validator.middleware')

const {
  getMateriaAll,
  getMateriaById,
  postNewMateria,
  putMateriaById,
  deleteMateriaById
} = require('../../controllers/Materia.controller')

const rutas = Router()

rutas.get('/', getMateriaAll)
rutas.get('/:idMateria', getMateriaById)
rutas.post('/', materiaValidator, postNewMateria)
rutas.put('/:idMateria', putMateriaById)
rutas.delete('/:idMateria', deleteMateriaById)

module.exports = rutas