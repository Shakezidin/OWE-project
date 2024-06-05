import React from 'react';
import { ICONS } from '../../icons/Icons';


const DashboardTotal: React.FC = () => {
  const data = [
    {
      doller: '$120,450',
      paid: 'Amount Prepaid',
      img: ICONS.rep1,
      border: '1px solid #63BC51',
      boxBorder: '0.5px solid #63BC51',
      background: ICONS.tot1
    },
    {
      doller: '$100,320',
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      border: '1px solid #D768A8',
      boxBorder: '0.5px solid #D768A8',
      background: ICONS.tot2
    },
    {
      doller: '$100,320',
      paid: 'Current Due',
      img: ICONS.rep3,
      border: '1px solid #3993D0',
      boxBorder: '0.5px solid #3993D0',
      background: ICONS.tot3
    },
  ];
  return (
    <>
      <div className="">
        <div className="commission-section-dash">
          {data.length > 0
            ? data.map((el, i) => (
                <div
                  className="total-commisstion "
                  style={{
                    backgroundImage: `url(${el.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="total-section">
                    <p>{el.paid}</p>
                    <h4>{el.doller}</h4>
                  </div>
                  <div
                    className="teamImg"
                  >
                    <img src={el.img} alt="" />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default DashboardTotal;
