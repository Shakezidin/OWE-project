import React, { useState } from 'react';
import Table from './components/Table';
import './index.css';
import Sidebar from './components/Sidebar';
import Banner from './components/Banner';
const Index = () => {
  const [isOpen, setIsOpen] = useState(-1);

  const [dealer, setDealer] = useState<{
    dealer?: string;
    rep_name?: string;
    start_date?: string;
    end_date?: string;
    leader_type: string;
    name: string;
    rank:number
  }>(
    // @ts-ignore
    { leader_type: 'sale' }
  );
  return (
    <div className="px1">
      <Banner />
      <Table setIsOpen={setIsOpen} setDealer={setDealer} />
      <Sidebar dealer={dealer} setIsOpen={setIsOpen} isOpen={isOpen} />
    </div>
  );
};

export default Index;
