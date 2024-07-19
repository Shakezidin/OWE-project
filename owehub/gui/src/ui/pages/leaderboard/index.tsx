import React, { useEffect, useState } from 'react';
import Table from './components/Table';
import './index.css';
import Sidebar from './components/Sidebar';
import Banner from './components/Banner';
import PerformanceCards from './components/PerformanceCards';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { format, subDays } from 'date-fns';
const categories = [
  { name: 'Sale', key: 'sale' },
  { name: 'NTP', key: 'ntp' },
  { name: 'Install', key: 'install' },
  { name: 'Cancel', key: 'cancel' },
];
const today = new Date();
const rangeOptData = [
  {
    label: 'Today',
    value: `${format(today, 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Weekly',
    value: `${format(subDays(today, 7), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Monthly',
    value: `${format(subDays(today, 30), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Yearly',
    value: `${format(subDays(today, 365), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
];
export type Tcategory = typeof categories[0]
const Index = () => {
  const [isOpen, setIsOpen] = useState(-1);
  const [active, setActive] = useState(categories[0].key);
  const [activeHead, setActiveHead] = useState('kw');
  const [details, setDetails] = useState([])
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

  const [selectedRangeDate, setSelectedRangeDate] = useState({
    label: 'Weekly',
    value: `${format(subDays(today, 7), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  });

  useEffect(() => {
    (async () => {
      try {
        
        const data = await postCaller('get_perfomance_leaderboard', {
          leader_type: active,
          start_date: selectedRangeDate.value?.split(',')[0],
          end_date: selectedRangeDate.value?.split(',')[1],
          sort_by: activeHead,
          page_size: 3,
          page_number: 1,
        });
        
        if (data.status > 201) {
          // setIsLoading(false);
        
          toast.error(data.message);
          return;
        }
        // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
        // setTotalCount(data?.dbRecCount);
        setDetails(data.data?.
          ap_ded_list
          )
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [
  active,
  activeHead,
  selectedRangeDate
  ]);

 
  return (
    <div className="px1">
      <Banner />
      <PerformanceCards details={details}/>
      <Table setIsOpen={setIsOpen} selectedRangeDate={selectedRangeDate} setSelectedRangeDate={setSelectedRangeDate} activeHead={activeHead} setActiveHead={setActiveHead} active={active}setActive={setActive} setDealer={setDealer} />
      <Sidebar dealer={dealer}  setIsOpen={setIsOpen} isOpen={isOpen} />
    </div>
  );
};

export default Index;
