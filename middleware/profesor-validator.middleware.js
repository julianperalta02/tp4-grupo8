const profesorValidator = async (req, res, next) => {
  const { nombre, apellido, email, especialidad } = req.body
  const errors = []

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('No se ingresó un nombre válido')
  }
  if (typeof apellido !== 'string' || apellido.trim() === '') {
    errors.push('No se ingresó un apellido válido')
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    errors.push('No se ingresó un email válido')
  }
  if (typeof especialidad !== 'string' || especialidad.trim() === '') {
    errors.push('No se ingresó una especialidad válida')
  }

  if (errors.length > 0) {
    return res.status(400).json({ msg: 'Error en la validación de datos', errors })
  }

  next()
}

module.exports = { profesorValidator }