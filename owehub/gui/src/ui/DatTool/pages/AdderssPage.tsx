import React, { useState } from 'react';
import styles from '../styles/AdderssPage.module.css';
import { FiMinus, FiPlus } from 'react-icons/fi';
import AdderssPopUp from '../components/AdderssPopUp';
import useEscapeKey from '../../../hooks/useEscape';
import { useEffect } from 'react';
import CommonComponent from './CommonComponent';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getDatAddersInfo } from '../../../redux/apiActions/DatToolAction/datToolAction';
import { add, set } from 'date-fns';
import MicroLoader from '../../components/loader/MicroLoader';
import { MdClose, MdDone } from 'react-icons/md';
import style2 from '../styles/GeneralPage.module.css';
import { toast } from 'react-toastify';
import DataNotFound from '../../components/loader/DataNotFound';

interface Item {
  name: string;
  quantity: number;
  cost: number;
}

interface CategoryItem {
  text: string;
  cost: number;
}

function AdderssPage({ setOpenPopUp,currentGeneralId,loading,changeInQuantity,setChangeInQuantity}: any) {
  const dispatch = useAppDispatch();
   const addersData= useAppSelector((state) => state.datSlice.addersData);
  useEffect(()=>{
    dispatch(getDatAddersInfo({ project_id: currentGeneralId }));
  },[currentGeneralId]);
  console.log(addersData, 'addersData.................'); 
  const leftPartObj: CategoryItem[] = addersData?.categories?.map((category:any) => ({
    text: category?.title ?? 'N/A',  
    cost: category?.cost ?? 0  
  })) ?? [];
  
  
  

 
  const getCategoryItems = (categoryIndex: number): Item[] => {
    return addersData?.categories?.[categoryIndex]?.items?.map((item: any) => ({
      name: item.name ?? 'N/A',
      quantity: item.quantity ?? 1,  
      cost: item.cost ?? 0
    })) ?? [];
  };
  
  const rightPartObj: Item[] = getCategoryItems(0); 
  const rightPartObjElectrical: Item[] = getCategoryItems(1); 
  const rightPartObjSiteAdders: Item[] = getCategoryItems(2); 
  const rightPartObjStructural: Item[] = getCategoryItems(3); 
  const rightPartObjUpgrades: Item[] = getCategoryItems(4); 
  const rightPartObjInterconnection: Item[] = getCategoryItems(5); 
  const rightPartObjUpgradedElectrical: Item[] = getCategoryItems(6); 
  const rightPartObjOther: Item[] = getCategoryItems(7); 
  
  

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
  
const [price, setPrice] = useState<{ [key: number]: number }>({});

useEffect(() => {
  if (addersData && addersData.categories) {
    setPrice((prevState) => {
      const newPrice: { [key: number]: number } = {};
      const leftPartObj: CategoryItem[] = addersData.categories.map((category: any) => ({
        text: category?.title ?? 'N/A',
        cost: category?.cost ?? 0
      }));
      leftPartObj.forEach((item, index) => {
        newPrice[index] = item.cost;
      });
      return newPrice;
    });
  }
}, [addersData]);

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


useEffect(() => {
  if (Array.isArray(rightPartObj) &&
      Array.isArray(rightPartObjElectrical) &&
      Array.isArray(rightPartObjSiteAdders) &&
      Array.isArray(rightPartObjStructural) &&
      Array.isArray(rightPartObjUpgrades) &&
      Array.isArray(rightPartObjInterconnection) &&
      Array.isArray(rightPartObjUpgradedElectrical) &&
      Array.isArray(rightPartObjOther)) {
    setValues({
      0: rightPartObj.map(item => item.quantity || 0),
      1: rightPartObjElectrical.map(item => item.quantity || 0),
      2: rightPartObjSiteAdders.map(item => item.quantity || 0),
      3: rightPartObjStructural.map(item => item.quantity || 0),
      4: rightPartObjUpgrades.map(item => item.quantity || 0),
      5: rightPartObjInterconnection.map(item => item.quantity || 0),
      6: rightPartObjUpgradedElectrical.map(item => item.quantity || 0),
      7: rightPartObjOther.map(item => item.quantity || 0),
    });
  }
}, [addersData]);



  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const currentItems = sectionData[currentSectionIndex];
  const handleIncrement = (index: number) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues[currentSectionIndex][index] += 1;
      setChangeInQuantity(true);
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
      setChangeInQuantity(true);
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
    
    const totalPrice = Object.values(price).reduce(
      (acc, priceValue) => acc + priceValue,
      0
    );
    setTotal(parseFloat(totalPrice.toFixed(2)));
  }, [price,addersData]);

  useEscapeKey(() => setOpenPopUp(false));
  const crossAdderHandler = ()=>{
    setChangeInQuantity(false);
    setValues({
      0: rightPartObj.map(item => item.quantity || 0), 
      1: rightPartObjElectrical.map(item => item.quantity || 0), 
      2: rightPartObjSiteAdders.map(item => item.quantity || 0), 
      3: rightPartObjStructural.map(item => item.quantity || 0), 
      4: rightPartObjUpgrades.map(item => item.quantity || 0), 
      5: rightPartObjInterconnection.map(item => item.quantity || 0), 
      6: rightPartObjUpgradedElectrical.map(item => item.quantity || 0), 
      7: rightPartObjOther.map(item => item.quantity || 0), 
    });
    
    setPrice({
      0: leftPartObj[0]?.cost || 0,
      1: leftPartObj[1]?.cost || 0,
      2: leftPartObj[2]?.cost || 0,
      3: leftPartObj[3]?.cost || 0,
      4: leftPartObj[4]?.cost || 0,
      5: leftPartObj[5]?.cost || 0,
      6: leftPartObj[6]?.cost || 0,
      7: leftPartObj[7]?.cost || 0,
    });
  }

  const updateAdderHandler = ()=>{
    setChangeInQuantity(false);
    toast.success('Adder Updated Successfully');
  }
  return (
    <div className={styles.container}>
      {loading ? <div className={styles.loaderContainer}> <MicroLoader/> </div> : addersData? <div className={styles.wrapper}>
      
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

      <div className={styles.adderssPageMainPart}>
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
          {changeInQuantity && <div className={styles.editing}>
            <p className={styles.editingPara}>Save Changes</p>
            <div className={style2.gSecHeaderBtn}>
  <div className={style2.editUser} onClick={crossAdderHandler}>
    <MdClose color="#434343" />
  </div>
  <div className={style2.editUserDone} onClick={updateAdderHandler}>
    <MdDone color="white" />
  </div>
</div>

             </div>}
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
                    { values[currentSectionIndex][index] ? values[currentSectionIndex][index] : 0 }
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
    </div>:<div style={{ display: 'flex', justifyContent: 'center' }}>
          <DataNotFound />
        </div>}
    </div>
    
  );
}

export default AdderssPage;
