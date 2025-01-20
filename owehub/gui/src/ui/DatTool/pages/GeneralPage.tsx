import React from 'react';
import SideContainer from '../components/SideContainer';

function GeneralPage() {
  return (
    <div style={{
        display:'flex',
        flexDirection:'row',
        gap:'18px'
    }}>
      <SideContainer />
      <div>General</div>
    </div>
  );
}

export default GeneralPage;
