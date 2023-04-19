import { NextApiHandler, NextApiRequest } from 'next'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'

export const config = {
  api: {
    bodyParser: false,
  },
}

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {}
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), '/public/upload')
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + '_' + path.originalFilename
    }
  }
  options.multiples = true
  const form = formidable(options)
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + '/public', '/upload'))
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + '/public', '/upload'))
  }
  const { files } = await readFile(req, true)
  const fileNamesList = Array.isArray(files.file)
    ? files.file.map((file) => file.newFilename)
    : [files.file.newFilename]
  res.json({ done: 'ok', files: fileNamesList })
}

export default handler
