import React from 'react'
import SideContainer from '../components/SideContainer'
import styles from '../styles/AdderssPage.module.css'
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { useState } from 'react';


interface Item {
  text: string;
  price: string;
}
function AdderssPage() {
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
  const [val,setVal]=useState<{ [key: number]: number }>({});

  const IncrementHandler = (index: number) => {
    setVal((prevValues) => {
      const newValues = { ...prevValues };
      // If the key doesn't exist, initialize it with 0
      if (newValues[index] === undefined) {
        newValues[index] = 1;
      }
      // Increment value if it's less than 10
      if (newValues[index] < 10) {
        newValues[index] += 1;
      }
      return newValues;
    });
  };
  
  const DecrementHandler = (index: number) => {
    setVal((prevValues) => {
      const newValues = { ...prevValues };
      // If the key doesn't exist, initialize it with 0
      if (newValues[index] === undefined) {
        newValues[index] = 1;
      }
      // Decrement value if it's greater than 1
      if (newValues[index] > 1) {
        newValues[index] -= 1;
      }
      return newValues;
    });
  };
  
  return (
  <div >
    {/* TOP PART */}
    <div className={styles.adderssPageTopPart}>
      <div className={styles.adderssPageTopPart_leftText}>
        <p className={styles.adderssPageTopPart_leftText_Adders}>Adders</p>
        <p className={styles.adderssPageTopPart_leftText_text}>Summarized cost for all additional components and customizations</p>
      </div>

      <div className={styles.adderssPageTopPart_rightText}>
        <p className={styles.adderssPageTopPart_rightText_amount}>$ 45,783</p>
        <p className={styles.adderssPageTopPart_rightText_popUpText}>View all adders</p>
      </div>
    </div>

    {/* MAIN CONTENT */}

    <div className={styles.adderssPageMainPart}>

      {/* LEFT PART */}
      <div className={styles.adderssPageMainPart_left}>
        {
          leftPartObj.map((bar,index)=>{
            return(
              <div className={styles.adderssPageMainPart_leftBarContainer} key={index}>
                <p className={styles.adderssPageMainPart_leftBarContainer_heading}>{bar.text}</p>
                <div className={styles.adderssPageMainPart_leftBarContainer_right}> 
                <p className={styles.adderssPageMainPart_leftBarContainer_staticText}>Total cost</p>
                <p className={styles.adderssPageMainPart_leftBarContainer_price}>{bar.price}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      {/* Right PART */}
      <div className={styles.adderssPageMainPart_Right}>
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
      </div>
    </div>
  </div>
  )
}

export default AdderssPage