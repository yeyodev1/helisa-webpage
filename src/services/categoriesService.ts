import APIBase from './httpBase'
import type { CatalogCategory, ProductLine } from '@/data/productTypes'

export interface ApiCategory extends CatalogCategory {
  _id?: string
}

class CategoriesService extends APIBase {
  async getCategories(line?: ProductLine): Promise<ApiCategory[]> {
    const endpoint = line ? `categories?line=${line}` : 'categories'
    const res = await this.get<ApiCategory[]>(endpoint)
    return res.data
  }

  async getCategoryBySlug(slug: string): Promise<ApiCategory> {
    const res = await this.get<ApiCategory>(`categories/${slug}`)
    return res.data
  }

  async createCategory(data: Partial<ApiCategory>): Promise<ApiCategory> {
    const res = await this.post<ApiCategory>('categories', data)
    return res.data
  }

  async updateCategory(id: string, data: Partial<ApiCategory>): Promise<ApiCategory> {
    const res = await this.put<ApiCategory>(`categories/${id}`, data)
    return res.data
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const res = await this.delete<{ message: string }>(`categories/${id}`)
    return res.data
  }
}

export const categoriesService = new CategoriesService()
