const { AlumnoModel } = require('../models/alumno.model.ts')
const fs = require('fs').promises

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    return res.status(200).json(alumnos)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se puedieron obtener los datos de los alumnos' })
  }
}

const getAlumnoById = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params

    const legajoId = alumnos.find(
      (a) => a.legajo === Number(legajo)
    )

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(legajoId)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo obtener el datalle del alumno con legajo n° {legajo}'
    })
  }
}

const postNewAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    console.log("Se parseó la información a alumnos")

    const legajos = alumnos.map((alumno) => alumno.legajo)
    const nuevoLegajo = Math.max(...legajos) + 1
    console.log(`Nuevo legajo generado: ${nuevoLegajo}`)

    const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLegajo)

    console.log(nuevoAlumno)
    const alumnoNuevo = nuevoAlumno.getAllAttributes()
    alumnos.push(alumnoNuevo)
    console.log(nuevoAlumno.getAllAttributes())

    await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf8')

    return res.status(200).json({
      msg: `Se agregó el nuevo alumno con legajo n° ${nuevoLegajo}`,
      alumnoNuevo: alumnoNuevo
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo agregar el nuevo alumno' })
  }
}

const putAlumnoByLegajo = async (req, res) => {
  const { legajo } = req.params
  try {
    const { nombre, apellido, email, activo } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const indexAlumno = alumnos.findIndex((alumno) => alumno.legajo === Number(legajo))

    if (indexAlumno === -1) {
      return res.status(404).json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    const alumnoEncontrado = alumnos[indexAlumno]

    const alumnoModificado = new AlumnoModel(
      alumnoEncontrado.nombre,
      alumnoEncontrado.apellido,
      alumnoEncontrado.email,
      alumnoEncontrado.legajo,
      alumnoEncontrado.fechaAlta,
      alumnoEncontrado.activo
    )

    if (nombre !== undefined) alumnoModificado.setNombre(nombre)
    if (apellido !== undefined) alumnoModificado.setApellido(apellido)
    if (email !== undefined) alumnoModificado.setEmail(email)
    if (activo !== undefined) alumnoModificado.setActivo(activo)

    alumnoModificado.setModificacion(new Date().toISOString().split('T')[0])

    const alumnoPush = alumnoModificado.getAllAttributes()
    alumnos[indexAlumno] = alumnoPush

    await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf8')

    return res.status(200).json({ msg: `Se actualizó el alumno con legajo n° ${legajo}`, alumnoModificado: alumnoPush })
  } catch (error) {
    return res.status(500).json({ error: `No se pudo actualizar el alumno con legajo n° ${legajo}` })
  }
}

const deleteAlumnoByLegajo = async (req, res) => {
  const { legajo } = req.params
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const indexAlumno = alumnos.findIndex((alumno) => alumno.legajo === Number(legajo))

    if (indexAlumno === -1) {
      return res.status(404).json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    alumnos.splice(indexAlumno, 1)

    await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf8')

    return res.status(200).json({ msg: `Se eliminó el alumno con legajo n° ${legajo}` })
  } catch (error) {
    return res.status(500).json({ error: `No se pudo eliminar el alumno con legajo n° ${legajo}` })
  }
}

module.exports = { getAlumnoAll, getAlumnoById, postNewAlumno, putAlumnoByLegajo, deleteAlumnoByLegajo }
