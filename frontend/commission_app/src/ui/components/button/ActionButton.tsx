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
  onClick: () => void;
}

export const ActionButton = (props: ActionButtonProps) => {
  return (
    <button className="loginButton" onClick={props.onClick}>
      {props.title}
    </button>
  );
};
