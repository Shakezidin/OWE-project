
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "../../../redux/store";
import { RouteType } from "../../../routes/config";
import colorConfig from "../../../config/colorConfig";


type Props = {
  item: RouteType;
};

const SidebarItem = ({ item }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);

  return (
    item.sidebarProps && item.path ? (
   <div className="side-accordian">
     <div className="">
     {item.sidebarProps.icon && item.sidebarProps.icon}
     </div>
       <Link
        to={item.path}
        className="tablink"
        style={{
          color: appState === item.state ? colorConfig.sidebar.activeBg : "white",
        }}
      >
        {item.sidebarProps.displayText}
      </Link>
    
   </div>
    ) : null
  );
};

export default SidebarItem;