import { useState, useCallback, useEffect } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import {
  TrashIcon,
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
  RssIcon,
} from '@heroicons/react/24/outline'
import { useStore } from '../state/base'
import Logo from './Logo'
import { ConfirmDeleteDraft, ConfirmUnpublish } from './Modal'
import { api } from '../state/api'

type SidebarEntry = {
  path: string
  children: string[]
}

export default function SideBar() {
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

  useEffect(() => {
    setNestedDrafts(nestPaths(drafts, '/drafts'))
    setNestedPages(nestPaths(pages, '/published'))
  }, [pages, drafts])

  const nestPaths = (paths: string[], linkbase: string) => {
    return paths
      .map((d) => ({
        path: parentPath(d),
        children: paths.filter((_d) => parentPath(_d) === parentPath(d)),
        linkbase,
      }))
      .filter((d) => !!d)
      .reduce((acc: SidebarEntry[], cur) => {
        if (acc.length === 0) return [...acc, cur]
        if (!acc.find((d) => d.path === cur.path)) return [...acc, cur]
        return acc
      }, [])
      .map((path) =>
        path && path.children && path.children.length === 1
          ? { ...path, path: path.children[0] }
          : path
      )
  }

  const parentPath = (path: string) => {
    return path.split('/').slice(0, 2).join('/')
  }

  const match = useMatch('*')

  const findNextNewFileName = (
    newFileName: string,
    files: Array<string>,
    i?: number
  ): string => {
    if (files.includes(i ? `${newFileName}-${i}` : newFileName)) {
      return findNextNewFileName(newFileName, files, i ? i + 1 : 1)
    }
    return i ? `${newFileName}-${i}` : `${newFileName}`
  }

  const handleNewDraft = useCallback(async () => {
    // create a new name for the draft
    const newDraftName = findNextNewFileName('/new-draft', drafts)
    saveDraft(newDraftName, '')
    getAll()
    navigate(`/draft${newDraftName}`)
  }, [drafts])

  const handleNewTheme = useCallback(async () => {
    // create a new name for the draft
    const newThemeName = findNextNewFileName('new-theme', themes)
    saveTheme(newThemeName, 'html {\n\tcolor: hotpink;\n}')
    getAll()
    navigate(`/theme/${newThemeName}`)
  }, [drafts])

  const handleDeleteDraft = useCallback(async (toDelete: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'delete-draft': {
          path: toDelete,
        },
      },
    })
    setShowDeleteDraftModal(false)
    getAll()
  }, [])

  const handleUnpublish = useCallback(async (toUnpublish: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: { unpublish: { path: toUnpublish } },
    })
    setShowUnpublishModal(false)
    getAll()
  }, [])

  const showModal = (linkbase: string) => {
    switch (linkbase) {
      case '/published':
        return setShowUnpublishModal(true)
      case '/draft':
        return setShowDeleteDraftModal(true)
      default:
        return
    }
  }

  const hasChildren = (entry: SidebarEntry) => entry.children.length > 1

  const sortSidebar = (a: SidebarEntry, b: SidebarEntry) => {
    if (hasChildren(a) && !hasChildren(b)) return -1
    if (!hasChildren(a) && hasChildren(b)) return 1
    if (a.path < b.path) return -1
    return 0
  }

  type SidebarItemProps = {
    linkbase: string
    item: SidebarEntry
  }

  const SidebarItem = ({ linkbase, item }: SidebarItemProps) => {
    let linkto = `${linkbase}${item.path}`
    const [open, setOpen] = useState(false)
    const [hovered, setHovered] = useState(false)
    return (
      <>
        <li
          className={`flex w-full cursor-pointer pointer-events-auto justify-between mb-1 text-xs hover:text-blue-600 py-1 ${
            match?.pathname === linkto ? 'bg-gray-100' : ''
          } ${
            hasChildren(item)
              ? 'flex-col justify-center'
              : 'flex-row  items-center'
          }`}
          onClick={() => {
            if (hasChildren(item)) return
            navigate(linkto)
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!hasChildren(item) && (
            <div className='flex flex-row w-full justify-between'>
              <div className='text-left flex-1 my-auto truncate w-full'>
                <code>{item.path}</code>
              </div>
              {linkbase !== '/theme/' &&
                hovered &&
                (linkbase === '/published' ? (
                  <>
                    <div
                      className='w-4 cursor-pointer rounded-sm hover:text-red-500'
                      onClick={() => {
                        window.open(item.path, '_blank')
                      }}
                    >
                      <RssIcon />
                    </div>
                    <div
                      className='w-4 cursor-pointer rounded-sm hover:text-blue-500'
                      onClick={() => {
                        showModal(linkbase)
                        setFileName(item.path)
                      }}
                    >
                      <ArchiveBoxXMarkIcon />
                    </div>
                  </>
                ) : (
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

  return (
    <div className='h-full p-4 pr-0'>
      <div className='flex flex-row items-center justify-between w-full pb-4'>
        <Link to='/'>
          <Logo />
        </Link>
      </div>
      <ul className='pb-6'>
        <label className='block font-bold mb-3 font-sans font-extrabold'>
          Published
        </label>
        {nestedPages.sort(sortSidebar).map((pub: SidebarEntry, i) => (
          <SidebarItem linkbase={`/published`} item={pub} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='pb-6'>
        <label className='block font-bold mb-3 font-sans font-extrabold'>
          Drafts
        </label>
        {nestedDrafts.sort(sortSidebar).map((draft: SidebarEntry, i) => (
          <SidebarItem linkbase={`/draft`} item={draft} key={i}></SidebarItem>
        ))}
        <li>
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
      <ul className='pb-6'>
        <label className='block font-bold mb-3 font-sans font-extrabold'>
          Themes
        </label>
        {themes.sort().map((theme: string, i) => (
          <SidebarItem
            linkbase={`/theme/`}
            item={{ path: theme, children: [] }}
            key={i}
          ></SidebarItem>
        ))}
        <li>
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
      {showDeleteDraftModal && (
        <ConfirmDeleteDraft
          fileName={fileName}
          setShowModal={setShowDeleteDraftModal}
          onConfirm={() => handleDeleteDraft(fileName)}
        />
      )}
      {showUnpublishModal && (
        <ConfirmUnpublish
          fileName={fileName}
          setShowModal={setShowUnpublishModal}
          onConfirm={() => handleUnpublish(fileName)}
        />
      )}
    </div>
  )
}
