import React, { useState } from 'react'
import Table from './components/Table'
import "./index.css"
import Sidebar from './components/Sidebar'
import Banner from './components/Banner'
const Index = () => {
  const [isOpen,setIsOpen] = useState(false)
  return (
    <div className='px1'>
      <Banner />
      <Table setIsOpen={setIsOpen} />
      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen}/>
    </div>
  )
}

export default Index