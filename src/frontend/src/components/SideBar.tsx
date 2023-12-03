import React, { useState, useCallback, useEffect } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useStore } from '../state/base'
import { ConfirmDeleteDraft, ConfirmUnpublish } from './Modal'
import { api } from '../state/api'

interface SidebarEntry {
  path: string
  children: string[]
}

export default function SideBar (): JSX.Element {
  const drafts = useStore((state) => state.drafts)
  const pages = useStore((state) => state.pages)
  const themes = useStore((state) => state.themes)

  const { getAll, saveDraft, saveTheme } = useStore()
  const navigate = useNavigate()

  const [fileName, setFileName] = useState('')
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false)
  const [showUnpublishModal, setShowUnpublishModal] = useState(false)
  const [nestedDrafts, setNestedDrafts] = useState<SidebarEntry[]>([])
  const [nestedPages, setNestedPages] = useState<SidebarEntry[]>([])

  // handle foldering for posts and drafts
  useEffect(() => {
    setNestedDrafts(nestPaths(drafts, '/drafts'))
    setNestedPages(nestPaths(pages, '/published'))
  }, [pages, drafts])

  // main foldering logic
  const nestPaths = (paths: string[], linkbase: string): SidebarEntry[] => {
    return paths
      .map((d) => ({
        path: parentPath(d),
        children: paths.filter((_d) => parentPath(_d) === parentPath(d)),
        linkbase
      }))
      // .filter((d) => !!d)
      .reduce((acc: SidebarEntry[], cur) => {
        if (acc.length === 0) return [...acc, cur]
        if ((acc.find((d) => d.path === cur.path)) === undefined) return [...acc, cur]
        return acc
      }, [])
      .map((path) =>
        path.children.length === 1
          ? { ...path, path: path.children[0] }
          : path
      )
  }

  const parentPath = (path: string): string => {
    return path.split('/').slice(0, 2).join('/')
  }

  // TODO move this
  const match = useMatch('*')

  // add a unique number to the end of a duplicate fileName
  const findNextNewFileName = (
    newFileName: string,
    files: string[],
    i?: number
  ): string => {
    if (files.includes(i !== undefined ? `${newFileName}-${i}` : newFileName)) {
      return findNextNewFileName(newFileName, files, i !== undefined ? i + 1 : 1)
    }
    return i !== undefined ? `${newFileName}-${i}` : `${newFileName}`
  }

  // save a new draft
  const handleNewDraft = useCallback(async () => {
    // create a unique name for the draft
    const newDraftName = findNextNewFileName('/new-draft', drafts)

    // save new draft
    saveDraft(newDraftName, '')
    getAll()
    // go to new draft
    navigate(`/draft${newDraftName}`)
  }, [drafts])

  // set a new theme
  const handleNewTheme = useCallback(async () => {
    // create a unique name for the theme
    const newThemeName = findNextNewFileName('new-theme', themes)

    // save new theme
    // TODO just use +default-theme from /lib/blog.hoon
    saveTheme(newThemeName, 'html {\n\tcolor: hotpink;\n}')
    getAll()
    // go to new theme
    navigate(`/theme/${newThemeName}`)
  }, [drafts])

  // delete draft
  // TODO could remove useCallback? benefit isn't obvious
  const handleDeleteDraft = useCallback(async (toDelete: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'delete-draft': {
          path: toDelete
        }
      }
    })
    setShowDeleteDraftModal(false)
    getAll()
  }, [])

  // unpublish post
  // TODO could remove useCallback? benefit isn't obvious
  const handleUnpublish = useCallback(async (toUnpublish: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: { unpublish: { path: toUnpublish } }
    })
    setShowUnpublishModal(false)
    getAll()
  }, [])

  // decide which modal to show on deleting a post
  const showModal = (linkbase: string): undefined => {
    switch (linkbase) {
      case '/published':
      { setShowUnpublishModal(true); return }
      case '/draft':
        setShowDeleteDraftModal(true)
        break
      default:
    }
  }

  // does sidebar entry have children
  const hasChildren = (entry: SidebarEntry): boolean => entry.children.length > 1

  // sort sidebar entries based on children
  const sortSidebar = (a: SidebarEntry, b: SidebarEntry): number => {
    // a before b
    if (hasChildren(a) && !hasChildren(b)) return -1
    // b before a
    if (!hasChildren(a) && hasChildren(b)) return 1
    // tiebreaker: sort alphabetically
    if (a.path < b.path) return -1
    // TODO return 1 if a.path > b.path
    // equal
    return 0
  }

  // sidebar entry with base: /drafts, /published, etc.
  interface SidebarItemProps {
    linkbase: string
    item: SidebarEntry
  }

  // sidebar item
  const SidebarItem = ({ linkbase, item }: SidebarItemProps): JSX.Element => {
    // e.g. /drafts/foo/bar
    const linkto = `${linkbase}${item.path}`
    // component state
    const [open, setOpen] = useState(false)
    const [hovered, setHovered] = useState(false)

    return (
      // TODO change <> framents to <React.Fragment>s
      <>
        <li
          className={`flex w-full cursor-pointer pointer-events-auto justify-between mb-1 text-xs hover:text-blue-600 py-1 ${
            match?.pathname === linkto ? 'bg-gray-100' : ''
          } ${
            hasChildren(item)
              ? 'flex-col justify-center'
              : 'flex-row items-center'
          }`}
          onClick={() => {
            if (hasChildren(item)) return
            navigate(linkto)
          }}
          onMouseEnter={() => { setHovered(true) }}
          onMouseLeave={() => { setHovered(false) }}
        >
          {/* sidebar entry with no children */}
          {!hasChildren(item) && (
            <div className='flex flex-row w-full justify-between'>
              {/* sidebar entry item path */}
              <div className='text-left flex-1 my-auto truncate w-full'>
                <code>{item.path}</code>
              </div>
              {/* sidebar entry icons */}
              {/* TODO move this */}
              {linkbase !== '/theme/' &&
                hovered &&
                (linkbase === '/published'
                  ? (
                  <>
                    <div
                      className='w-4 cursor-pointer rounded-sm hover:text-red-500'
                      onClick={() => {
                        window.open(`/blog${item.path}`, '_blank')
                      }}
                    >
                      <GlobeAltIcon />
                    </div>
                    <div
                      className='w-4 cursor-pointer rounded-sm hover:text-blue-500'
                      onClick={() => {
                        showModal(linkbase)
                        setFileName(item.path)
                      }}
                    >
                      <TrashIcon />
                    </div>
                  </>
                    )
                  : (
                  <div
                    className='w-4 cursor-pointer rounded-sm hover:text-red-500'
                    onClick={() => {
                      showModal(linkbase)
                      setFileName(item.path)
                    }}
                  >
                    <TrashIcon />
                  </div>
                    ))}
            </div>
          )}
          {/* sidebar entry with children */}
          {hasChildren(item) && (
            <div
              className='flex flex-row w-full justify-between pointer-events-auto'
              onClick={() => {
                setOpen(!open)
              }}
            >
              <div className='text-left font-bold flex-1 my-auto truncate'>
                <code>{item.path}</code>
              </div>
              <div className='w-4'>
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
            </div>
          )}
        </li>
        {/* render sidebar item's children if sidebar item is open */}
        {open &&
          item.children.map((p) => (
            <div className='flex flex-row w-full' key={p}>
              <code className='pl-1'>-</code>&nbsp;
              <SidebarItem
                item={{ path: p, children: [] }}
                linkbase={linkbase}
                key={p}
              />
            </div>
          ))}
      </>
    )
  }

  // sidebar
  return (
    <div className='h-full p-4 pr-0 pt-0'>
      {/* published section */}
      <ul className='pb-6'>
        <label className='block font-semibold mb-3 font-sans'>
          Published
        </label>
        {/* published items */}
        {nestedPages.sort(sortSidebar).map((pub: SidebarEntry, i) => (
          <SidebarItem linkbase={'/published'} item={pub} key={i}></SidebarItem>
        ))}
      </ul>
      {/* drafts section */}
      <ul className='pb-6'>
        <label className='block font-semibold mb-3 font-sans'>
          Drafts
        </label>
        {/* draft items */}
        {nestedDrafts.sort(sortSidebar).map((draft: SidebarEntry, i) => (
          <SidebarItem linkbase={'/draft'} item={draft} key={i}></SidebarItem>
        ))}
        <li>
          {/* new draft button */}
          <div
            className='flex flex-row items-center text-xs hover:text-blue-600 cursor-pointer'
            onClick={handleNewDraft}
          >
            <div className='w-5 mr-1'>
              <PlusCircleIcon />
            </div>
            <div>
              <code>new draft</code>
            </div>
          </div>
        </li>
      </ul>
      {/* themes section */}
      <ul className='pb-6'>
        <label className='block font-semibold mb-3 font-sans'>
          Themes
        </label>
        {/* saved themes */}
        {themes.sort().map((theme: string, i) => (
          <SidebarItem
            linkbase={'/theme/'}
            item={{ path: theme, children: [] }}
            key={i}
          ></SidebarItem>
        ))}
        <li>
          {/* new theme button */}
          <div
            className='flex flex-row items-center text-xs hover:text-blue-600 cursor-pointer'
            onClick={handleNewTheme}
          >
            <div className='w-5 mr-1'>
              <PlusCircleIcon />
            </div>
            <div>
              <code>new theme</code>
            </div>
          </div>
        </li>
      </ul>
      {/* delete draft modal */}
      {showDeleteDraftModal && (
        <ConfirmDeleteDraft
          fileName={fileName}
          setShowModal={setShowDeleteDraftModal}
          onConfirm={async () => { await handleDeleteDraft(fileName) }}
        />
      )}
      {/* unpublish draft modal */}
      {showUnpublishModal && (
        <ConfirmUnpublish
          fileName={fileName}
          setShowModal={setShowUnpublishModal}
          onConfirm={async () => { await handleUnpublish(fileName) }}
        />
      )}
    </div>
  )
}
