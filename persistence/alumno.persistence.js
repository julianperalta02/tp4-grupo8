const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '../data/alumnos.json')


const readAlumnos = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return JSON.parse(data)
}

const writeAlumnos = async (alumnos) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(alumnos, null, 2), 'utf8')
}

module.exports = { readAlumnos, writeAlumnos }