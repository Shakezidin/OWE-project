import React from 'react'
import { ICONS } from '../../resources/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { IoArrowUp, IoArrowDown } from 'react-icons/io5';


const data1 = [
    {
     
      name: 'Total Sales',
      img: ICONS.rep1,
      bar: ICONS.repBar1,
      count:6584,
      key: 'total_sales',
      color:'#0096D3',
      bgColor: '#E3F3FC',
      percent: '+12',
      arrow: <IoArrowUp />,
    },
    {
   
      name: 'Total NTP',
      img: ICONS.rep2,
      bar: ICONS.repBar2,
      count:2169,
      key: 'total_ntp',
      color: '#7AA420',
      bgColor: '#EBF4DA',
      percent: '-9',
      arrow: <IoArrowDown />,
    },
    {
     
      name: 'Total Installs',
      img: ICONS.rep3,
      bar: ICONS.repBar3,
      count:1691,
      key: 'total_installs',
      color: '#2DC278',
      bgColor: '#EAFFF5',
      percent: '+12',
      arrow: <IoArrowUp />,
    },
  ];


const TotalCard = () => {
  return (
    <div className='totalcard'>
          <>
              {data1.length > 0
                ? data1.map((el, i) => (
                    <div
                      className="total-card-count"   
                      style={{backgroundColor: el.bgColor}}                   
                    >
                      <div
                        key={el.key}
                        // onClick={() => handleClick(el.key)}
                        className="dealer-tot-amt"
                        style={{ width: '100%', gap: '10px' }}
                      >
                        <div className="total-section">
                          <div
                            className="flex items-center"
                            style={{ gap: '10px' }}
                          >                             
                            <h5 className="card-heading"   style={{  color: el.color }}>{el.name}</h5>
                          </div>
                        </div>
    
                      </div>
                      <div className="total-count-desc">
                       <h5 className='heading-count'>{el.count}</h5>
                        <p
                          className="total-percent">
                          <span
                            className="flex items-center"
                            style={{color:el.color, fontWeight:'600', fontSize:'12px'}}
                            >
                            {el.arrow}&nbsp;{el.percent}%
                          </span>
                         
                        </p>
                        <p style={{fontSize:'12px', fontWeight:'500', marginLeft:'20px'}}>From the last month</p>
                      
                      </div>
                    </div>
                  ))
                : null}
            </>
    </div>
  )
}

export default TotalCard