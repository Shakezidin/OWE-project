import React from 'react';
import '../breadcrumb/breadcrumb.css';
import { Link, useNavigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import useMatchMedia from '../../../hooks/useMatchMedia';
interface textProps {
  head: string;
  linkPara: string;
  linkparaSecond: string;
  route: string;
  marginLeftMobile?: string; // Added optional marginLeftMobile prop
  cssStyles?:React.CSSProperties
}

const Breadcrumb: React.FC<textProps> = ({
  head,
  linkPara,
  linkparaSecond,
  route,
  marginLeftMobile = '0', // Default value for marginLeftMobile,
  cssStyles
}) => {
  const navigate = useNavigate();
  const isMobile = useMatchMedia('(max-width: 767px)');

  return (
    <div
      className="breadcrumb-container"
      style={{
        marginLeft: isMobile ? marginLeftMobile : '0',
        ...cssStyles
      }}
    >
      <div className="bread-link">
        <div
          className=""
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(route)}
        >
          <h3>{linkPara}</h3>
        </div>
        {/* <GoChevronRight style={{ color: '#8688A0' }} /> */}
        <div className="">
          <p style={{ color: '#04a5e8', fontSize: '14px' }}>{linkparaSecond}</p>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
