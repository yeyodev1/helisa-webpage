import APIBase from './httpBase'

export interface ApiAboutValue {
  title: string
  desc: string
  icon: string
}

export interface ApiAboutTimelineItem {
  year: string
  title: string
  desc: string
  image: string
}

export interface ApiAbout {
  _id?: string
  storyImage: string
  storyParagraphs: string[]
  values: ApiAboutValue[]
  timeline: ApiAboutTimelineItem[]
}

class AboutService extends APIBase {
  async getAbout(): Promise<ApiAbout> {
    const res = await this.get<ApiAbout>('about')
    return res.data
  }

  async updateAbout(data: Partial<ApiAbout>): Promise<ApiAbout> {
    const res = await this.put<ApiAbout>('about', data)
    return res.data
  }
}

export const aboutService = new AboutService()
