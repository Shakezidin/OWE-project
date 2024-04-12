
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { RootState } from "../../../redux/store";
import { RouteType } from "../../../routes/config";
import colorConfig from "../../../config/colorConfig";
import { useState } from "react";


type Props = {
  item: RouteType;
  toggleOpen:boolean,
  setToggleOpen:React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarItem = ({ item,setToggleOpen,toggleOpen }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);
  const [displayText,setDisplayText] = useState<boolean>(false)
  const navigate = useNavigate()
  return (
    item.sidebarProps && item.path ? (
   <Link 
   to={item.path}
   className={`side-icon-container ${appState === item.state?"active-link-bg":""}`}   onMouseOver={()=>setDisplayText(true)}>

   {item.sidebarProps.icon && item.sidebarProps.icon}
   
   {
    toggleOpen?null:<p
    className={`tablink ${appState === item.state?"active-link":""}`}
  >
    {item.sidebarProps.displayText}
  </p>
   }
  
   </Link>
    ) : null
  );
};

export default SidebarItem;