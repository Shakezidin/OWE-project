
import { useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { RouteType } from "../../../routes/config";
import colorConfig from "../../../config/colorConfig";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


type Props = {
  item: RouteType;
  setToggleOpen:React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen:boolean;
};

const SidebarItemCollapse = ({ item,setToggleOpen,toggleOpen }: Props) => {
const [open,setOpen] = useState<boolean>(false)

  const { appState } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (appState.includes(item.state)) {
      setOpen(true);
    }
  }, [appState, item]);

  return (
    item.sidebarProps ? (
      <>
       <div className="side-accordian" onClick={() => setOpen(!open)} style={{cursor:"pointer"}}>
      <div className="side-icon-container">

     {item.sidebarProps.icon && item.sidebarProps.icon}
   
    {
      toggleOpen?null: <p className={`tablink ${open ? "active-side":""}`}>
      {item.sidebarProps.displayText}
         </p>
    }
      </div>
    {
      open?<MdKeyboardArrowUp style={{fontSize:"1.5rem",color:colorConfig.sidebar.activeBg}} />:<MdKeyboardArrowDown style={{fontSize:"1.5rem",color:"white"}} />
    }
     </div>
        {
          open &&   <div className="side-accordian-item">
          {item.child?.map((route, index) => (
            route.sidebarProps ? (
              route.child ? (
                <SidebarItemCollapse   toggleOpen={toggleOpen}  setToggleOpen={setToggleOpen} item={route} key={index} />
              ) : (
                <SidebarItem   toggleOpen={toggleOpen}  setToggleOpen={setToggleOpen} item={route} key={index} />
              )
            ) : null
          ))}
        </div>
        }
      
      </>
    ) : null
  );
};

export default SidebarItemCollapse;