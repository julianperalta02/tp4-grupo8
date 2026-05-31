const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '../data/extras/notas.json')


const readNotas = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf8')
  return JSON.parse(data)
}


const writeNotas = async (notas) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(notas, null, 2), 'utf8')
}

module.exports = { readNotas, writeNotas }