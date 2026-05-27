const { MateriaModel } = require('../models/extras/materia.model.ts')
const { readMaterias, writeMaterias } = require('../persistence/materia.persistence')


const getMateriaAll = async (req, res) => {
  try {
    const materias = await readMaterias()

    const { cuatrimestre } = req.query
    let resultado = materias

    if (cuatrimestre !== undefined) {
      resultado = resultado.filter((m) => m.cuatrimestre === Number(cuatrimestre))
      console.log(`[FLAG] Filtro aplicado: cuatrimestre=${cuatrimestre} → ${resultado.length} resultado/s`)
    }

    console.log(`[FLAG] GET /materias → ${resultado.length} materia/s devuelta/s`)
    return res.status(200).json(resultado)
  } catch (error) {
    console.log('[ERROR] getMateriaAll:', error)
    return res.status(500).json({ error: 'No se pudieron obtener las materias' })
  }
}

// GET /materias/:idMateria

const getMateriaById = async (req, res) => {
  const { idMateria } = req.params
  try {
    const materias = await readMaterias()

    const materiaEncontrada = materias.find((m) => m.idMateria === idMateria)

    if (!materiaEncontrada) {
      return res.status(404).json({ msg: `No existe la materia con id ${idMateria}` })
    }

    console.log(`[FLAG] GET /materias/${idMateria} → materia encontrada`)
    return res.status(200).json(materiaEncontrada)
  } catch (error) {
    console.log('[ERROR] getMateriaById:', error)
    return res.status(500).json({ error: `No se pudo obtener la materia con id ${idMateria}` })
  }
}

// POST /materias

const postNewMateria = async (req, res) => {
  try {
    const { idMateria, nombre, cuatrimestre } = req.body

    const errors = MateriaModel.validate(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }

    const materias = await readMaterias()

    // Verificar id duplicado (409 Conflict)

    const idDuplicado = materias.find((m) => m.idMateria === idMateria)
    if (idDuplicado) {
      return res.status(409).json({ error: `Ya existe una materia con el id ${idMateria}` })
    }

    const nuevaMateria = new MateriaModel(idMateria, nombre, cuatrimestre)
    const materiaNueva = nuevaMateria.getAllAttributes()

    materias.push(materiaNueva)
    await writeMaterias(materias)

    console.log(`[FLAG] POST /materias → materia creada con id ${idMateria}`)
    return res.status(201).json({
      msg: `Se agregó la nueva materia con id ${idMateria}`,
      materiaNueva
    })
  } catch (error) {
    console.log('[ERROR] postNewMateria:', error)
    return res.status(500).json({ error: 'No se pudo agregar la nueva materia' })
  }
}

// PUT /materias/:idMateria

const putMateriaById = async (req, res) => {
  const { idMateria } = req.params
  try {
    const { nombre, cuatrimestre } = req.body

    const materias = await readMaterias()

    const indexMateria = materias.findIndex((m) => m.idMateria === idMateria)

    if (indexMateria === -1) {
      return res.status(404).json({ msg: `No existe la materia con id ${idMateria}` })
    }

    const materiaEncontrada = materias[indexMateria]

    const materiaModificada = new MateriaModel(
      materiaEncontrada.idMateria,   
      materiaEncontrada.nombre,
      materiaEncontrada.cuatrimestre
    )

    if (nombre !== undefined) materiaModificada.setNombre(nombre)
    if (cuatrimestre !== undefined) materiaModificada.setCuatrimestre(cuatrimestre)

    const materiaPush = materiaModificada.getAllAttributes()
    materias[indexMateria] = materiaPush

    await writeMaterias(materias)

    console.log(`[FLAG] PUT /materias/${idMateria} → materia actualizada`)
    return res.status(200).json({
      msg: `Se actualizó la materia con id ${idMateria}`,
      materiaModificada: materiaPush
    })
  } catch (error) {
    console.log('[ERROR] putMateriaById:', error)
    return res.status(500).json({ error: `No se pudo actualizar la materia con id ${idMateria}` })
  }
}

// DELETE /materias/:idMateria

const deleteMateriaById = async (req, res) => {
  const { idMateria } = req.params
  try {
    const materias = await readMaterias()

    const indexMateria = materias.findIndex((m) => m.idMateria === idMateria)

    if (indexMateria === -1) {
      return res.status(404).json({ msg: `No existe la materia con id ${idMateria}` })
    }

    materias.splice(indexMateria, 1)
    await writeMaterias(materias)

    console.log(`[FLAG] DELETE /materias/${idMateria} → materia eliminada`)
    return res.status(200).json({ msg: `Se eliminó la materia con id ${idMateria}` })
  } catch (error) {
    console.log('[ERROR] deleteMateriaById:', error)
    return res.status(500).json({ error: `No se pudo eliminar la materia con id ${idMateria}` })
  }
}

module.exports = {
  getMateriaAll,
  getMateriaById,
  postNewMateria,
  putMateriaById,
  deleteMateriaById
}