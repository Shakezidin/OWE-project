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
  const leftPartObj: CategoryItem[] = addersData?.categories?.map((category:any) => ({
    text: category?.title ?? 'N/A',  
    cost: category?.cost ?? 0  
  })) ?? [];
  
  
  

  const itemNames = [
    'Supply/Line Side Tap',
    'Load Side Tap',
    'ConnectDER',
    'Subpanel Add-in',
    'Derate',
    'H-Frame (PV)',
    'Extra Main Breaker'
  ];
  
  const getCategoryItems = (categoryIndex: number): Item[] => {
    return addersData?.categories?.[categoryIndex]?.items?.map((item: any) => ({
      name: item.name ?? 'N/A',
      quantity: item.quantity ?? 1,  // Assuming quantity is present in the API, fallback to 1 if not
      cost: item.cost ?? 0
    })) ?? [];
  };
  
  const rightPartObj: Item[] = getCategoryItems(0); // Assuming this is for the first category (same as addersData.categories[0].items)
  const rightPartObjElectrical: Item[] = getCategoryItems(1); // Electrical category (index 1)
  const rightPartObjSiteAdders: Item[] = getCategoryItems(2); // Site Adders category (index 2)
  const rightPartObjStructural: Item[] = getCategoryItems(3); // Structural category (index 3)
  const rightPartObjUpgrades: Item[] = getCategoryItems(4); // Upgrades category (index 4)
  const rightPartObjInterconnection: Item[] = getCategoryItems(5); // Interconnection category (index 5)
  const rightPartObjUpgradedElectrical: Item[] = getCategoryItems(6); // Upgraded Electrical category (index 6)
  const rightPartObjOther: Item[] = getCategoryItems(7); // Other category (index 7)
  
  

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
                    {obj.quantity ||  0}
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
