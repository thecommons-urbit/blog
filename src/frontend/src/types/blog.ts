// basic types

export type CSS = string
export type URI = string
export type Ship = string
export type Path = string
export type HTML = string
export type Theme = string
export type Markdown = string

// %blog-action

export enum Action {
  Publish = 'publish',
  Unpublish = 'unpublish',
  Export = 'export',
  SaveDraft = 'save-draft',
  DeleteDraft = 'delete-draft',
  SaveTheme = 'save-theme',
  DeleteTheme = 'delete-theme',
  UpdateURI = 'update-uri'
}

export interface BlogAction {
  'blog-action': Action
}
