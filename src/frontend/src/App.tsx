import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Layout from './components/Layout'
import Draft from './pages/Draft'
import Published from './pages/Published'
import { useStore } from './state/base'
import { useEffect } from 'react'
import Theme from './pages/Theme'

function App() {
  const getAll = useStore(state => state.getAll)

  useEffect(() => {
    getAll()
  }, [])

  return (
    <BrowserRouter basename="/apps/blog">
      <Layout>
        <Routes>
          <Route path="/" index       element={<Index/>}     />
          <Route path="/published/*"  element={<Published/>} />
          <Route path="/draft/*"      element={<Draft/>}     />
          <Route path="/theme/:theme?" element={<Theme/>}     />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
