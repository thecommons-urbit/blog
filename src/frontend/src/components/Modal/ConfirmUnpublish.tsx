import { Modal, ModalProps } from './Modal'

interface ConfirmUnpublishProps extends ModalProps {
  fileName: string
  onConfirm: Function
}

export default function ConfirmUnpublish({
  fileName,
  onConfirm,
  setShowModal,
}: ConfirmUnpublishProps) {
  return (
    <Modal>
      <h4 className='text-md font-bold pb-4'>
        Are you sure you want to unpublish {fileName}
      </h4>
      <div className='flex text-xs gap-x-2'>
        <button
          className='flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full'
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className='flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full'
          onClick={() => {
            onConfirm()
            setShowModal(false)
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
