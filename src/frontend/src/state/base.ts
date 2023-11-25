import { create } from 'zustand'
import { defaultText } from '../lib/defaultText'
import { api } from './api'

export interface State {
  // state properties
  markdown:       string
  previewCss:     string
  activeTheme:    string
  isFocusMode:    boolean,
  allBindings:    {[key: string]: string}
  pages:          string[]
  drafts:         string[]
  themes:         string[]

  // state update methods
  setMarkdown:    (s: string) => void
  setPreviewCss:  (s: string) => void
  setActiveTheme: (s: string) => void
  setIsFocusMode: (b: boolean) => void
  // scries
  getAll:         () => Promise<void>
  getDraft:       (s: string) => Promise<void>
  getPage:        (s: string) => Promise<void>
  // pokes
  saveDraft:      (s: string, t: string) => Promise<void>
  saveTheme:      (s: string, t: string) => Promise<void>
}

export const useStore = create<State>()((set) => ({
  // state defaults
  markdown: defaultText,
  previewCss: '',
  activeTheme: '',
  isFocusMode: false,
  allBindings: {},
  pages: [],
  drafts: [],
  themes: [],

  // state update methods
  // TODO add types to arguments
  setMarkdown: (s) => set(() => ({ markdown: s })),
  setPreviewCss: (s) => set(() => ({ previewCss: s })),
  setActiveTheme: (s) => (set(() => ({ activeTheme: s}))),
  setIsFocusMode: (b) => (set(() => ({ isFocusMode: b}))),

  // scries
  // TODO split getAll() into four scries
  getAll: async () => {
    let pages       = await api.scry({ app: 'blog', path: '/pages' })
    let drafts      = await api.scry({ app: 'blog', path: '/drafts' })
    let themes      = await api.scry({ app: 'blog', path: '/themes'})
    let allBindings = await api.scry({ app: 'blog', path: '/all-bindings'})

    set({ drafts, pages, allBindings, themes })
  },
  getDraft: async (s) => {
    let draft = await api.scry({ app : 'blog', path: `/draft${s}`})
    set({ markdown : draft })
  },
  getPage: async (s) => { 
    let page  = await api.scry({ app : 'blog', path: `/md${s}`})
    set({ markdown : page })
  },

  // pokes
  saveDraft: async (fileName: string, markdown: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'save-draft': {
          path: fileName,
          md: markdown,
        },
      },
    })
  },
  saveTheme: async (theme: string, css: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'save-theme': {
          theme: theme,
          css: css,
        },
      },
    })
  }
}))
