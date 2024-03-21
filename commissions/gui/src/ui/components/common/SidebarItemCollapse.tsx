
import { useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { RouteType } from "../../../routes/config";
import colorConfig from "../../../config/colorConfig";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";


type Props = {
  item: RouteType;
};

const SidebarItemCollapse = ({ item }: Props) => {
  const [open, setOpen] = useState(false);

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
      <div className="">
     {item.sidebarProps.icon && item.sidebarProps.icon}
     </div>
     <p className='tablink' >
     {item.sidebarProps.displayText}
        </p>
      </div>
    <div className="">
    <MdKeyboardArrowDown style={{fontSize:"1.5rem",color:"white"}} />
    </div>
     </div>
        {
          open &&   <div className="side-accordian-item">
          {item.child?.map((route, index) => (
            route.sidebarProps ? (
              route.child ? (
                <SidebarItemCollapse item={route} key={index} />
              ) : (
                <SidebarItem item={route} key={index} />
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