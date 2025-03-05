import { IoClose } from 'react-icons/io5';
import classes from './styles/index.module.css';

interface PendModalProps {
  closeModal: () => void;
  active: 'all' | 'ntp' | 'co' | 'qc';
  cuurentPageData: any[];
}

const PendModal: React.FC<PendModalProps> = ({
  closeModal,
  active,
  cuurentPageData,
}) => {
  return (
    <div className={classes.transparent_lib}>
      <div className={classes.customer_wrapper_list}>
        <div>
          <div className={classes.header}>
            <p>{active === 'co' ? 'CO Delayed By' : 'NTP Delayed By'}</p>
            <IoClose onClick={closeModal} size={20} />
          </div>
          <div className={classes.card_container}>
            {cuurentPageData.map((item, index) => (
              <div key={index} className={classes.card}>
                <p>
                  {active === 'ntp'
                    ? item.ntp.ntp_delay_by
                    : item.co.co_delay_by}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '40px' }}>
          <p>{active === 'co' ? 'CO Delay Note' : 'NTP Delay Note'}</p>
          <textarea
            className={classes.textArea}
            value={cuurentPageData
              .map((item) =>
                active === 'ntp'
                  ? item.ntp?.ntp_delay_notes
                  : item.co?.co_delay_notes
              )
              .filter(Boolean) // Remove any undefined values
              .join('\n')} // Join all values with new line
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PendModal;
