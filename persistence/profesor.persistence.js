const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '../data/extras/profesores.json')


const readProfesores = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return JSON.parse(data)
}


const writeProfesores = async (profesores) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(profesores, null, 2), 'utf8')
}

module.exports = { readProfesores, writeProfesores }