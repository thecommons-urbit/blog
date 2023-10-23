import { useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { api } from '../state/api'
import Editor from '../components/Editor'
import { useStore } from '../state/base'

export default function Published() {
  const match = useMatch('*')
  const setMarkdown    = useStore((state) => state.setMarkdown)
  const setActiveTheme = useStore((state) => state.setActiveTheme)

  useEffect(() => {
    const getDraft = async () => {
      if (!match) return
      const res = await api.scry({
        app: 'blog',
        path: '/md/' + match?.pathname.split('/').slice(2).join('/') // TODO ugly code
      })
      const activeTheme = await api.scry({
        app : 'blog', path: '/active-theme/' + match?.pathname.split('/').slice(2).join('/') // TODO ugly code
      })
      setMarkdown(res)
      setActiveTheme(activeTheme)
    }
    getDraft()
  }, [match])

  return (
    <Editor/>
  )
}