import React from 'react'
import SideContainer from '../components/SideContainer'
import styles from '../styles/AdderssPage.module.css'
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { useState } from 'react';
import AdderssPopUp from '../components/AdderssPopUp';


interface Item {
  text: string;
  price: string;
}
function AdderssPage({setOpenPopUp}:any) {
  const leftPartObj:Item[]=[
    {
      text:"INTERCONNNECTION",
      price:"$12769",
    },
    {
      text:"ELECTRICAL",
      price:"$7350",
    },
    {
      text:"SITE ADDERS",
      price:"$4356",
    },
    {
      text:"STRUCTURAL",
      price:"$123.54",
    },
    {
      text:"UPGRADES",
      price:"$2253.23",
    },
    {
      text:"Trenching (per foot)",
      price:"$1234.3",
    },
    {
      text:"BATTERYt",
      price:"$123",
    },
    {
      text:"OTHER",
      price:"$12.54 ",
    },
  ]
  const rightPartObj:Item[]=[
    {
      text:"Supply/Line Side Tap",
      price:"$750",
    },
    {
      text:"Load Side Tap",
      price:"$250",
    },
    {
      text:"ConnectDER",
      price:"$150",
    },
    {
      text:"Subpanel Add-in",
      price:"$750",
    },
    {
      text:"Derate",
      price:"$250",
    },
    {
      text:"H-Frame (PV)",
      price:"$150",
    },
    {
      text:"Extra Main Breaker",
      price:"$750",
    },
  ]
  const rightPartObjElectrical:Item[]=[
      {
        text:"Soft Stater",
        price:"$750",
      },
      {
        text:"Module Adder (per watt)",
        price:"$250",
      },
      {
        text:"Sense Energy Monitor",
        price:"$150",
      },
      {
        text:"Enphase IQ8H Microinverters",
        price:"$750",
      },
      {
        text:"Enphase IQ8A Microinverters",
        price:"$250",
      },
      {
        text:"Load Controller",
        price:"$150",
      },
      {
        text:"CTs",
        price:"$750",
      },
      {
        text:"EV Charger",
        price:"$250",
      },
      {
        text:"EV Charger outlet",
        price:"$150",
      },
    
  ]
  const [val,setVal]=useState<{ [key: number]: number }>({});
  const [price,setPrice]=useState<{ [key: number]: number }>({});
  const [currentSectionIndex,setCurrentSectionIndex]=useState<number>(0);

  
  const IncrementHandler = (index: number) => {
    setVal((prevValues) => {
      const newValues = { ...prevValues };
      if (newValues[index] === undefined) {
        newValues[index] = 1;
      }
      if (newValues[index] < 10) {
        newValues[index] += 1;
      }
      return newValues;
    });
  
    // Update price for the current selected left bar
    updatePrice(index);
  };
  
  const DecrementHandler = (index: number) => {
    setVal((prevValues) => {
      const newValues = { ...prevValues };
      if (newValues[index] === undefined) {
        newValues[index] = 1;
      }
      if (newValues[index] > 1) {
        newValues[index] -= 1;
      }
      return newValues;
    });
  
    // Update price for the current selected left bar
    updatePrice(index);
  };
  
  const updatePrice = (index: number) => {
    setPrice((prevPrice) => {
      const newPrice = { ...prevPrice };
  
      // Get the number of items selected from the right side
      const value = val[index] || 1;
  
      // Get base price of the currently selected left section
      const basePrice = parseFloat(leftPartObj[currentSectionIndex]?.price.replace('$', ''));
  
      // Get additional price from the right side object (based on current selection)
      let additionalPrice = 0;
      if (currentSectionIndex === 0) {
        additionalPrice = parseFloat(rightPartObj[index]?.price.replace('$', ''));
      } else if (currentSectionIndex === 1) {
        additionalPrice = parseFloat(rightPartObjElectrical[index]?.price.replace('$', ''));
      }
  
      // Update price only for the currently selected left bar
      if (value > 1) {
        newPrice[currentSectionIndex] = basePrice + additionalPrice * (value - 1);
      } else {
        newPrice[currentSectionIndex] = basePrice;
      }
  
      return newPrice;
    });
  };
  const handleSectionIndex=(index:number)=>{
   setCurrentSectionIndex(index)
  }
  
  return (
  <div style={{padding:"0 1.2rem",position:"relative",height:"calc(100vh - 216px)",overflowY:"scroll"}}>
    
    {/* TOP PART */}
    <div className={styles.adderssPageTopPart}>
      <div className={styles.adderssPageTopPart_leftText}>
        <p className={styles.adderssPageTopPart_leftText_Adders}>Adders</p>
        <p className={styles.adderssPageTopPart_leftText_text}>Summarized cost for all additional components and customizations</p>
      </div>

      <div className={styles.adderssPageTopPart_rightText}>
        <p className={styles.adderssPageTopPart_rightText_amount}>$ 45,783</p>
        <p className={styles.adderssPageTopPart_rightText_popUpText} onClick={()=>setOpenPopUp(true)}>View all adders</p>
      </div>
    </div>

    {/* MAIN CONTENT */}

    <div className={styles.adderssPageMainPart}>

      {/* LEFT PART */}
      <div className={styles.adderssPageMainPart_left}>
        {
          leftPartObj.map((bar,index)=>{
            return(
              <div className={styles.adderssPageMainPart_leftBarContainer} key={index} style={{backgroundColor:currentSectionIndex===index?"#377CF6":""}} onClick={()=>{handleSectionIndex(index)}}>
                <p className={styles.adderssPageMainPart_leftBarContainer_heading} style={{color:currentSectionIndex===index?"#FFFFFF":""}}>{bar.text}</p>
                <div className={styles.adderssPageMainPart_leftBarContainer_right}> 
                <p className={styles.adderssPageMainPart_leftBarContainer_staticText} style={{color:currentSectionIndex===index?"#FFFFFF":""}}>Total cost</p>
                <p className={styles.adderssPageMainPart_leftBarContainer_price} style={{color:currentSectionIndex===index?"#FFFFFF":""}}>${price[index] ? price[index].toFixed(2) : parseFloat(bar.price.replace('$', '')).toFixed(2)}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      {/* Right PART */}
      {currentSectionIndex===0?<div className={styles.adderssPageMainPart_Right}>
        {
          rightPartObj.map((obj,index)=>{
            return(
              <div className={styles.adderssPageMainPart_rightBarContainer} key={index}> 
              <p className={styles.adderssPageMainPart_rightBarContainer_heading}>{obj.text}</p>

              <div className={styles.adderssPageMainPart_rightContainer}>
              <div className={styles.adderssPageMainPart_expressionContainer}> 
              <FiMinus  className={styles.adderssPageMainPart_decrement}  onClick={() => DecrementHandler(index)}/>
              <p  className={styles.adderssPageMainPart_text}>{val[index] || 1}</p>
              <FiPlus  className={styles.adderssPageMainPart_increment}  onClick={() => IncrementHandler(index)}/>
              </div>
              <p  className={styles.adderssPageMainPart_price}>{obj.price}</p>
                 </div>
              </div>
            )
          })
        }
      </div>:
      <div className={styles.adderssPageMainPart_Right}>
      {
        rightPartObjElectrical.map((obj,index)=>{
          return(
            <div className={styles.adderssPageMainPart_rightBarContainer} key={index}> 
            <p className={styles.adderssPageMainPart_rightBarContainer_heading}>{obj.text}</p>

            <div className={styles.adderssPageMainPart_rightContainer}>
            <div className={styles.adderssPageMainPart_expressionContainer}> 
            <FiMinus  className={styles.adderssPageMainPart_decrement}  onClick={() => DecrementHandler(index)}/>
            <p  className={styles.adderssPageMainPart_text}>{val[index] || 1}</p>
            <FiPlus  className={styles.adderssPageMainPart_increment}  onClick={() => IncrementHandler(index)}/>
            </div>
            <p  className={styles.adderssPageMainPart_price}>{obj.price}</p>
               </div>
            </div>
          )
        })
      }
    </div>
      }
    </div>
  </div>
  )
}

export default AdderssPage