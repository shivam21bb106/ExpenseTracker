
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
