import React from 'react'
import SideContainer from '../components/SideContainer'

function StructuralPage() {
  return (
    <div style={{
      display:'flex',
      flexDirection:'row',
      gap:'18px'
  }}>
    <SideContainer />
    <div>Structural Page</div>
  </div>
  )
}

export default StructuralPage