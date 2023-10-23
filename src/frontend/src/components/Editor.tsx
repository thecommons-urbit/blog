import MDEditor from '@uiw/react-md-editor'
import { marked } from 'marked'
import { useState } from 'react'
import BottomBar from './BottomBar'
import { useStore } from '../state/base'

export default function Editor() {
  const markdown = useStore((state) => state.markdown)
  const setMarkdown = useStore((state) => state.setMarkdown)
  const previewCss = useStore((state) => state.previewCss)
  const [fileName, setFileName] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className='grid grid-cols-2 h-full grid-rows-12'>
      <MDEditor
        value={markdown}
        onChange={(e) => {
          setMarkdown(e!)
        }}
        data-color-mode='light'
        preview='edit'
        hideToolbar
        className={`w-full h-full row-span-10 ${
          showPreview ? 'col-span-1' : 'col-span-2'
        } overflow-y-scroll drop-shadow-2xl rounded-2xl`}
        height={'' as any}
      />
      {showPreview && (
        <iframe
          title='preview'
          srcDoc={`${marked.parse(markdown)}<style>${previewCss}</style>`}
          className='col-span-1 w-full h-full row-span-10 rounded-2xl'
        />
      )}
      <div className='col-span-2 pt-2 z-10 relative'>
        <BottomBar
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          fileName={fileName}
          setFileName={setFileName}
          setDisabled={setDisabled}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
