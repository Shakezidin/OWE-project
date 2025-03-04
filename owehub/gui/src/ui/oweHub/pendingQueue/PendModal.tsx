import { IoClose } from 'react-icons/io5';
import classes from './styles/index.module.css';

interface PendModalProps {
    closeModal: () => void;
  }

const PendModal: React.FC<PendModalProps> = ({ closeModal }) => {
  return (
    <div className={classes.transparent_lib}>
      <div className={classes.customer_wrapper_list}>
        <div>
          <div className={classes.header}>
          <p>NTP Delayed By</p>
          <IoClose onClick={closeModal} size={20} />
          </div>
          <div className={classes.card_container}>
            <div className={classes.card}>Pending Stipulations</div>
            <div className={classes.card}>Pending PPD</div>
          </div>
        </div>
        <div style={{marginTop: "40px"}}>
            <p>NTP Delay Note</p>
            <textarea className={classes.textArea} placeholder='Type here'></textarea>
        </div>
      </div>
    </div>
  );
};

export default PendModal;
