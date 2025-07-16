import React from 'react'
import './App.css'
import Result from './pages/Result'
import Home from './pages/Home'
import Navbar from './components/Navbar'
function App() {

  return (
    <>
      {/* <Result/> */}
      <div className='min-h-lvw'>
        <Navbar/>
        <div className='pt-10 p-20'>
          <Home/>
        </div>
      </div>
    </>
  )
}

export default App
