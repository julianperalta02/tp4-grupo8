const notaValidator = async (req, res, next) => {
  const { legajo, idMateria, nota, fecha } = req.body
  const errors = []

  if (typeof legajo !== 'number') {
    errors.push('El legajo es obligatorio y debe ser numérico')
  }
  if (typeof idMateria !== 'string' || idMateria.trim() === '') {
    errors.push('No se ingresó un idMateria válido')
  }
  if (typeof nota !== 'number') {
    errors.push('La nota es obligatoria y debe ser numérica')
  }
  if (typeof fecha !== 'string' || fecha.trim() === '') {
    errors.push('La fecha es obligatoria')
  }

  if (errors.length > 0) {
    return res.status(400).json({ msg: 'Error en la validación de datos', errors })
  }

  next()
}

module.exports = { notaValidator }