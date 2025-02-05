import React, { useEffect } from 'react';
import styles from '../styles/AdderssPopUp.module.css';
import { RxCross2 } from 'react-icons/rx';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getDatAddersInfo } from '../../../redux/apiActions/DatToolAction/datToolAction';

const AdderssPopUp = ({ setOpenPopUp,currentGeneralId }: any) => {
  const dummyObj = [
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1174 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 812 },
    { adderName: 'ConnectDER', quantity: 1, cost: 620 },
    { adderName: 'Soft Stater', quantity: 1, cost: 891 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 1164 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 1307 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 448 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 1067 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 745 },
    { adderName: 'ConnectDER', quantity: 1, cost: 631 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1268 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 937 },
    { adderName: 'ConnectDER', quantity: 1, cost: 1011 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1186 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 926 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 671 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 960 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 690 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 481 },
    { adderName: 'ConnectDER', quantity: 1, cost: 773 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1247 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 899 },
    { adderName: 'ConnectDER', quantity: 1, cost: 634 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1050 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 1134 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 1184 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 1075 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 670 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 369 },
    { adderName: 'ConnectDER', quantity: 1, cost: 988 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1020 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 587 },
    { adderName: 'ConnectDER', quantity: 1, cost: 710 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1084 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 812 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 1062 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 1104 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 913 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 781 },
    { adderName: 'ConnectDER', quantity: 1, cost: 1123 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1043 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 1010 },
    { adderName: 'ConnectDER', quantity: 1, cost: 890 },
    { adderName: 'Soft Stater', quantity: 1, cost: 983 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 962 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 1025 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 1050 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 746 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 649 },
    { adderName: 'ConnectDER', quantity: 1, cost: 1029 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 728 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 1185 },
    { adderName: 'ConnectDER', quantity: 1, cost: 803 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1262 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 935 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 775 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 612 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 896 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 801 },
    { adderName: 'ConnectDER', quantity: 1, cost: 832 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1032 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 1031 },
    { adderName: 'ConnectDER', quantity: 1, cost: 674 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1087 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 437 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 983 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 725 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 774 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 838 },
    { adderName: 'ConnectDER', quantity: 1, cost: 781 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 883 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 746 },
    { adderName: 'ConnectDER', quantity: 1, cost: 1071 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1147 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 1014 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 651 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 438 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 825 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 1061 },
    { adderName: 'ConnectDER', quantity: 1, cost: 940 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 1125 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 1162 },
    { adderName: 'ConnectDER', quantity: 1, cost: 1064 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1097 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 973 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 838 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 1133 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 859 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 786 },
    { adderName: 'ConnectDER', quantity: 1, cost: 846 },
    { adderName: 'Supply/Line Side Tap', quantity: 1, cost: 760 },
    { adderName: 'Load Side Tap', quantity: 1, cost: 688 },
    { adderName: 'ConnectDER', quantity: 1, cost: 976 },
    { adderName: 'Soft Stater', quantity: 1, cost: 1140 },
    { adderName: 'Module Adder (per watt)', quantity: 1, cost: 289 },
    { adderName: 'Sense Energy Monitor', quantity: 1, cost: 1181 },
    { adderName: 'Enphase IQ8H Microinverters', quantity: 1, cost: 474 },
    { adderName: 'Enphase IQ8A Microinverters', quantity: 1, cost: 1066 },
  ];
  const dispatch = useAppDispatch();
     const { addersData } = useAppSelector((state) => state.datSlice);
    useEffect(()=>{
      dispatch(getDatAddersInfo({ project_id: currentGeneralId }));
    },[currentGeneralId]);
  return (
    <div className={styles.transparent_model}>
      <div className={styles.popUp}>
        <div className={styles.popUp_Header}>
          <p className={styles.popUp_adderName}>Adder name</p>
          <p className={styles.popUp_Quantity}>Quantity</p>
          <p className={styles.popUp_cost}>
            Cost{' '}
            <div
              className={styles.popUp_cross}
              onClick={() => setOpenPopUp(false)}
            >
              <RxCross2 />
            </div>
          </p>
        </div>
        <div className={styles.popUp_dummyData}>
          {addersData?.view_all_adders.map((item:any, index:number) => {
            return (
              <div className={styles.popUp_dummyData_rowDiv}>
                <div className={styles.popUp_adderData}>{item.name} </div>
                <div className={styles.popUp_quantityData}>
                  {item.quantity}{' '}
                </div>
                <div className={styles.popUp_costData}>$ {item.cost} </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdderssPopUp;
