/**
 * Created by satishazad on 17/01/24
 * File Name: ActionButton
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/components/button
 */

import React from "react";
import "./ActionButton.css";

interface ActionButtonProps {
  title: string;
  type:"submit"|"button"|"reset",
  onClick: () => void;
 
}

export const ActionButton = (props: ActionButtonProps) => {
  return (
    <button
    style={{color:props?.title?.toLowerCase()==="reset"?"#0493ce":""}}
     className={props?.title?.toLowerCase()==="cancel"||props?.title?.toLowerCase()==="reset"?"cancel":"loginButton"}   onClick={props.onClick} type={props.type}>
      {props.title}
    </button>
  );
};
