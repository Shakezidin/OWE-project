import { format, subDays } from 'date-fns';
import { toCanvas } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import Banner from './components/Banner';
import PerformanceCards from './components/PerformanceCards';
import Sidebar from './components/Sidebar';
import Table from './components/Table';
import './index.css';
import { useAppSelector } from '../../../redux/hooks';

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};

const categories = [
  { name: 'Sale', key: 'sale' },
  { name: 'NTP', key: 'ntp' },
  { name: 'Install', key: 'install' },
  { name: 'Cancel', key: 'cancel' },
];

const role = localStorage.getItem('role');

const groupby = [{ label: 'Dealer', value: 'dealer' }];
if (role !== 'Admin') {
  groupby[0] = { label: 'Sale Rep', value: 'primary_sales_rep' };
}
interface Details {
  dealer_name?: string;
  dealer_logo?: string;
  owner_name?: string;
  total_teams?: number;
  total_strength?: number;
}

const today = new Date();

export type Tcategory = (typeof categories)[0];
const Index = () => {
  const [isOpen, setIsOpen] = useState(-1);
  const [active, setActive] = useState(categories[0].key);
  const [groupBy, setGroupBy] = useState(groupby[0].value);
  const [activeHead, setActiveHead] = useState('kw');
  const [details, setDetails] = useState([]);
  const [isGenerating, setGenerating] = useState(false);
  const [bannerDetails, setBannerDetails] = useState<Details>({});
  const [selectDealer, setSelectDealer] = useState<
    { label: string; value: string }[]
  >([]);
  const [dealer, setDealer] = useState<any>({});
  const topCards = useRef<HTMLDivElement | null>(null);
  const [socialUrl, setSocialUrl] = useState('');
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [selectedRangeDate, setSelectedRangeDate] =
    useState<DateRangeWithLabel>({
      label: 'This Week',
      start: subDays(today, 7),
      end: today,
    });

    const { isAuthenticated, role_name } = useAppSelector(
      (state) => state.auth
    );

  useEffect(() => {
    if(isAuthenticated){

      (async () => {
        try {
          const data = await postCaller('get_perfomance_leaderboard', {
            type: activeHead,
            sort_by: active,
            page_size: 3,
            page_number: 1,
            start_date: format(selectedRangeDate.start, 'dd-MM-yyyy'),
            end_date: format(selectedRangeDate.end, 'dd-MM-yyyy'),
            dealer: selectDealer.map((item) => item.value),
            group_by: groupBy,
          });
  
          if (data.status > 201) {
            toast.error(data.message);
            return;
          }
          setDetails(data.data?.ap_ded_list);
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();
    }
  }, [active, activeHead, selectedRangeDate, selectDealer, groupBy,isAuthenticated]);
  const shareImage = () => {
    if (topCards.current) {
      const element = topCards.current;
      const scrollHeight = element.scrollHeight;
      setGenerating(true);
      toCanvas(element, {
        height: scrollHeight,
      }).then((canvas) => {
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'Performance_Leaderboard.png';
        link.click();

        setGenerating(false);
      });
    }
  };

  return (
    <div className="px1">
      <div ref={topCards} style={{ background: '#f3f3f3' }}>
        <Banner
          selectDealer={selectDealer}
          setSelectDealer={setSelectDealer}
          bannerDetails={bannerDetails}
        />
        <PerformanceCards
          isGenerating={isGenerating}
          shareImage={shareImage}
          isOpen={isOpenShare}
          socialUrl={socialUrl}
          setIsOpen={setIsOpenShare}
          details={details}
          activeHead={activeHead}
        />
      </div>
      <Table
        setIsOpen={setIsOpen}
        selectedRangeDate={selectedRangeDate}
        setSelectedRangeDate={setSelectedRangeDate}
        activeHead={activeHead}
        setActiveHead={setActiveHead}
        active={active}
        setActive={setActive}
        setGroupBy={setGroupBy}
        groupBy={groupBy}
        setDealer={setDealer}
        selectDealer={selectDealer}
      />
      <Sidebar
        dealer={dealer}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        unit={activeHead}
      />
    </div>
  );
};

export default Index;
