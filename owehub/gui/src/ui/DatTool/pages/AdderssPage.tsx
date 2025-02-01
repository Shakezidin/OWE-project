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
interface Item {
  text: string;
  price: number;
}

interface Component {
  name: string;
  quantity: number;
  cost: number;
}

interface AddersData {
  adders: string;
  interconnection_cost: number;
  electrical_cost: number;
  site_adders_cost: number;
  structural_cost: number;
  upgrades_cost: number;
  trenching_cost: number;
  battery_cost: number;
  other_cost: number;
  total_cost: number;
  components: Component[];
}


function AdderssPage({ setOpenPopUp,currentGeneralId }: any) {
  const dispatch = useAppDispatch();
   const { addersData } = useAppSelector((state) => state.datSlice);
  useEffect(()=>{
    dispatch(getDatAddersInfo({ project_id: currentGeneralId }));
    console.log('API Response:', addersData);
  },[currentGeneralId]);
  const leftPartObj: Item[] = [
    { text: 'INTERCONNNECTION', price: addersData?.interconnection_cost ?? 0},
    { text: 'ELECTRICAL', price: addersData?.electrical_cost ?? 0},
    { text: 'SITE ADDERS', price: addersData?.site_adders_cost ?? 0},
    { text: 'STRUCTURAL', price:  addersData?.structural_cost ?? 0},
    { text: 'UPGRADES', price: addersData?.upgrades_cost ?? 0 },
    { text: 'Trenching (per foot)', price: addersData?.trenching_cost ?? 0 },
    { text: 'BATTERY', price: addersData?.battery_cost ?? 0 },
    { text: 'OTHER', price: addersData?.other_cost ?? 0 },
  ];

  const rightPartObj: Item[] = [
    { text: 'Supply/Line Side Tap', price: addersData?.components[0].cost ?? 0 },
    { text: 'Load Side Tap', price: addersData?.components[1].cost ?? 0 },
    { text: 'ConnectDER', price: addersData?.components[2].cost ?? 0 },
    { text: 'Subpanel Add-in', price: addersData?.components[3].cost ?? 0 },
    { text: 'Derate', price: addersData?.components[4].cost ?? 0 },
    { text: 'H-Frame (PV)', price: addersData?.components[5].cost ?? 0 },
    { text: 'Extra Main Breaker', price: addersData?.components[6].cost ?? 0 },
  ];

  const rightPartObjElectrical: Item[] = [
    { text: 'Soft Stater', price: 750 },
    { text: 'Module Adder (per watt)', price: 250 },
    { text: 'Sense Energy Monitor', price: 150 },
    { text: 'Enphase IQ8H Microinverters', price: 750 },
    { text: 'Enphase IQ8A Microinverters', price: 250 },
    { text: 'Load Controller', price: 150 },
    { text: 'CTs', price: 750 },
    { text: 'EV Charger', price: 250 },
    { text: 'EV Charger outlet', price: 150 },
  ];

  const rightPartObjSiteAdders: Item[] = [
    { text: 'Site Preparation', price: 2000 },
    { text: 'Excavation (per foot)', price: 15 },
    { text: 'Concrete Foundation', price: 1500 },
    { text: 'Site Survey', price: 1000 },
    { text: 'Permitting Fees', price: 500 },
    { text: 'Landscaping', price: 800 },
    { text: 'Fencing (per foot)', price: 10 },
  ];

  const rightPartObjStructural: Item[] = [
    { text: 'Steel Frame', price: 5000 },
    { text: 'Concrete Slab', price: 3000 },
    { text: 'Roof Installation', price: 3500 },
    { text: 'Wall Framing', price: 2500 },
    { text: 'Doors & Windows', price: 1500 },
    { text: 'Ceiling Work', price: 2000 },
    { text: 'Load-bearing Walls', price: 4000 },
  ];

  const rightPartObjUpgrades: Item[] = [
    { text: 'Upgraded Panels', price: 1000 },
    { text: 'Advanced Wiring', price: 800 },
    { text: 'Smart Home Integration', price: 1500 },
    { text: 'Enhanced Lighting', price: 600 },
    { text: 'Solar Battery Storage', price: 3000 },
    { text: 'Panel Monitoring System', price: 700 },
    { text: 'Energy Efficient Appliances', price: 2500 },
  ];

  const rightPartObjInterconnection: Item[] = [
    { text: 'Utility Service Connection', price: 4000 },
    { text: 'Grid-Tie Inverter', price: 2000 },
    { text: 'AC Disconnect', price: 600 },
    { text: 'AC Combiner Box', price: 800 },
    { text: 'Utility Meter Upgrade', price: 1200 },
    { text: 'Transformer Installation', price: 3500 },
    { text: 'Conduit & Wiring', price: 1000 },
  ];

  const rightPartObjUpgradedElectrical: Item[] = [
    { text: 'Inverter Upgrade', price: 1200 },
    { text: 'Battery Backup System', price: 5000 },
    { text: 'Smart Inverters', price: 1500 },
    { text: 'Power Optimizers', price: 750 },
    { text: 'Solar Monitoring System', price: 500 },
    { text: 'Solar Charge Controller', price: 800 },
    { text: 'Dedicated Circuit Breakers', price: 300 },
  ];

  const rightPartObjOther: Item[] = [
    { text: 'Miscellaneous Charges', price: 100 },
    { text: 'Custom Work', price: 500 },
    { text: 'Special Requests', price: 300 },
    { text: 'Additional Materials', price: 200 },
    { text: 'Consultation Fees', price: 150 },
    { text: 'Additional Equipment', price: 350 },
    { text: 'Shipping and Handling', price: 50 },
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
    0: leftPartObj[0]?.price || 0,
    1: leftPartObj[1]?.price || 0,
    2: leftPartObj[2]?.price || 0,
    3: leftPartObj[3]?.price || 0,
    4: leftPartObj[4]?.price || 0,
    5: leftPartObj[5]?.price || 0,
    6: leftPartObj[6]?.price || 0,
    7: leftPartObj[7]?.price || 0,
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
      const itemPrice = currentItems[index].price;
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
      const itemPrice = currentItems[index].price;
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
      <div className={styles.wrapper}>
      
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

        {}
        <div className={styles.adderssPageMainPart_Right}>
          {}
          {currentItems.map((obj, index) => (
            <div
              className={styles.adderssPageMainPart_rightBarContainer}
              key={index}
            >
              <p
                className={styles.adderssPageMainPart_rightBarContainer_heading}
              >
                {obj.text}
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
                <p className={styles.adderssPageMainPart_price}>{obj.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default AdderssPage;
