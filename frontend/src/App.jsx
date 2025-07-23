

import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'


function App() {

  return (
    <>
      <div className='min-h-lvw'>
        <Navbar/>
        <div className='pt-10 p-20'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default App
