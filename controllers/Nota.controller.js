const { NotaModel } = require('../models/extras/nota.model.ts')
const { readNotas, writeNotas } = require('../persistence/nota.persistance')


const getNotaAll = async (req, res) => {
  try {
    const notas = await readNotas()

    const { legajo, idMateria } = req.query
    let resultado = notas

    if (legajo !== undefined) {
      resultado = resultado.filter((n) => n.legajo === Number(legajo))
      console.log(`[FLAG] Filtro aplicado: legajo=${legajo} → ${resultado.length} resultado/s`)
    }

    if (idMateria !== undefined) {
      resultado = resultado.filter((n) => n.idMateria === idMateria)
      console.log(`[FLAG] Filtro aplicado: idMateria=${idMateria} → ${resultado.length} resultado/s`)
    }

    console.log(`[FLAG] GET /notas → ${resultado.length} nota/s devuelta/s`)
    return res.status(200).json(resultado)
  } catch (error) {
    console.log('[ERROR] getNotaAll:', error)
    return res.status(500).json({ error: 'No se pudieron obtener las notas' })
  }
}

// GET /notas/:id

const getNotaById = async (req, res) => {
  const { id } = req.params
  try {
    const notas = await readNotas()

    const notaEncontrada = notas.find((n) => n.id === Number(id))

    if (!notaEncontrada) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    console.log(`[FLAG] GET /notas/${id} → nota encontrada`)
    return res.status(200).json(notaEncontrada)
  } catch (error) {
    console.log('[ERROR] getNotaById:', error)
    return res.status(500).json({ error: `No se pudo obtener la nota con id ${id}` })
  }
}

// POST /notas

const postNewNota = async (req, res) => {
  try {
    const { legajo, idMateria, nota, fecha } = req.body

    // Validar con el modelo (sin id, lo genera el servidor)
    const errores = []
    if (typeof legajo !== 'number') errores.push('El legajo es obligatorio y debe ser numérico')
    if (!idMateria || typeof idMateria !== 'string') errores.push('idMateria es obligatorio')
    if (typeof nota !== 'number') errores.push('La nota es obligatoria y debe ser numérica')
    if (!fecha || typeof fecha !== 'string') errores.push('La fecha es obligatoria')

    if (errores.length > 0) {
      return res.status(400).json({ errors: errores })
    }

    const notas = await readNotas()

    const ids = notas.map((n) => n.id)
    const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1

    const nuevaNota = new NotaModel(nuevoId, legajo, idMateria, nota, fecha)
    const notaNueva = nuevaNota.getAllAttributes()

    notas.push(notaNueva)
    await writeNotas(notas)

    console.log(`[FLAG] POST /notas → nota creada con id ${nuevoId}`)
    return res.status(201).json({
      msg: `Se agregó la nueva nota con id ${nuevoId}`,
      notaNueva
    })
  } catch (error) {
    console.log('[ERROR] postNewNota:', error)
    return res.status(500).json({ error: 'No se pudo agregar la nueva nota' })
  }
}

// PUT /notas/:id

const putNotaById = async (req, res) => {
  const { id } = req.params
  try {
    const { nota, fecha } = req.body

    const notas = await readNotas()

    const indexNota = notas.findIndex((n) => n.id === Number(id))

    if (indexNota === -1) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    const notaEncontrada = notas[indexNota]

    const notaModificada = new NotaModel(
      notaEncontrada.id,        
      notaEncontrada.legajo,    
      notaEncontrada.idMateria, 
      notaEncontrada.nota,
      notaEncontrada.fecha
    )

    if (nota !== undefined) notaModificada.setNota(nota)
    if (fecha !== undefined) notaModificada.setFecha(fecha)

    const notaPush = notaModificada.getAllAttributes()
    notas[indexNota] = notaPush

    await writeNotas(notas)

    console.log(`[FLAG] PUT /notas/${id} → nota actualizada`)
    return res.status(200).json({
      msg: `Se actualizó la nota con id ${id}`,
      notaModificada: notaPush
    })
  } catch (error) {
    console.log('[ERROR] putNotaById:', error)
    return res.status(500).json({ error: `No se pudo actualizar la nota con id ${id}` })
  }
}

// DELETE /notas/:id

const deleteNotaById = async (req, res) => {
  const { id } = req.params
  try {
    const notas = await readNotas()

    const indexNota = notas.findIndex((n) => n.id === Number(id))

    if (indexNota === -1) {
      return res.status(404).json({ msg: `No existe la nota con id ${id}` })
    }

    notas.splice(indexNota, 1)
    await writeNotas(notas)

    console.log(`[FLAG] DELETE /notas/${id} → nota eliminada`)
    return res.status(200).json({ msg: `Se eliminó la nota con id ${id}` })
  } catch (error) {
    console.log('[ERROR] deleteNotaById:', error)
    return res.status(500).json({ error: `No se pudo eliminar la nota con id ${id}` })
  }
}

module.exports = {
  getNotaAll,
  getNotaById,
  postNewNota,
  putNotaById,
  deleteNotaById
}