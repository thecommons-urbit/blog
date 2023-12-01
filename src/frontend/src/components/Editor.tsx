import MDEditor from '@uiw/react-md-editor'
import { marked } from 'marked'
import React, { useState } from 'react'
import BottomBar from './BottomBar'
import { useStore } from '../state/base'

export default function Editor (): JSX.Element {
  const markdown = useStore((state) => state.markdown)
  const setMarkdown = useStore((state) => state.setMarkdown)
  const previewCss = useStore((state) => state.previewCss)

  const [fileName, setFileName] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className='grid grid-cols-2 h-full'>
      {/* post editor */}
      <MDEditor
        value={markdown}
        onChange={(e) => {
          if (e !== undefined) {
            setMarkdown(e)
          }
        }}
        data-color-mode='light'
        preview='edit'
        hideToolbar
        className={`w-full h-full ${
          showPreview ? 'col-span-1' : 'col-span-2'
        } overflow-y-scroll drop-shadow-2xl rounded-2xl mt-auto mb-auto`}
        height={'85vh' as any}
      />
      {/* post preview */}
      {showPreview && (
        <iframe
          title='preview'
          // TODO improve preview html structure; would fix img width issues etc.
          srcDoc={`${marked.parse(markdown)}<style>${previewCss}</style>`}
          className='col-span-1 w-full h-full rounded-2xl'
        />
      )}
      {/* bottom bar */}
      <div className='col-span-2 mt-4 mb-4 z-10 relative'>
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
