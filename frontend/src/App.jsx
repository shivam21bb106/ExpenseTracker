
import AddExpense from './components/AddExpense'
import Dashboard from './components/Dashboard'
import ExpenseReport from './components/ExpenseReport'
import Home from './components/Home'
import Login from './components/Login'
import ManageExpense from './components/ManageExpense'
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
            <Route path='/add-expense' element={<AddExpense />} />
            <Route path='/manage-expense' element={<ManageExpense />} />
            <Route path='/expense-report' element={<ExpenseReport />} />

          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
