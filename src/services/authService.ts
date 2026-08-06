import APIBase from './httpBase'

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

class AuthService extends APIBase {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const res = await this.post<LoginResponse>('auth/login', credentials)
    return res.data
  }

  async me(): Promise<LoginResponse['user']> {
    const res = await this.get<LoginResponse['user']>('auth/me')
    return res.data
  }
}

export const authService = new AuthService()
