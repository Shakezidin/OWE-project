/**
 * Created by satishazad on 17/01/24
 * File Name: ActionButton
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/components/button
 */

import React from "react";
import "./ActionButton.css";
import { ICONS } from "../../icons/Icons";

interface ActionButtonProps {
  title: string;
  onClick: () => void;
}

export const AddNewButton = (props: ActionButtonProps) => {
  const { title, onClick } = props;
  return (
   <div className="add_view_button" onClick={onClick}>
    <img src={ICONS.AddIcon} alt=""/>
    <br/>
     <button
      type={'button'}
    >
      {title}
    </button>
   </div>
  );
};
