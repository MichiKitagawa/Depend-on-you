import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ユーザーの型定義
interface User {
  id: string
  name: string
  username: string
  email: string
  avatarUrl?: string
}

// 認証状態の型定義
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, username: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

// ユーザーストアの作成
export const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // ログイン処理
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // 実際のAPI呼び出しの代わりにモックデータを使用
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 認証成功時の処理
          const mockUser = {
            id: 'u1',
            name: '山田太郎',
            username: 'taro_yamada',
            email: email,
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
          }
          
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2)
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({
            error: (error as Error).message || 'ログインに失敗しました',
            isLoading: false
          })
        }
      },
      
      // 新規登録処理
      register: async (name: string, username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // 実際のAPI呼び出しの代わりにモックデータを使用
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 登録成功時の処理
          const mockUser = {
            id: 'u' + Math.floor(Math.random() * 1000),
            name,
            username,
            email,
            avatarUrl: `https://avatars.dicebear.com/api/identicon/${username}.svg`
          }
          
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2)
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({
            error: (error as Error).message || '登録に失敗しました',
            isLoading: false
          })
        }
      },
      
      // ログアウト処理
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },
      
      // エラーをクリア
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'user-store', // ローカルストレージのキー
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
) 