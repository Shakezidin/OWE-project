/**
 * Created by satishazad on 20/01/24
 * File Name: SideDrawerPage
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/pages/drawer
 */

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import "./SideDrawerPage.css";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as MAIL_White } from "../../../resources/assets/mail_white.svg";
import { ReactComponent as PROFILE_White } from "../../../resources/assets/profile_white.svg";
import CreateUserProfile from "../create_profile/CreateUserProfile";
import {MenuItemModel} from "../../../core/models/data_models/MenuItemModel";
import {getMenuList} from "../../../resources/static_data/StaticData";
import {useState} from "react";
import {DashboardPage} from "../dashboard/DashboardPage";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

const menuList = getMenuList();


export default function SideDrawerPage(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = useState(menuList[0]);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

  const drawer = (
    <div className="drawerSideMenuContainer">
      <div className="drawerLogo">
        <LOGO_SMALL />
        <p className="drawerAppTitle"> Commission App</p>
      </div>
      <List>
        {menuList.map((item: MenuItemModel, index: number) => (
          <ListItem
            key={item.label}
            disablePadding
            onClick={() => {
              // alert(index);
                setSelectedMenu(item);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <MAIL_White /> : <PROFILE_White />}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
          {/*<CreateUserProfile />*/}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        />

          <div>
              {(selectedMenu.name === 'dashboard') && <DashboardPage />}
              {(selectedMenu.name !== 'dashboard') && <div> {selectedMenu.name} </div>}
          </div>

      </Box>
    </div>
  );
}
