import React, { useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { api } from '../state/api'
import Editor from '../components/Editor'
import { useStore } from '../state/base'

// draft post
export default function Draft (): JSX.Element {
  const match = useMatch('*')
  const setMarkdown = useStore((state) => state.setMarkdown)

  useEffect(() => {
    const getDraft = async (): Promise<void> => {
      if (match === null) return
      const res = await api.scry({
        app: 'blog',
        path: match.pathname
      })
      setMarkdown(res)
    }
    getDraft()
  }, [match])

  return (
    <Editor/>
  )
}
