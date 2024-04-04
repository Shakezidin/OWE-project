import React from "react";
import "../userManagement/user.css";
import '../configure/configure.css'
import AppointmentSetterTable from "./userManagerAllTable/AppointmentSetterTable";
import UserTable from "./userManagerAllTable/UserTable";
import PartnerTable from "./userManagerAllTable/PartnerTable";
import RegionalManagerTable from "./userManagerAllTable/RegionalManagerTable";
import DealerOwnerTable from "./userManagerAllTable/DealerOwnerTable";
import SalesRepresentativeTable from "./userManagerAllTable/SalesRepresentativeTable";
import SalesManagerTable from "./userManagerAllTable/SalesManagerTable";
import UserHeaderSection from "./UserHeader/UserHeaderSection";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";


const ManageUser: React.FC = () => {
  return (
    <>
    <div className="">
    <UserHeaderSection/>
    </div>
  
  
    </>
  );
};

export default ManageUser;
