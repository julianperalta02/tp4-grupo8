const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '../data/extras/materias.json')


const readMaterias = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return JSON.parse(data)
}


const writeMaterias = async (materias) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(materias, null, 2), 'utf8')
}

module.exports = { readMaterias, writeMaterias }