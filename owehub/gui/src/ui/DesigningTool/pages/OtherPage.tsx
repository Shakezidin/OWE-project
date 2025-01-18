import React from 'react'
import SideContainer from '../components/SideContainer'

function OtherPage() {
  return (
    <div style={{
      display:'flex',
      flexDirection:'row',
      gap:'18px'
  }}>
    <SideContainer />
    <div>OthersPage</div>
  </div>
  )
}

export default OtherPage