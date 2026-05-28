const materiaValidator = async (req, res, next) => {
  const { idMateria, nombre, cuatrimestre } = req.body
  const errors = []

  if (typeof idMateria !== 'string' || idMateria.trim() === '') {
    errors.push('No se ingresó un idMateria válido')
  }
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('No se ingresó un nombre válido')
  }
  if (typeof cuatrimestre !== 'number') {
    errors.push('El cuatrimestre debe ser un número')
  }

  if (errors.length > 0) {
    return res.status(400).json({ msg: 'Error en la validación de datos', errors })
  }

  next()
}

module.exports = { materiaValidator }