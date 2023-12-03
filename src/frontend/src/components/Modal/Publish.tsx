import React, { useState } from 'react'
import { Modal, type ModalProps } from './Modal'

interface PublishModalProps extends ModalProps {
  fileName: string
}

export default function Share ({ setShowModal, fileName }: PublishModalProps): JSX.Element {
  const [value, setValue] = useState(
    `AAAAH I'M GONNA %blog : ${window.location.origin}/blog${fileName}`
  )
  return (
    <Modal>
      <h4 className='text-md font-bold mb-4'>
        Share your post on %rumors?
      </h4>
      <form
        method='post'
        action={`${window.location.origin}/rumors`}
        className='w-full font-sans'
      >
        <input
          type='text'
          name='rumor'
          required
          className='w-full mb-4 font-sans'
          value={value}
          onChange={(e) => { setValue(e.target.value) }}
        />
        <div className='flex text-xs gap-x-2'>
          <button
            className='flex-1 bg-blue-500 hover:bg-blue-700 font-sans text-white p-2 rounded w-full'
            type='submit'
          >
            Share
          </button>
          <button
            className='flex-1 bg-red-500 hover:bg-red-700 font-sans text-white p-2 rounded w-full'
            onClick={(e) => {
              e.preventDefault()
              setShowModal(false)
            }}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  )
}
