import React, { memo, useEffect, useRef, useState } from 'react';
import '../styles/pendrev.css';
import { ICONS } from '../../../resources/icons/Icons';
import SortingDropDown from './SortingDropdown/SortingDropDown';
import PendingSurvey from './PendingSurvey';
const PendingReview = () => {
  return (
    <div className="pen-rev">
      <div className="pen-rev-top">
        <div className="pr-namesec">
          <img src={ICONS.BellPr} alt="" />
          <div className="notific">
            <p>12</p>
          </div>
          <div className="pr-nameadd">
            <h1>Pending Review</h1>
            <p>New jobs need to review</p>
          </div>
        </div>
        <SortingDropDown />
      </div>
      <hr className="figma-line" />

      <div className="pen-rev-bot">
        <PendingSurvey />
        <PendingSurvey />
        <PendingSurvey />
        <PendingSurvey />
        <PendingSurvey />
      </div>
    </div>
  );
};

export default memo(PendingReview);
