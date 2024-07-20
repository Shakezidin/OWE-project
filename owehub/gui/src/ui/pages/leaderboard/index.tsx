import React, { useEffect, useRef, useState } from 'react';
import Table from './components/Table';
import './index.css';
import Sidebar from './components/Sidebar';
import Banner from './components/Banner';
import PerformanceCards from './components/PerformanceCards';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { format, subDays } from 'date-fns';
import axios from 'axios';
import { toCanvas } from 'html-to-image';

export type DateRangeWithLabel = {
  label?: string;
  start: string;
  end: string;
};

const categories = [
  { name: 'Sale', key: 'sale' },
  { name: 'NTP', key: 'ntp' },
  { name: 'Install', key: 'install' },
  { name: 'Cancel', key: 'cancel' },
];
const today = new Date();

export type Tcategory = (typeof categories)[0];
const Index = () => {
  const [isOpen, setIsOpen] = useState(-1);
  const [active, setActive] = useState(categories[0].key);
  const [activeHead, setActiveHead] = useState('kw');
  const [details, setDetails] = useState([]);
  const [isGenerating, setGenerating] = useState(false);
  const [dealer, setDealer] = useState<{
    dealer?: string;
    rep_name?: string;
    start_date?: string;
    end_date?: string;
    leader_type: string;
    name: string;
    rank: number;
  }>(
    // @ts-ignore
    { leader_type: 'sale' }
  );
  const topCards = useRef<HTMLDivElement | null>(null);
  const [socialUrl, setSocialUrl] = useState('');
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [selectedRangeDate, setSelectedRangeDate] =
    useState<DateRangeWithLabel>({
      label: 'This Week',
      start: format(subDays(today, 7), 'dd-MM-yyyy'),
      end: format(today, 'dd-MM-yyyy'),
    });

  useEffect(() => {
    (async () => {
      try {
        const dateFilter = selectedRangeDate
          ? {
              start_date: selectedRangeDate.start,
              end_date: selectedRangeDate.end,
            }
          : {};
        const data = await postCaller('get_perfomance_leaderboard', {
          leader_type: active,
          sort_by: activeHead,
          page_size: 3,
          page_number: 1,
          ...dateFilter,
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
  }, [active, activeHead, selectedRangeDate]);
  const shareImage = () => {
    if (topCards.current) {
      setGenerating(true);
      const element = topCards.current;
      const scrollHeight = element.scrollHeight;
      toCanvas(element, {
        height: scrollHeight,
      }).then((canvas) => {
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          if (blob) {
            formData.append('file', blob);
            formData.append('upload_preset', 'xdfcmcf4');
            formData.append('cloud_name', 'duscqq0ii');
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/duscqq0ii/image/upload`,
              formData
            );
            setSocialUrl(response.data.secure_url);
            setIsOpenShare(true);
            setGenerating(false);
          }
        });
      });
    }
  };

  return (
    <div className="px1">
      <div ref={topCards}>
        <Banner />
        <PerformanceCards
          isGenerating={isGenerating}
          shareImage={shareImage}
          isOpen={isOpenShare}
          socialUrl={socialUrl}
          setIsOpen={setIsOpenShare}
          details={details}
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
        setDealer={setDealer}
      />
      <Sidebar dealer={dealer} setIsOpen={setIsOpen} isOpen={isOpen} />
    </div>
  );
};

export default Index;
