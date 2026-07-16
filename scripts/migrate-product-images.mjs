import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'

const sourceFiles = [
  'src/data/industrialProducts.ts',
  'src/data/domesticProducts.ts',
  'src/data/accessoryProducts.ts',
]

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Faltan variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET')
}

const sourceEntries = await Promise.all(
  sourceFiles.map(async (file) => ({ file, content: await readFile(file, 'utf8') })),
)

const urlPattern = /https:\/\/helisa\.com\.ec\/wp-content\/uploads\/[^'"\s]+/g
const lechoFiles = [
  'Arena.png', 'Birm.png', 'Calcita.png', 'Carbon-Ecologico.png',
  'Carbon-mineral-antracita.png', 'Carbon-Vegetal-coco.png', 'Carbon-Vegetal.png',
  'Grava-2.png', 'Grava-3.png', 'Green-Sand.png', 'KDF-55.png', 'KDF-85.png',
  'Nextsand.png', 'Pirolox.png', 'Resina-Anionica-Acido-Fuerte.png',
  'Resina-Anionica-High-Purity.png', 'Resina-Cationica-Acido-Fuerte.png',
  'Resina-Cationica-CA-10.png', 'Resina-Cationica-High-Purity.png', 'Resina-mixta.png',
  'Zeomedia-1-micra.png', 'Zeomedia-5micras.png',
]
const mediaFiles = [
  'Resina-mixta.png?bwg=1631126440', 'Resina-Anionica-High-Purity.png?bwg=1631126592',
  'Pirolox.png?bwg=1631126701', 'Nextsand.png?bwg=1631126822', 'KDF-85.png?bwg=1631126875',
  'KDF-55.png?bwg=1631126921', 'Green-Sand.png?bwg=1631127011',
  'Carbon-Vegetal.png?bwg=1631127126', 'Carbon-mineral-antracita.png?bwg=1631127185',
  'Carbon-Ecologico.png?bwg=1631127248', 'Calcita.png?bwg=1631127303',
  'Birm.png?bwg=1631127382', 'Resina-Cationica-CA-10.png?bwg=1631127455',
  'Grava-2.png?bwg=1631127519',
]
const dynamicSources = [
  ...lechoFiles.map((file) => ({
    file,
    url: `https://helisa.com.ec/wp-content/uploads/2021/09/${file}`,
  })),
  ...mediaFiles.map((file) => ({
    file,
    url: `https://helisa.com.ec/wp-content/uploads/photo-gallery/imported_from_media_libray/thumb/${file}`,
  })),
]
const sourceUrls = Array.from(new Set([
  ...sourceEntries.flatMap(({ content }) => content.match(urlPattern) ?? []).filter((url) => !url.includes('${')),
  ...dynamicSources.map(({ url }) => url),
]))
const uploaded = new Map()
const failed = []

const makePublicId = (sourceUrl) => {
  const url = new URL(sourceUrl)
  const extension = extname(url.pathname)
  const rawName = basename(url.pathname, extension)
  const safeName = rawName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  const hash = createHash('sha1').update(sourceUrl).digest('hex').slice(0, 10)
  return `${safeName || 'producto'}-${hash}`
}

const upload = async (sourceUrl) => {
  const folder = 'helisa/products'
  const publicId = makePublicId(sourceUrl)
  const timestamp = Math.floor(Date.now() / 1000)
  const signaturePayload = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
  const signature = createHash('sha1').update(signaturePayload).digest('hex')
  const form = new FormData()

  form.set('file', sourceUrl)
  form.set('api_key', CLOUDINARY_API_KEY)
  form.set('folder', folder)
  form.set('overwrite', 'true')
  form.set('public_id', publicId)
  form.set('timestamp', String(timestamp))
  form.set('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form },
  )
  const result = await response.json()

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? `Cloudinary respondió ${response.status}`)
  }

  return result.secure_url
}

const workers = Array.from({ length: 5 }, async () => {
  while (sourceUrls.length) {
    const sourceUrl = sourceUrls.shift()
    if (!sourceUrl) return

    try {
      const cloudinaryUrl = await upload(sourceUrl)
      uploaded.set(sourceUrl, cloudinaryUrl)
      process.stdout.write('.')
    } catch (error) {
      failed.push({ sourceUrl, error: error instanceof Error ? error.message : String(error) })
      process.stdout.write('x')
    }
  }
})

await Promise.all(workers)
process.stdout.write('\n')

for (const entry of sourceEntries) {
  let nextContent = entry.content
  for (const [sourceUrl, cloudinaryUrl] of uploaded) {
    nextContent = nextContent.replaceAll(sourceUrl, cloudinaryUrl)
  }
  if (entry.file.endsWith('industrialProducts.ts')) {
    for (const { file, url } of dynamicSources) {
      const cloudinaryUrl = uploaded.get(url)
      if (cloudinaryUrl) nextContent = nextContent.replace(`'${file}'`, `'${cloudinaryUrl}'`)
    }
    nextContent = nextContent.replaceAll(
      'const image = `https://helisa.com.ec/wp-content/uploads/2021/09/${file}`',
      'const image = file',
    )
    nextContent = nextContent.replaceAll(
      'const image = `https://helisa.com.ec/wp-content/uploads/photo-gallery/imported_from_media_libray/thumb/${file}`',
      'const image = file',
    )
  }
  await writeFile(entry.file, nextContent)
}

console.log(`Imágenes migradas: ${uploaded.size}`)
console.log(`Imágenes pendientes: ${failed.length}`)

if (failed.length) {
  for (const item of failed) console.error(`${item.sourceUrl}: ${item.error}`)
  process.exitCode = 1
}
