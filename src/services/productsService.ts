import APIBase from './httpBase'
import type { CatalogProduct, ProductLine } from '@/data/productTypes'

export interface ApiProduct extends CatalogProduct {
  _id?: string
  categorySlug: string
  line: ProductLine
}

class ProductsService extends APIBase {
  async getProducts(params?: { line?: ProductLine; categorySlug?: string; search?: string }): Promise<ApiProduct[]> {
    const query = new URLSearchParams()
    if (params?.line) query.append('line', params.line)
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug)
    if (params?.search) query.append('search', params.search)

    const endpoint = query.toString() ? `products?${query.toString()}` : 'products'
    const res = await this.get<ApiProduct[]>(endpoint)
    return res.data
  }

  async getProductBySlug(categorySlug: string, productSlug: string): Promise<ApiProduct> {
    const res = await this.get<ApiProduct>(`products/${categorySlug}/${productSlug}`)
    return res.data
  }

  async createProduct(data: Partial<ApiProduct>): Promise<ApiProduct> {
    const res = await this.post<ApiProduct>('products', data)
    return res.data
  }

  async updateProduct(id: string, data: Partial<ApiProduct>): Promise<ApiProduct> {
    const res = await this.put<ApiProduct>(`products/${id}`, data)
    return res.data
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await this.delete<{ message: string }>(`products/${id}`)
    return res.data
  }
}

export const productsService = new ProductsService()
