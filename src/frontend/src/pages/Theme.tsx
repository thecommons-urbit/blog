import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { ConfirmDeleteTheme } from '../components/Modal'
import { api } from '../state/api'
import { useStore } from '../state/base'

export default function Theme() {
  const { theme } = useParams()
  const [name, setName] = useState(theme ? theme : '')
  const [css, setCss] = useState('')
  const [showDeleteThemeModal, setShowDeleteThemeModal] = useState(false)
  const { getAll, saveTheme } = useStore()

  useEffect(() => {
    async function getCss() {
      const a = await api.scry({ app: 'blog', path: `/theme/${theme}` })
      setCss(a)
    }
    getCss()
    setName(theme || '')
  }, [theme])

  const handleSaveTheme = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      saveTheme(name, css)
      getAll()
    },
    [name, css]
  )

  const handleDeleteTheme = useCallback(async () => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'delete-theme': {
          theme: name,
        },
      },
    })
    getAll()
  }, [name])

  return (
    <div
      className='grid grid-rows-2 h-full py-4 pr-4'
      style={{ gridTemplateRows: 'auto 50px' }}
    >
      <div className='col-span-2'>
        <h1 className='text-3xl'>
          Theme Editor
        </h1>
        <p className='text-gray-700'>put your css below to add a theme</p>
        <div className='drop-shadow-2xl pt-2' style={{ height: '90%' }}>
          <CodeEditor
            value={css}
            language='css'
            onChange={(e) => setCss(e.target.value)}
            style={{
              resize: 'none',
              height: '100%',
              borderRadius: '1rem',
            }}
          />
        </div>
      </div>
      <div className='flex gap-x-4 col-span-2'>
        <input
          className='flex-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          value={theme}
          onChange={(e) => setName(e.target.value)}
          placeholder='theme-name'
        />
        <button
          className='flex-1 flex items-center justify-center bg-darkgray text-white p-2 rounded w-full disabled:opacity-50'
          onClick={() => setShowDeleteThemeModal(true)}
        >
          Delete Theme
        </button>
        <button
          className='flex-1 flex items-center justify-center bg-darkgray text-white p-2 rounded w-full disabled:opacity-50'
          onClick={handleSaveTheme}
          disabled={name === ''}
        >
          Save Theme
        </button>
      </div>
      {showDeleteThemeModal && (
        <ConfirmDeleteTheme
          onConfirm={handleDeleteTheme}
          theme={theme}
          setShowModal={setShowDeleteThemeModal}
        />
      )}
    </div>
  )
}
