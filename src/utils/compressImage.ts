/**
 * Resizes and re-encodes an image on the client before it's uploaded.
 *
 * Vercel serverless functions reject request bodies over ~4.5MB with a 413,
 * before our Express/multer code ever runs — so oversized photos (common on
 * phone cameras) must be shrunk in the browser, not on the server.
 */
export interface CompressImageOptions {
  maxDimension?: number
  quality?: number
  maxSizeBytes?: number
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function compressImage(file: File, options: CompressImageOptions = {}): Promise<File> {
  const { maxDimension = 1920, quality = 0.82, maxSizeBytes = 4 * 1024 * 1024 } = options

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  if (file.size <= maxSizeBytes && file.size <= 1.5 * 1024 * 1024) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    let currentQuality = quality
    let blob = await canvasToBlob(canvas, 'image/jpeg', currentQuality)
    while (blob && blob.size > maxSizeBytes && currentQuality > 0.4) {
      currentQuality -= 0.15
      blob = await canvasToBlob(canvas, 'image/jpeg', currentQuality)
    }

    if (!blob) return file

    const newName = file.name.replace(/\.[^./\\]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
