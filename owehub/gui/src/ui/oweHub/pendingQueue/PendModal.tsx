import { IoClose } from 'react-icons/io5';
import classes from './styles/index.module.css';

interface PendModalProps {
  closeModal: () => void;
  active: 'all' | 'ntp' | 'co' | 'qc';
  currentRowData: any;
}

const PendModal: React.FC<PendModalProps> = ({
  closeModal,
  active,
  currentRowData,
}) => {
  const cardsData = Array.isArray(currentRowData)
    ? currentRowData
    : [currentRowData];
  return (
    <div className={classes.transparent_lib}>
      <div className={classes.customer_wrapper_list}>
        <div>
          <div className={classes.header}>
            <p>{active === 'co' ? 'CO Delayed By' : 'NTP Delayed By'}</p>
            <IoClose onClick={closeModal} size={20} />
          </div>
          <div className={classes.card_container}>
            {cardsData.map((row: any, index: any) => (
              <div key={index} className={classes.card}>
                <p>
                  {active === 'ntp'
                    ? row.ntp?.ntp_delayed_by?.toString().trim() || '-'
                    : row.co?.co_delayed_by?.toString().trim() || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '40px' }}>
          <p>{active === 'co' ? 'CO Delay Note' : 'NTP Delay Note'}</p>
          <textarea
            className={classes.textArea}
            value={
              active === 'ntp'
                ? currentRowData.ntp?.ntp_delay_notes || '-'
                : currentRowData.co?.co_notes || '-'
            }
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PendModal;
