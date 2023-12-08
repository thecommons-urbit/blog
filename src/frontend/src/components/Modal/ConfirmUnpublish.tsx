import React from 'react'
import { useStore } from '../../state/base'
import { useNavigate } from 'react-router-dom'
import { Modal, type ModalProps } from './Modal'

interface ConfirmUnpublishProps extends ModalProps {
  fileName: string
  // TODO don't use Function as a type
  //        see eslint error
  //        needs some refactoring, maybe define interfaces in /types
  onConfirm: Function
}

export default function ConfirmUnpublish ({
  fileName,
  onConfirm,
  setShowModal
}: ConfirmUnpublishProps): JSX.Element {
  const { setMarkdown } = useStore()
  const navigate = useNavigate()

  return (
    <Modal>
      <h4 className='text-md font-bold pb-4'>
        Are you sure you want to delete {fileName}?
      </h4>
      <div className='flex text-xs gap-x-2'>
        <button
          className='flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full'
          onClick={() => { setShowModal(false) }}
        >
          Cancel
        </button>
        <button
          className='flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full'
          onClick={() => {
            onConfirm()
            setShowModal(false)
            setMarkdown('')
            navigate('')
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
