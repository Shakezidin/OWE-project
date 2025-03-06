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


  // // Check if currentRowData is valid
  // if (!currentRowData) return null;
  console.log(currentRowData, 'skgf');
  return (
    <div className={classes.transparent_lib}>
      <div className={classes.customer_wrapper_list}>
        <div>
          <div className={classes.header}>
            <p>{active === 'co' ? 'CO Delayed By' : 'NTP Delayed By'}</p>
            <IoClose onClick={closeModal} size={20} />
          </div>
          <div className={classes.card_container}>
            <div className={classes.card}>
              <p>
                {active === 'ntp'
                  ? currentRowData.ntp?.ntp_delayed_by || 'N/A'
                  : currentRowData.co?.co_delayed_by || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '40px' }}>
          <p>{active === 'co' ? 'CO Delay Note' : 'NTP Delay Note'}</p>
          <textarea
            className={classes.textArea}
            value={
              active === 'ntp'
                ? currentRowData.ntp?.ntp_delay_notes || ''
                : currentRowData.co?.co_notes || ''
            }
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PendModal;
