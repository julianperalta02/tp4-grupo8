const { AlumnoModel } = require('../models/alumno.model.ts')
const { readAlumnos, writeAlumnos } = require('../persistence/alumno.persistence')

const getAlumnoAll = async (req, res) => {
  try {
    const alumnos = await readAlumnos()

    const { isActive, apellido } = req.query
    let resultado = alumnos

    // Filtro opcional por isActive 
    if (isActive !== undefined) {
      const activo = isActive === 'true'
      resultado = resultado.filter((a) => a.isActive === activo)
      console.log(`[FLAG] Filtro aplicado: isActive=${activo} → ${resultado.length} resultado/s`)
    }

    // Filtro opcional por apellido 
    if (apellido !== undefined) {
      const apellidoLower = apellido.toLowerCase()
      resultado = resultado.filter((a) =>
        a.apellido.toLowerCase().includes(apellidoLower)
      )
      console.log(`[FLAG] Filtro aplicado: apellido="${apellido}" → ${resultado.length} resultado/s`)
    }

    console.log(`[FLAG] GET /alumnos → ${resultado.length} alumno/s devuelto/s`)
    return res.status(200).json(resultado)
  } catch (error) {
    console.log('[ERROR] getAlumnoAll:', error)
    return res
      .status(500)
      .json({ error: 'No se pudieron obtener los datos de los alumnos' })
  }
}

// GET /alumnos/:legajo

const getAlumnoById = async (req, res) => {
  const { legajo } = req.params
  try {
    const alumnos = await readAlumnos()

    const alumnoEncontrado = alumnos.find(
      (a) => a.legajo === Number(legajo)
    )

    if (!alumnoEncontrado) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    console.log(`[FLAG] GET /alumnos/${legajo} → alumno encontrado`)
    return res.status(200).json(alumnoEncontrado)
  } catch (error) {
    console.log('[ERROR] getAlumnoById:', error)
    return res.status(500).json({
      error: `No se pudo obtener el detalle del alumno con legajo n° ${legajo}`
    })
  }
}

// POST /alumnos

const postNewAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const alumnos = await readAlumnos()

    // Verificar que no exista un alumno con el mismo email (409 Conflict)
    const emailDuplicado = alumnos.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    )
    if (emailDuplicado) {
      return res.status(409).json({
        error: `Ya existe un alumno registrado con el email ${email}`
      })
    }

    // Generar nuevo legajo automaticamente
    const legajos = alumnos.map((alumno) => alumno.legajo)
    const nuevoLegajo = legajos.length > 0 ? Math.max(...legajos) + 1 : 10001

    const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLegajo)
    const alumnoNuevo = nuevoAlumno.getAllAttributes()

    alumnos.push(alumnoNuevo)
    await writeAlumnos(alumnos)

    console.log(`[FLAG] POST /alumnos → alumno creado con legajo n° ${nuevoLegajo}`)
    return res.status(201).json({
      msg: `Se agregó el nuevo alumno con legajo n° ${nuevoLegajo}`,
      alumnoNuevo
    })
  } catch (error) {
    console.log('[ERROR] postNewAlumno:', error)
    return res.status(500).json({ error: 'No se pudo agregar el nuevo alumno' })
  }
}

// PUT /alumnos/:legajo

const putAlumnoByLegajo = async (req, res) => {
  const { legajo } = req.params
  try {
    const { nombre, apellido, email, isActive } = req.body

    const alumnos = await readAlumnos()

    const indexAlumno = alumnos.findIndex(
      (alumno) => alumno.legajo === Number(legajo)
    )

    if (indexAlumno === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    const alumnoEncontrado = alumnos[indexAlumno]
    const alumnoModificado = new AlumnoModel(
      alumnoEncontrado.nombre,
      alumnoEncontrado.apellido,
      alumnoEncontrado.email,
      alumnoEncontrado.legajo,      
      alumnoEncontrado.fechaAlta,
      alumnoEncontrado.modificacion,
      alumnoEncontrado.isActive      
    )

    // Solo se actualizan los campos que vienen en el body
    if (nombre !== undefined) alumnoModificado.setNombre(nombre)
    if (apellido !== undefined) alumnoModificado.setApellido(apellido)
    if (email !== undefined) alumnoModificado.setEmail(email)
    if (isActive !== undefined) alumnoModificado.setIsActive(isActive)  

    alumnoModificado.setModificacion(new Date().toISOString().split('T')[0])

    const alumnoPush = alumnoModificado.getAllAttributes()
    alumnos[indexAlumno] = alumnoPush

    await writeAlumnos(alumnos)

    console.log(`[FLAG] PUT /alumnos/${legajo} → alumno actualizado`)
    return res.status(200).json({
      msg: `Se actualizó el alumno con legajo n° ${legajo}`,
      alumnoModificado: alumnoPush
    })
  } catch (error) {
    console.log('[ERROR] putAlumnoByLegajo:', error)
    return res
      .status(500)
      .json({ error: `No se pudo actualizar el alumno con legajo n° ${legajo}` })
  }
}

// DELETE /alumnos/:legajo

const deleteAlumnoByLegajo = async (req, res) => {
  const { legajo } = req.params
  try {
    const alumnos = await readAlumnos()

    const indexAlumno = alumnos.findIndex(
      (alumno) => alumno.legajo === Number(legajo)
    )

    if (indexAlumno === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    alumnos.splice(indexAlumno, 1)
    await writeAlumnos(alumnos)

    console.log(`[FLAG] DELETE /alumnos/${legajo} → alumno eliminado`)
    return res.status(200).json({
      msg: `Se eliminó el alumno con legajo n° ${legajo}`
    })
  } catch (error) {
    console.log('[ERROR] deleteAlumnoByLegajo:', error)
    return res
      .status(500)
      .json({ error: `No se pudo eliminar el alumno con legajo n° ${legajo}` })
  }
}

module.exports = {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno,
  putAlumnoByLegajo,
  deleteAlumnoByLegajo
}