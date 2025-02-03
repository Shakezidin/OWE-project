import React, { useState } from 'react';
import styles from '../styles/AdderssPage.module.css';
import { FiMinus, FiPlus } from 'react-icons/fi';
import AdderssPopUp from '../components/AdderssPopUp';
import useEscapeKey from '../../../hooks/useEscape';
import { useEffect } from 'react';
import CommonComponent from './CommonComponent';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getDatAddersInfo } from '../../../redux/apiActions/DatToolAction/datToolAction';
import { add } from 'date-fns';
import MicroLoader from '../../components/loader/MicroLoader';

interface Component {
  name: string;
  quantity: number;
  cost: number;
}

interface Item {
  name: string;
  quantity: number;
  cost: number;
}

interface CategoryItem {
  text: string;
  cost: number;
}


interface AddersData {
  categories: CategoryItem[];
  total_cost: number;
}


function AdderssPage({ setOpenPopUp,currentGeneralId,loading }: any) {
  const dispatch = useAppDispatch();
   const { addersData } = useAppSelector((state) => state.datSlice);
  useEffect(()=>{
    dispatch(getDatAddersInfo({ project_id: currentGeneralId }));
  },[currentGeneralId]);
  const leftPartObj: CategoryItem[] = [
    { text: 'INTERCONNECTION', cost: addersData ? addersData.categories[0]?.cost : 0 },
    { text: 'ELECTRICAL', cost: addersData ? addersData?.categories?.[1].cost : 0 },
    { text: 'SITE ADDERS', cost: addersData ? addersData?.categories?.[2].cost : 0 },
    { text: 'STRUCTURAL', cost: addersData ? addersData?.categories?.[3].cost : 0 },
    { text: 'UPGRADES', cost: addersData ? addersData?.categories?.[4].cost : 0 },
    { text: 'Trenching (per foot)', cost: addersData ? addersData?.categories?.[5].cost : 0 },
    { text: 'BATTERY', cost: addersData ? addersData?.categories?.[6].cost : 0 },
    { text: 'OTHER', cost: addersData ? addersData?.categories?.[7].cost : 0 }
  ];
  

  const rightPartObj: Item[] = [
    {
      name: 'Supply/Line Side Tap',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[0].cost || 0
        : 0,
    },
    {
      name: 'Load Side Tap',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[1].cost || 0
        : 0,
    },
    {
      name: 'ConnectDER',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[2].cost || 0
        : 0,
    },
    {
      name: 'Subpanel Add-in',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[3].cost || 0
        : 0,
    },
    {
      name: 'Derate',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[4].cost || 0
        : 0,
    },
    {
      name: 'H-Frame (PV)',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[5].cost || 0
        : 0,
    },
    {
      name: 'Extra Main Breaker',
      quantity: 1, // Assuming a default quantity, adjust as needed
      cost: addersData && Array.isArray(addersData.categories) && addersData.categories[0]
        ? addersData.categories[0].items[6].cost || 0
        : 0,
    },
  ];
  
  // const rightPartObj: Item[] = [
  //   ... (addersData && Array.isArray(addersData.components) ? addersData.components.map((item:any, index:any) => ({
  //     text: item.name || "N/A", 
  //     price: item.cost || 0, 
  //   })) : [])
  // ];

  const rightPartObjElectrical: Item[] = [
    { name: 'Soft Stater', quantity: 0, cost: 750 },
    { name: 'Module Adder (per watt)', quantity: 0, cost: 250 },
    { name: 'Sense Energy Monitor', quantity: 0, cost: 150 },
    { name: 'Enphase IQ8H Microinverters', quantity: 0, cost: 750 },
    { name: 'Enphase IQ8A Microinverters', quantity: 0, cost: 250 },
    { name: 'Load Controller', quantity: 0, cost: 150 },
    { name: 'CTs', quantity: 0, cost: 750 },
    { name: 'EV Charger', quantity: 0, cost: 250 },
    { name: 'EV Charger outlet', quantity: 0, cost: 150 },
  ];
  
  const rightPartObjSiteAdders: Item[] = [
    { name: 'Site Preparation', quantity: 0, cost: 2000 },
    { name: 'Excavation (per foot)', quantity: 0, cost: 15 },
    { name: 'Concrete Foundation', quantity: 0, cost: 1500 },
    { name: 'Site Survey', quantity: 0, cost: 1000 },
    { name: 'Permitting Fees', quantity: 0, cost: 500 },
    { name: 'Landscaping', quantity: 0, cost: 800 },
    { name: 'Fencing (per foot)', quantity: 0, cost: 10 },
  ];
  
  const rightPartObjStructural: Item[] = [
    { name: 'Steel Frame', quantity: 0, cost: 5000 },
    { name: 'Concrete Slab', quantity: 0, cost: 3000 },
    { name: 'Roof Installation', quantity: 0, cost: 3500 },
    { name: 'Wall Framing', quantity: 0, cost: 2500 },
    { name: 'Doors & Windows', quantity: 0, cost: 1500 },
    { name: 'Ceiling Work', quantity: 0, cost: 2000 },
    { name: 'Load-bearing Walls', quantity: 0, cost: 4000 },
  ];
  
  const rightPartObjUpgrades: Item[] = [
    { name: 'Upgraded Panels', quantity: 0, cost: 1000 },
    { name: 'Advanced Wiring', quantity: 0, cost: 800 },
    { name: 'Smart Home Integration', quantity: 0, cost: 1500 },
    { name: 'Enhanced Lighting', quantity: 0, cost: 600 },
    { name: 'Solar Battery Storage', quantity: 0, cost: 3000 },
    { name: 'Panel Monitoring System', quantity: 0, cost: 700 },
    { name: 'Energy Efficient Appliances', quantity: 0, cost: 2500 },
  ];
  
  const rightPartObjInterconnection: Item[] = [
    { name: 'Utility Service Connection', quantity: 0, cost: 4000 },
    { name: 'Grid-Tie Inverter', quantity: 0, cost: 2000 },
    { name: 'AC Disconnect', quantity: 0, cost: 600 },
    { name: 'AC Combiner Box', quantity: 0, cost: 800 },
    { name: 'Utility Meter Upgrade', quantity: 0, cost: 1200 },
    { name: 'Transformer Installation', quantity: 0, cost: 3500 },
    { name: 'Conduit & Wiring', quantity: 0, cost: 1000 },
  ];
  
  const rightPartObjUpgradedElectrical: Item[] = [
    { name: 'Inverter Upgrade', quantity: 0, cost: 1200 },
    { name: 'Battery Backup System', quantity: 0, cost: 5000 },
    { name: 'Smart Inverters', quantity: 0, cost: 1500 },
    { name: 'Power Optimizers', quantity: 0, cost: 750 },
    { name: 'Solar Monitoring System', quantity: 0, cost: 500 },
    { name: 'Solar Charge Controller', quantity: 0, cost: 800 },
    { name: 'Dedicated Circuit Breakers', quantity: 0, cost: 300 },
  ];
  
  const rightPartObjOther: Item[] = [
    { name: 'Miscellaneous Charges', quantity: 0, cost: 100 },
    { name: 'Custom Work', quantity: 0, cost: 500 },
    { name: 'Special Requests', quantity: 0, cost: 300 },
    { name: 'Additional Materials', quantity: 0, cost: 200 },
    { name: 'Consultation Fees', quantity: 0, cost: 150 },
    { name: 'Additional Equipment', quantity: 0, cost: 350 },
    { name: 'Shipping and Handling', quantity: 0, cost: 50 },
  ];
  

  const sectionData = [
    rightPartObj,
    rightPartObjElectrical,
    rightPartObjSiteAdders,
    rightPartObjStructural,
    rightPartObjUpgrades,
    rightPartObjInterconnection,
    rightPartObjUpgradedElectrical,
    rightPartObjOther,
  ];

  const [price, setPrice] = useState<{ [key: number]: number }>({
    0: leftPartObj[0]?.cost || 0,
    1: leftPartObj[1]?.cost || 0,
    2: leftPartObj[2]?.cost || 0,
    3: leftPartObj[3]?.cost || 0,
    4: leftPartObj[4]?.cost || 0,
    5: leftPartObj[5]?.cost || 0,
    6: leftPartObj[6]?.cost || 0,
    7: leftPartObj[7]?.cost || 0,
  });

  const [values, setValues] = useState<{ [key: number]: number[] }>({
    0: Array(rightPartObj.length).fill(0),
    1: Array(rightPartObjElectrical.length).fill(0),
    2: Array(rightPartObjSiteAdders.length).fill(0),
    3: Array(rightPartObjStructural.length).fill(0),
    4: Array(rightPartObjUpgrades.length).fill(0),
    5: Array(rightPartObjInterconnection.length).fill(0),
    6: Array(rightPartObjUpgradedElectrical.length).fill(0),
    7: Array(rightPartObjOther.length).fill(0),
  });



  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const currentItems = sectionData[currentSectionIndex];
  

  const handleIncrement = (index: number) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues[currentSectionIndex][index] += 1;
      return newValues;
    });

    setPrice((prevPrice) => {
      const newPrice = { ...prevPrice };
      const itemPrice = currentItems[index].cost;
      const itemQuantity = values[currentSectionIndex][index] + 1;
      newPrice[currentSectionIndex] =
        (newPrice[currentSectionIndex] || 0) + itemPrice;

      return newPrice;
    });
  };

  const handleDecrement = (index: number) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };
      newValues[currentSectionIndex][index] = Math.max(
        (newValues[currentSectionIndex][index] || 0) - 1,
        0
      );
      return newValues;
    });

    setPrice((prevPrice) => {
      const newPrice = { ...prevPrice };
      const itemPrice = currentItems[index].cost;
      const itemQuantity = values[currentSectionIndex][index] - 1;
      if (itemQuantity < 0) return prevPrice;
      newPrice[currentSectionIndex] =
        (newPrice[currentSectionIndex] || 0) - itemPrice;
      return newPrice;
    });
  };

  const handleSectionIndex = (index: number) => {
    setCurrentSectionIndex(index);
  };
  const [total, setTotal] = useState<number>(0);


  useEffect(() => {
    // Calculate the sum of all prices
    const totalPrice = Object.values(price).reduce(
      (acc, priceValue) => acc + priceValue,
      0
    );
    setTotal(parseFloat(totalPrice.toFixed(2)));
  }, [price]);

  useEscapeKey(() => setOpenPopUp(false));

  return (
    <div className={styles.container}>
      {loading ? <div className={styles.loaderContainer}> <MicroLoader/> </div> : <div className={styles.wrapper}>
      
      <div className={styles.adderssPageTopPart}>
        <div className={styles.adderssPageTopPart_leftText}>
          <p className={styles.adderssPageTopPart_leftText_Adders}>Adders</p>
          <p className={styles.adderssPageTopPart_leftText_text}>
            Summarized cost for all additional components and customizations
          </p>
        </div>
        <div className={styles.adderssPageTopPart_rightText}>
          <p className={styles.adderssPageTopPart_rightText_amount}>
            $ {total}
          </p>
          <p
            className={styles.adderssPageTopPart_rightText_popUpText}
            onClick={() => setOpenPopUp(true)}
          >
            View all adders
          </p>
        </div>
      </div>

      {}
      <div className={styles.adderssPageMainPart}>
        {}
        <div className={styles.adderssPageMainPart_left}>
          {leftPartObj.map((bar, index) => (
            <div
              className={styles.adderssPageMainPart_leftBarContainer}
              key={index}
              style={{
                backgroundColor: currentSectionIndex === index ? '#377CF6' : '',
              }}
              onClick={() => handleSectionIndex(index)}
            >
              <p
                className={styles.adderssPageMainPart_leftBarContainer_heading}
                style={{
                  color: currentSectionIndex === index ? '#FFFFFF' : '',
                }}
              >
                {bar.text}
              </p>
              <div
                className={styles.adderssPageMainPart_leftBarContainer_right}
              >
                <p
                  className={
                    styles.adderssPageMainPart_leftBarContainer_staticText
                  }
                  style={{
                    color: currentSectionIndex === index ? '#FFFFFF' : '',
                  }}
                >
                  Total cost
                </p>
                <p
                  className={styles.adderssPageMainPart_leftBarContainer_price}
                  style={{
                    color: currentSectionIndex === index ? '#FFFFFF' : '',
                  }}
                >
                  $ {price[index]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.adderssPageMainPart_Right}>
          {currentItems.map((obj, index) => (
            <div
              className={styles.adderssPageMainPart_rightBarContainer}
              key={index}
            >
              <p
                className={styles.adderssPageMainPart_rightBarContainer_heading}
              >
                {obj.name}
              </p>
              <div className={styles.adderssPageMainPart_rightContainer}>
                <div className={styles.adderssPageMainPart_expressionContainer}>
                  <FiMinus
                    className={styles.adderssPageMainPart_decrement}
                    onClick={() => handleDecrement(index)}
                  />
                  <p className={styles.adderssPageMainPart_text}>
                    {values[currentSectionIndex]?.[index] || 0}
                  </p>
                  <FiPlus
                    className={styles.adderssPageMainPart_increment}
                    onClick={() => handleIncrement(index)}
                  />
                </div>
                <p className={styles.adderssPageMainPart_price}>$ {obj.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>}
    </div>
    
  );
}

export default AdderssPage;
