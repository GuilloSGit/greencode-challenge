export interface Joke {
    id: string
    value: string
    icon_url?: string
    url?: string
    rating?: number
  }
  
  export type ToastType = "success" | "error" | "info" | "warning"
  
  export interface Toast {
    id: string
    message: string
    type: ToastType
  }
  
  