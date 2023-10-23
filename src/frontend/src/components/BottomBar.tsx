import { useState, useCallback, useEffect } from 'react'
import { marked } from 'marked'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import { api } from '../state/api'
import { useStore } from '../state/base'
import { Publish } from './Modal'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxArrowDownIcon,
  RssIcon
} from '@heroicons/react/24/outline'

type BottomBarProps = {
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BottomBar({
  fileName,
  disabled,
  showPreview,
  setShowPreview,
  setFileName,
  setDisabled,
}: BottomBarProps) {
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
    drafts,
  } = useStore()

  const [fileNameError, setFileNameError] = useState('')
  const [showPublishModal, setShowPublishModal] = useState(false)

  useEffect(() => {
    setFileName('/' + document.location.pathname.split('/').slice(4).join('/')) // TODO ugly
  }, [document.location.pathname])

  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setDisabled(true)
      setFileNameError(`cannot end in a slash`)
    } else if (fileName.charAt(0) !== '/') {
      setDisabled(true)
      setFileNameError(`must start with a slash`)
    } else if (allBindings[fileName]) {
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

  useEffect(() => {
    if (themes.length > 0 && activeTheme === '') setActiveTheme(themes[0])
    async function getTheme() {
      const css = await api.scry({ app: 'blog', path: `/theme/${activeTheme}` })
      setPreviewCss(css)
    }
    getTheme()
  }, [activeTheme, themes])

  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setDisabled(true)
      setFileNameError(`cannot end in a slash`)
    } else if (fileName.charAt(0) !== '/') {
      setDisabled(true)
      setFileNameError(`must start with a slash`)
    } else if (allBindings[fileName]) {
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
      saveDraft(fileName, markdown)
      getAll()
    },
    [fileName, markdown]
  )

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
            theme: activeTheme,
          },
        },
      })
      getAll()
      setShowPublishModal(true)
    },
    [fileName, markdown, activeTheme]
  )

  return (
    <div className='w-full h-full grid gap-x-4 grid-cols-12 items-start'>
      <div className='col-span-4'>
        <code>
          <input
            className='w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder='/example/path'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            pattern='^\/.+(?!\/)'
            required
          />
          <p className='text-red-500 text-xs italic line-clamp-1'>
            {fileNameError}
          </p>
        </code>
      </div>
      <div className='col-span-3'>
        <select
          className='w-full rounded border-none focus:outline-none'
          value={activeTheme}
          onChange={(e) => setActiveTheme(e.target.value)}
        >
          {themes.map((theme, i) => (
            <option value={theme} key={i}>
              {theme}
            </option>
          ))}
        </select>
        <p className='text-xs italic line-clamp-1'>
          <code>%theme</code>
        </p>
      </div>
      <button
        className='col-span-2 flex-1 flex items-center justify-center text-white px-2 py-3 rounded w-full bg-darkgray disabled:opacity-50 font-sans'
        disabled={!fileName || disabled}
        onClick={handleSaveDraft}
      >
        <div className='w-5 mr-2'>
          <InboxArrowDownIcon />
        </div>
        Save Draft
      </button>
      <button
        className='col-span-2 flex-1 flex items-center justify-center text-white px-2 py-3 rounded w-full bg-darkgray disabled:opacity-50 font-sans'
        disabled={!fileName || disabled}
        onClick={handlePublish}
      >
        <div className='w-5 mr-2'>
          <RssIcon />
        </div>
        Publish
      </button>
      <div className='col-span-1 flex flex-row h-full items-center justify-center'>
        <button
          className='flex-1 flex items-start justify-center rounded w-full h-full text-blue-500 hover:text-blue-700'
          onClick={() => setIsFocusMode(!isFocusMode)}
        >
          <div className='text-left flex items-center'>
            <div className='py-3 w-5 mr-2'>
              {isFocusMode ? (
                <ArrowsPointingInIcon />
              ) : (
                <ArrowsPointingOutIcon />
              )}
            </div>
          </div>
        </button>
        <button
          className='flex-1 flex items-start justify-center rounded w-full h-full text-blue-500 hover:text-blue-700'
          onClick={() => setShowPreview(!showPreview)}
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
