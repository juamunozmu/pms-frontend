import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UIState {
  notifications: Notification[]
  isSidebarOpen: boolean
  isLoading: boolean
  currentModal: string | null
}

const initialState: UIState = {
  notifications: [],
  isSidebarOpen: true,
  isLoading: false,
  currentModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      )
    },
    toggleSidebar: state => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.currentModal = action.payload
    },
    closeModal: state => {
      state.currentModal = null
    },
  },
})

export const {
  addNotification,
  removeNotification,
  toggleSidebar,
  setLoading,
  openModal,
  closeModal,
} = uiSlice.actions

export default uiSlice.reducer
