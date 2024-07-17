import React, { Dispatch, SetStateAction, useState } from 'react';
import award from '../../../../resources/assets/award_icon.png';
import {
  Dollar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import { BsFillTriangleFill } from 'react-icons/bs';
const categories = [
  { name: 'Sale', key: 'sale' },
  { name: 'NTP', key: 'ntp' },
  { name: 'Active', key: 'active' },
  { name: 'Install', key: 'install' },
];
const Table = ({setIsOpen}:{setIsOpen:Dispatch<SetStateAction<boolean>>}) => {
  const [active, setActive] = useState(categories[0].key);
  const [activeHead, setActiveHead] = useState('kw');
  return (
    <div className="bg-white mt4 px3 pt3" style={{ borderRadius: 12 }}>
      <div className=" mt1 flex items-center">
        <img src={award} alt="" width={19} height={19} />
        <h2 className="h3 ml2" style={{ fontWeight: 600 }}>
          Leaderboard
        </h2>
      </div>
      <div className="flex mt2 mb3 items-center">
        <div className="leaderboard-category-container flex items-center">
          {categories.map((category) => {
            return (
              <div
                key={category.name}
                onClick={() => setActive(category.key)}
                className={`leaderboard-category ${active === category.key ? 'category-active' : ''}`}
              >
                {category.name}
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb3">
        <div className="leaderboard-table-container">
          <table className="leaderboard-table ">
            <thead>
              <tr>
                <th>Rank</th>

                <th>Name</th>

                <th>Sales</th>
                <th>
                  <div className="leaderbord-tab-container flex items-center">
                    <div
                      onClick={() => setActiveHead('kw')}
                      className={` tab ${activeHead === 'kw' ? 'activehead' : ''}`}
                    >
                      KW
                    </div>
                    <div
                      onClick={() => setActiveHead('count')}
                      className={` tab ${activeHead === 'count' ? 'activehead' : ''}`}
                    >
                      Count
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center">
                    <FirstAwardIcon />
                    <BsFillTriangleFill
                      size={8}
                      className="ml1"
                      color="#25D221"
                    />
                  </div>
                </td>
                <td>
                  <span className='pointer' onClick={()=>setIsOpen(true)}>
                  Royal Arkin
                  </span>
                  </td>

                <td>45</td>
                <td>1265.65</td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center">
                    <SecondAwardIcon />
                    <BsFillTriangleFill
                      size={8}
                      className="ml1"
                      color="#25D221"
                    />
                  </div>
                </td>
                <td>
                <span className='pointer'onClick={()=>setIsOpen(true)}>
                  Royal Arkin
                  </span>
                </td>

                <td>45</td>
                <td>1265.65</td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center">
                    <ThirdAwardIcon />
                    <BsFillTriangleFill
                      style={{ rotate: '180deg' }}
                      size={8}
                      className="ml1"
                      color="#EB2222"
                    />
                  </div>
                </td>
                <td><span className='pointer'onClick={()=>setIsOpen(true)}>
                  Royal Arkin
                  </span></td>

                <td>97</td>
                <td>1265.65</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
