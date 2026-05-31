const { ProfesorModel } = require('../models/extras/profesor.model.ts')
const { readProfesores, writeProfesores } = require('../persistence/profesor.persistence')

const getProfesorAll = async (req, res) => {
  try {
    const profesores = await readProfesores()

    const { especialidad } = req.query
    let resultado = profesores

    if (especialidad !== undefined) {
      const esp = especialidad.toLowerCase()
      resultado = resultado.filter((p) =>
        p.especialidad.toLowerCase().includes(esp)
      )
      console.log(`[FLAG] Filtro aplicado: especialidad="${especialidad}" → ${resultado.length} resultado/s`)
    }

    console.log(`[FLAG] GET /profesores → ${resultado.length} profesor/es devuelto/s`)
    return res.status(200).json(resultado)
  } catch (error) {
    console.log('[ERROR] getProfesorAll:', error)
    return res.status(500).json({ error: 'No se pudieron obtener los profesores' })
  }
}

// GET /profesores/:legajoProfesor

const getProfesorById = async (req, res) => {
  const { legajoProfesor } = req.params
  try {
    const profesores = await readProfesores()

    const profesorEncontrado = profesores.find(
      (p) => p.legajoProfesor === Number(legajoProfesor)
    )

    if (!profesorEncontrado) {
      return res
        .status(404)
        .json({ msg: `No existe el profesor con legajo ${legajoProfesor}` })
    }

    console.log(`[FLAG] GET /profesores/${legajoProfesor} → profesor encontrado`)
    return res.status(200).json(profesorEncontrado)
  } catch (error) {
    console.log('[ERROR] getProfesorById:', error)
    return res
      .status(500)
      .json({ error: `No se pudo obtener el profesor con legajo ${legajoProfesor}` })
  }
}

// POST /profesores

const postNewProfesor = async (req, res) => {
  try {
    const { nombre, apellido, email, especialidad } = req.body

    // Validar con el modelo (sin legajoProfesor, lo genera el servidor)
    const errores = []
    if (!nombre || nombre.trim() === '') errores.push('El nombre es obligatorio')
    if (!apellido || apellido.trim() === '') errores.push('El apellido es obligatorio')
    if (!email || !email.includes('@')) errores.push('El email es obligatorio y debe ser válido')
    if (!especialidad || typeof especialidad !== 'string') errores.push('La especialidad es obligatoria')

    if (errores.length > 0) {
      return res.status(400).json({ errors: errores })
    }

    const profesores = await readProfesores()

    // Verificar email duplicado (409 Conflict)
    const emailDuplicado = profesores.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    )
    if (emailDuplicado) {
      return res
        .status(409)
        .json({ error: `Ya existe un profesor registrado con el email ${email}` })
    }

    // Generar legajoProfesor automaticamente
    
    const legajos = profesores.map((p) => p.legajoProfesor)
    const nuevoLegajo = legajos.length > 0 ? Math.max(...legajos) + 1 : 20001

    const nuevoProfesor = new ProfesorModel(nombre, apellido, email, nuevoLegajo, especialidad)
    const profesorNuevo = nuevoProfesor.getAllAttributes()

    profesores.push(profesorNuevo)
    await writeProfesores(profesores)

    console.log(`[FLAG] POST /profesores → profesor creado con legajo n° ${nuevoLegajo}`)
    return res.status(201).json({
      msg: `Se agregó el nuevo profesor con legajo n° ${nuevoLegajo}`,
      profesorNuevo
    })
  } catch (error) {
    console.log('[ERROR] postNewProfesor:', error)
    return res.status(500).json({ error: 'No se pudo agregar el nuevo profesor' })
  }
}

// PUT /profesores/:legajoProfesor

const putProfesorById = async (req, res) => {
  const { legajoProfesor } = req.params
  try {
    const { nombre, apellido, email, especialidad } = req.body

    const profesores = await readProfesores()

    const indexProfesor = profesores.findIndex(
      (p) => p.legajoProfesor === Number(legajoProfesor)
    )

    if (indexProfesor === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el profesor con legajo ${legajoProfesor}` })
    }

    const profesorEncontrado = profesores[indexProfesor]

    const profesorModificado = new ProfesorModel(
      profesorEncontrado.nombre,
      profesorEncontrado.apellido,
      profesorEncontrado.email,
      profesorEncontrado.legajoProfesor,  
      profesorEncontrado.especialidad
    )

    if (nombre !== undefined) profesorModificado.setNombre(nombre)
    if (apellido !== undefined) profesorModificado.setApellido(apellido)
    if (email !== undefined) profesorModificado.setEmail(email)
    if (especialidad !== undefined) profesorModificado.setEspecialidad(especialidad)

    const profesorPush = profesorModificado.getAllAttributes()
    profesores[indexProfesor] = profesorPush

    await writeProfesores(profesores)

    console.log(`[FLAG] PUT /profesores/${legajoProfesor} → profesor actualizado`)
    return res.status(200).json({
      msg: `Se actualizó el profesor con legajo n° ${legajoProfesor}`,
      profesorModificado: profesorPush
    })
  } catch (error) {
    console.log('[ERROR] putProfesorById:', error)
    return res
      .status(500)
      .json({ error: `No se pudo actualizar el profesor con legajo ${legajoProfesor}` })
  }
}

// DELETE /profesores/:legajoProfesor

const deleteProfesorById = async (req, res) => {
  const { legajoProfesor } = req.params
  try {
    const profesores = await readProfesores()

    const indexProfesor = profesores.findIndex(
      (p) => p.legajoProfesor === Number(legajoProfesor)
    )

    if (indexProfesor === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el profesor con legajo ${legajoProfesor}` })
    }

    profesores.splice(indexProfesor, 1)
    await writeProfesores(profesores)

    console.log(`[FLAG] DELETE /profesores/${legajoProfesor} → profesor eliminado`)
    return res.status(200).json({
      msg: `Se eliminó el profesor con legajo n° ${legajoProfesor}`
    })
  } catch (error) {
    console.log('[ERROR] deleteProfesorById:', error)
    return res
      .status(500)
      .json({ error: `No se pudo eliminar el profesor con legajo ${legajoProfesor}` })
  }
}

module.exports = {
  getProfesorAll,
  getProfesorById,
  postNewProfesor,
  putProfesorById,
  deleteProfesorById
}