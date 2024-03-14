

import Header from "../layout/Header";
import sizeConfig from "../../../config/sizeConfig";
import colorConfig from "../../../config/colorConfig";


const Topbar = () => {
  return (
    <div
      
      style={{
        width: `calc(100% - ${sizeConfig.sidebar.width})`,
        height:80,
      
        // ml: sizeConfig.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfig.topbar.bg,
        color: colorConfig.topbar.color
      }}
    >
      {/* <Toolbar> */}
    <Header/>
      {/* </Toolbar> */}
    </div>
  );
};

export default Topbar;