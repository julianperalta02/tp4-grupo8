const alumnoValidator = async (req, res, next) => {
    const { nombre, apellido, email, activo } = req.body
    const errors = []

    if (typeof nombre !== 'string' || nombre.trim() === '') {
        errors.push('No se ingresó un nombre válido')
    }
    if (typeof apellido !== 'string' || apellido.trim() === '') {
        errors.push('No se ingresó un apellido válido')
    }
    if (typeof email !== 'string' || email.trim() === '') {
        errors.push('No se ingresó un email válido')
    }
    if (typeof isActive !== 'boolean' && isActive !== undefined) {
        errors.push('No se ingresó un estado de actividad válido')
    }

    if (errors.length > 0) {
        return res.status(400).json({ msg: 'Error en la validación de datos', errors })
    }

    next()
}

module.exports = { alumnoValidator }