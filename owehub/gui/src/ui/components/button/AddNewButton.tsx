/**
 * Created by Ankit Chuahan on 17/01/24
 * File Name: ActionButton
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/components/button
 */

import React from 'react';
import './ActionButton.css';
import { ICONS } from '../../../resources/icons/Icons';

interface ActionButtonProps {
  title: string;
  onClick: () => void;
}

export const AddNewButton = (props: ActionButtonProps) => {
  const { title, onClick } = props;
  return (
    <div className="iconsSection2 iconSection2-mobile">
      <button
        type="button"
        style={{}}
        // className="hover-btn"
        onClick={onClick}
      >
        <img
          src={ICONS.AddIcon}
          alt=""
          style={{ width: '14px', height: '14px' }}
        />{' '}
        <span className="mobileTitle">{title}</span>
      </button>
    </div>
  );
};
