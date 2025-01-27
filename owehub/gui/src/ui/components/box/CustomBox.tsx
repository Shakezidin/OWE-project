import './CustomBox.css';

interface CustomBoxProps {
  icon: any;
  title: string;
  description: string;
  onClick: any;
}

const CustomBox = (props: CustomBoxProps) => {
  const { icon, title, description, onClick } = props;
  return (
    <div className="boxContainer" onClick={onClick}>
      <div className="boxUpperView">
        <img src={icon} alt={'icon'} />
      </div>
      <div className="boxBelowView">
        <span className="boxCommissionText">{title}</span>
        <br />
        <span className="boxCommissionSubText block">{description}</span>
      </div>
    </div>
  );
};

export default CustomBox;
