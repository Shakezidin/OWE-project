
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
   <div className={`side-icon-container ${appState === item.state?"active-link-bg":""}`} >

   {item.sidebarProps.icon && item.sidebarProps.icon}
   
   {
    toggleOpen?null:<Link
    to={item.path}
    className={`tablink ${appState === item.state?"active-link":""}`}
  >
    {item.sidebarProps.displayText}
  </Link>
   }
   </div>
    ) : null
  );
};

export default SidebarItem;