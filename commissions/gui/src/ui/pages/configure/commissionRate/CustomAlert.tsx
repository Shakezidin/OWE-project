import { ICONS } from "../../../icons/Icons";

interface CustomAlertProps {
    message: string;
    onClose: () => void;
  }
  const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
    return (
      <div className="custom-alert">
        <div className="alert-message">{message}</div>
        <div className=""  onClick={onClose} style={{cursor:"pointer"}}>
            <img src={ICONS.cross} alt="" />
          </div>
        {/* <button className="ok-button">OK</button> */}
      </div>
    );
  };
  export default CustomAlert