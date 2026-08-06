import APIBase from './httpBase'

export interface UploadResponse {
  url?: string
  urls?: string[]
}

class UploadService extends APIBase {
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })

    const res = await this.post<UploadResponse>('upload', formData)
    if (res.data.urls) {
      return res.data.urls
    }
    if (res.data.url) {
      return [res.data.url]
    }
    return []
  }
}

export const uploadService = new UploadService()
