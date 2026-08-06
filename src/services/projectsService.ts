import APIBase from './httpBase'

export interface ApiProjectRelatedProduct {
  label: string
  to: string
}

export interface ApiProject {
  _id?: string
  slug: string
  title: string
  category: string
  location?: string
  description: string
  image: string
  gallery?: string[]
  highlights?: string[]
  relatedProducts?: ApiProjectRelatedProduct[]
  active?: boolean
  createdAt?: string
}

class ProjectsService extends APIBase {
  async getProjects(params?: { all?: boolean; category?: string; search?: string }): Promise<ApiProject[]> {
    const query = new URLSearchParams()
    if (params?.all !== undefined) query.append('all', String(params.all))
    if (params?.category) query.append('category', params.category)
    if (params?.search) query.append('search', params.search)

    const endpoint = query.toString() ? `projects?${query.toString()}` : 'projects'
    const res = await this.get<ApiProject[]>(endpoint)
    return res.data
  }

  async getProjectBySlug(slug: string): Promise<ApiProject> {
    const res = await this.get<ApiProject>(`projects/${slug}`)
    return res.data
  }

  async createProject(data: Partial<ApiProject>): Promise<ApiProject> {
    const res = await this.post<ApiProject>('projects', data)
    return res.data
  }

  async updateProject(id: string, data: Partial<ApiProject>): Promise<ApiProject> {
    const res = await this.put<ApiProject>(`projects/${id}`, data)
    return res.data
  }

  async toggleProjectStatus(id: string, active?: boolean): Promise<{ message: string; project: ApiProject }> {
    const res = await this.patch<{ message: string; project: ApiProject }>(`projects/${id}/status`, { active })
    return res.data
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    const res = await this.delete<{ message: string }>(`projects/${id}`)
    return res.data
  }
}

export const projectsService = new ProjectsService()
