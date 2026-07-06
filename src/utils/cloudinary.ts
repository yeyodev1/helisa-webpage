export const cloudinaryVariant = (url: string, transform: string) => {
  const marker = '/image/upload/'
  const index = url.indexOf(marker)
  if (index === -1) return url

  const start = index + marker.length
  return `${url.slice(0, start)}${transform}/${url.slice(start)}`
}
