
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { RootState } from "../../../redux/store";
import { RouteType } from "../../../routes/config";
import colorConfig from "../../../config/colorConfig";


type Props = {
  item: RouteType;
  toggleOpen:boolean,
  setToggleOpen:React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarItem = ({ item,setToggleOpen,toggleOpen }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);
  const navigate = useNavigate()
  return (
    item.sidebarProps && item.path ? (
   <div className="side-icon-container" >

   {item.sidebarProps.icon && item.sidebarProps.icon}
   
   {
    toggleOpen?null:<Link
    to={item.path}
    className="tablink"
    style={{
      color: appState === item.state ? colorConfig.sidebar.activeBg : "white",
    }}
  >
    {item.sidebarProps.displayText}
  </Link>
   }
  
   
    
   </div>
    ) : null
  );
};

export default SidebarItem;