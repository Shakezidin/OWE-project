import { toCanvas } from 'html-to-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import Banner from './components/Banner';
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
} from 'date-fns';
import PerformanceCards from './components/PerformanceCards';
import Sidebar from './components/Sidebar';
import Table from './components/Table';
import './index.css';
import { useAppSelector } from '../../redux/hooks';
import jsPDF from 'jspdf';
import { TYPE_OF_USER } from '../../resources/static_data/Constant';
import { PDFDocument } from 'pdf-lib';
import 'jspdf-autotable';
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

const groupby = [{ label: 'Sale Rep', value: 'primary_sales_rep' }];

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
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // assuming week starts on Monday, change to 0 if it starts on Sunday
  const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });
  const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });
  const [isOpen, setIsOpen] = useState(-1);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(categories[0].key);
  const [groupBy, setGroupBy] = useState(groupby[0].value);
  const [activeHead, setActiveHead] = useState('count');
  const [details, setDetails] = useState([]);
  const [isGenerating, setGenerating] = useState(false);
  const [bannerDetails, setBannerDetails] = useState<Details>({});
  const [selectDealer, setSelectDealer] = useState<
    { label: string; value: string }[]
  >([]);
  const [dealer, setDealer] = useState<any>({});
  const topCards = useRef<HTMLDivElement | null>(null);
  const leaderboard = useRef<HTMLDivElement | null>(null);
  const [socialUrl, setSocialUrl] = useState('');
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [selectedRangeDate, setSelectedRangeDate] =
    useState<DateRangeWithLabel>({
      label: 'Last Week',
      start: startOfLastWeek,
      end: endOfLastWeek,
    });

  const [isAuthenticated] = useState(
    localStorage.getItem('is_password_change_required') === 'false'
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== TYPE_OF_USER.FINANCE_ADMIN && role !== TYPE_OF_USER.ADMIN) {
      setIsFetched(true);
    }
  }, []);

  const showPartner = useMemo(() => {
    if (groupBy === 'region' || groupBy === 'state') {
      return false;
    }
    if (
      (role === TYPE_OF_USER.ADMIN ||
        role === TYPE_OF_USER.DEALER_OWNER ||
        role === TYPE_OF_USER.FINANCE_ADMIN) &&
      groupBy !== 'dealer'
    ) {
      return true;
    }
    if (
      role !== TYPE_OF_USER.ADMIN &&
      role !== TYPE_OF_USER.DEALER_OWNER &&
      role !== TYPE_OF_USER.FINANCE_ADMIN
    ) {
      return true;
    } else {
      return false;
    }
  }, [groupBy, role]);

  useEffect(() => {
    if (isAuthenticated && isFetched) {
      (async () => {
        setIsLoading(true);
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
          setIsLoading(false);
          setCount(data?.dbRecCount || 0);
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();
    }
  }, [
    active,
    activeHead,
    selectedRangeDate,
    selectDealer,
    groupBy,
    isAuthenticated,
    isFetched,
  ]);
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

  const resetDealer = (value: string) => {
    if (value !== 'dealer' && isShowDropdown && selectDealer.length) {
      setIsShowDropdown(false);
      setSelectDealer([]);
    }
    if (value === 'dealer') {
      setIsShowDropdown(true);
    }
  };

  const exportPdf = async (callback: () => void) => {
    if (leaderboard.current) {
      setIsExporting(true);
      const element = leaderboard.current;
      const scrollHeight = element.scrollHeight;

      const filter = (node: HTMLElement) => {
        const exclusionClasses = ['page-heading-container', 'exportt'];
        return !exclusionClasses.some((classname) =>
          node.classList?.contains(classname)
        );
      };

      const selector = document.querySelector(
        '.leaderboard-table-container'
      ) as HTMLElement;
      if (selector) {
        selector.style.overflow = 'hidden';
        const canvas = await toCanvas(element, {
          height: scrollHeight,
          filter,
          cacheBust: true,
          canvasWidth: element.clientWidth,
        });

        const imageData = canvas.toDataURL('image/png');
        const screenshotPdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height],
        });
        screenshotPdf.addImage(
          imageData,
          'PNG',
          0,
          0,
          canvas.width,
          canvas.height
        );
        const tablePdf = await generateTablePdf(canvas.width, canvas.height);
        const mergedPdfBytes = await mergePdfs([screenshotPdf, tablePdf]);
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        a.click();
        URL.revokeObjectURL(url);
        selector.style.overflow = 'auto';
        setIsExporting(false);
        callback();
      }
    }
  };

  const generateTablePdf = async (width: number, height: number) => {
    const getAllLeaders = await postCaller('get_perfomance_leaderboard', {
      type: activeHead,
      dealer: selectDealer.map((item) => item.value),
      page_size: count,
      page_number: 1,
      start_date: format(selectedRangeDate.start, 'dd-MM-yyyy'),
      end_date: format(selectedRangeDate.end, 'dd-MM-yyyy'),
      sort_by: active,
      group_by: groupBy,
    });
    const data = await getAllLeaders.data;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [width, height],
    });
    const columns = [
      { header: 'Rank', dataKey: 'rank' },
      { header: 'Name', dataKey: 'rep_name' },
      { header: 'Sale', dataKey: 'sale' },
      { header: 'NTP', dataKey: 'ntp' },
      { header: 'Install', dataKey: 'install' },
      { header: 'Cancel', dataKey: 'cancel' },
    ];

    if (showPartner) {
      columns.splice(2, 0, { header: 'Partner', dataKey: 'dealer' });
    }

    // @ts-ignore
    doc.autoTable({
      columns: columns,
      body: data.ap_ded_list.map((item: any) => ({
        rank: item.rank,
        rep_name: item.rep_name,
        dealer: item.dealer,
        sale: item.sale,
        ntp: item.ntp,
        install: item.install,
        cancel: item.cancel,
      })),
      margin: { top: 20 },
      tableWidth: 'auto',
    });

    return doc; // Returns PDF as ArrayBuffer
  };

  const mergePdfs = async (pdfs: jsPDF[]) => {
    const mergedPdf = await PDFDocument.create();
    for (const pdf of pdfs) {
      const pdfBytes = pdf.output('arraybuffer');
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  };

  return (
    <div className="px1" ref={leaderboard}>
      <div ref={topCards} style={{ background: '#f3f3f3' }}>
        <Banner
          selectDealer={selectDealer}
          setSelectDealer={setSelectDealer}
          groupBy={groupBy}
          isShowDropdown={isShowDropdown}
          setIsFetched={setIsFetched}
          bannerDetails={bannerDetails}
        />
        <PerformanceCards
          isGenerating={isGenerating}
          shareImage={shareImage}
          isOpen={isOpenShare}
          socialUrl={socialUrl}
          isLoading={isLoading}
          setIsOpen={setIsOpenShare}
          details={details}
          activeHead={activeHead}
        />
      </div>
      <Table
        isFetched={isFetched}
        count={count}
        exportPdf={exportPdf}
        setIsOpen={setIsOpen}
        selectedRangeDate={selectedRangeDate}
        setSelectedRangeDate={setSelectedRangeDate}
        activeHead={activeHead}
        setActiveHead={setActiveHead}
        active={active}
        isExporting={isExporting}
        resetDealer={resetDealer}
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
