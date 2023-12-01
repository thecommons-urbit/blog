import React, { useState, useCallback, useEffect } from 'react'
import { marked } from 'marked'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline'
import { api } from '../state/api'
import { useStore } from '../state/base'
import { Publish } from './Modal'
import { scryUrbit } from '../urbit/scries'

// define bottom bar state / methods
interface BottomBarProps {
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BottomBar ({
  fileName,
  disabled,
  showPreview,
  setShowPreview,
  setFileName,
  setDisabled
}: BottomBarProps): JSX.Element {
  // global state / methods
  const {
    markdown,
    activeTheme,
    themes,
    isFocusMode,
    getAll,
    setPreviewCss,
    setActiveTheme,
    setIsFocusMode,
    saveDraft,
    pages,
    allBindings,
    drafts
  } = useStore()

  // local state/methods
  const [fileNameError, setFileNameError] = useState('')
  // 'publishModal' being the 'share to %rumors?' modal
  const [showPublishModal, setShowPublishModal] = useState(false)

  // update fileName
  useEffect(() => {
    // TODO ugly
    setFileName('/' + document.location.pathname.split('/').slice(4).join('/'))
  }, [document.location.pathname])

  // sanity-check fileName
  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      // fileName ends in a slash
      setDisabled(true)
      setFileNameError('cannot end in a slash')
    } else if (fileName.charAt(0) !== '/') {
      // fileName does not start with a slash
      setDisabled(true)
      setFileNameError('must start with a slash')
    } else if (allBindings[fileName] !== undefined) {
      // fileName is already in use by an app
      const inUse = allBindings[fileName]

      if (inUse === 'app: %blog') {
        // fileName is in use by %blog
        // TODO should this be true?
        setDisabled(false)
        setFileNameError(`replace ${fileName}`)
      } else {
        // fileName is in use by another app
        setDisabled(true)
        setFileNameError(`${fileName} is in use by ${inUse}`)
      }
    } else if (drafts.includes(fileName)) {
      // fileName is in use by a draft blog post
      // TODO should this be true?
      setDisabled(false)
      setFileNameError(`replace ${fileName}`)
    } else {
      // no error detected
      setDisabled(false)
      setFileNameError('')
    }
  }, [fileName, pages])

  // get CSS for new activeTheme
  useEffect(() => {
    // if activeTheme's name is an empty string, revert to first theme in the list
    if (themes.length > 0 && activeTheme === '') setActiveTheme(themes[0])
    async function getTheme (): Promise<void> {
      // check activeTheme's name is not an empty string before attempting to scry
      if (activeTheme !== '') {
        const css = await api.scry({ app: 'blog', path: `/theme/${activeTheme}` })
        setPreviewCss(css)
      }
    }
    getTheme()
  }, [activeTheme, themes])

  // TODO is this duplicate code?
  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setDisabled(true)
      setFileNameError('cannot end in a slash')
    } else if (fileName.charAt(0) !== '/') {
      setDisabled(true)
      setFileNameError('must start with a slash')
    } else if (allBindings[fileName] !== undefined) {
      const inUse = allBindings[fileName]
      if (inUse === 'app: %blog') {
        setDisabled(false)
        setFileNameError(`replace ${fileName}`)
      } else {
        setDisabled(true)
        setFileNameError(`${fileName} is in use by ${inUse}`)
      }
    } else if (drafts.includes(fileName)) {
      setDisabled(false)
      setFileNameError(`replace ${fileName}`)
    } else {
      setDisabled(false)
      setFileNameError('')
    }
  }, [fileName, pages])

  const handleSaveDraft = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      // save draft to backend
      saveDraft(fileName, markdown)
      // scry new frontend state
      // TODO review frontend/backend state interaction
      //        backend should actively update frontend
      getAll()
    },
    [fileName, markdown]
  )

  // check if pals and rumors are both installed
  const palsAndRumorsInstalled = async (): Promise<boolean> => {
    const result = await scryUrbit('blog', '/aaaah')
    return result
  }

  // publish post
  const handlePublish = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          publish: {
            path: fileName,
            html: marked.parse(markdown),
            md: markdown,
            theme: activeTheme
          }
        }
      })
      getAll()

      if (await palsAndRumorsInstalled()) {
        setShowPublishModal(true)
      } else {
        setShowPublishModal(false)
      }
    },
    [fileName, markdown, activeTheme]
  )

  return (
    <div className='w-full h-full grid gap-x-4 grid-cols-12 items-start'>
      {/* filename input */}
      <div className='col-span-4'>
        <code>
          <input
            className='w-full shadow appearance-none border rounded py-2 px-3 font-mono text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder='/example/path'
            value={fileName}
            onChange={(e) => { setFileName(e.target.value) }}
            pattern='^\/.+(?!\/)'
            required
          />
          <p className='text-red-500 text-xs italic line-clamp-1'>
            {fileNameError}
          </p>
        </code>
      </div>
      {/* theme select */}
      <div className='col-span-3'>
        <select
          className='w-full rounded border-none font-mono focus:outline-none'
          value={activeTheme}
          onChange={(e) => { setActiveTheme(e.target.value) }}
        >
          {themes.map((theme, i) => (
            <option value={theme} key={i}>
              {theme}
            </option>
          ))}
        </select>
        <p className='text-xs font-sans italic line-clamp-1'>
          <code>%theme</code>
        </p>
      </div>
      {/* save draft button */}
      <button
        className='col-span-2 flex-1 flex items-center justify-center text-white px-2 py-3 rounded w-full bg-darkgray disabled:opacity-50 font-sans'
        disabled={fileName === '' || disabled}
        onClick={handleSaveDraft}
      >
        Save Draft
      </button>
      {/* publish button */}
      <button
        className='col-span-2 flex-1 flex items-center justify-center text-white px-2 py-3 rounded w-full bg-darkgray disabled:opacity-50 font-sans'
        disabled={fileName === '' || disabled}
        onClick={handlePublish}
      >
        Publish
      </button>
      <div className='col-span-1 flex flex-row h-full items-center justify-center'>
        {/* fullscreen editor button */}
        <button
          className='flex-1 flex items-start justify-center rounded w-full h-full text-blue-500 hover:text-blue-700'
          onClick={() => { setIsFocusMode(!isFocusMode) }}
        >
          <div className='text-left flex items-center'>
            <div className='py-3 w-5 mr-2'>
              {isFocusMode
                ? (
                <ArrowsPointingInIcon />
                  )
                : (
                <ArrowsPointingOutIcon />
                  )}
            </div>
          </div>
        </button>
        {/* show/hide preview button */}
        <button
          className='flex-1 flex items-start justify-center rounded w-full h-full text-blue-500 hover:text-blue-700'
          onClick={() => { setShowPreview(!showPreview) }}
        >
          <div className='text-left flex items-center'>
            <div className='py-3 w-5 mr-2'>
              {showPreview ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </div>
          </div>
        </button>
      </div>

      {showPublishModal && (
        <Publish fileName={fileName} setShowModal={setShowPublishModal} />
      )}
    </div>
  )
}
