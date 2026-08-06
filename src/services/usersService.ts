import APIBase from './httpBase'

export interface ApiUser {
  _id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt?: string
}

class UsersService extends APIBase {
  async getUsers(): Promise<ApiUser[]> {
    const res = await this.get<ApiUser[]>('users')
    return res.data
  }

  async createUser(data: { name: string; email: string; password: string; role?: string }): Promise<ApiUser> {
    const res = await this.post<ApiUser>('users', data)
    return res.data
  }

  async updateUser(id: string, data: Partial<{ name: string; email: string; password: string; role: string }>): Promise<ApiUser> {
    const res = await this.put<ApiUser>(`users/${id}`, data)
    return res.data
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const res = await this.delete<{ message: string }>(`users/${id}`)
    return res.data
  }
}

export const usersService = new UsersService()
