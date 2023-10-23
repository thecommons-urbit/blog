import { ReactNode } from 'react'
import { useStore } from '../state/base'
import SideBar from '../components/SideBar'

export default function Layout({ children }: { children: ReactNode }) {
  const isFocusMode = useStore((state) => state.isFocusMode)

  return (
    <main className='h-full bg-gray px-4 pt-4'>
      <div className='grid grid-rows-1 lg:grid-cols-12 md:grid-cols-1 gap-4 h-full'>
        {!isFocusMode ? (
          <div className='col-span-3 overflow-y-scroll'>
            <SideBar />
          </div>
        ) : null}
        <div className={`${!isFocusMode ? 'col-span-9' : 'col-span-12'}`}>
          {children}
        </div>
      </div>
    </main>
  )
}
