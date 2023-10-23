import { ReactNode } from 'react'

export interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export function Modal({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='fixed inset-0 z-10 overflow-y-auto backdrop-blur-md'>
        <div className='flex items-center min-h-screen px-4 py-8'>
          <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg text-center'>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
