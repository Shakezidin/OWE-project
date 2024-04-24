import { ChangeEvent, FC } from "react";
import "./Input.css";
import { ReactComponent as EYE_ICON } from "../../../resources/assets/eye-icon.svg";
import { ICONS } from "../../icons/Icons";

interface InputProps {
  type: "text" | "number" | "email" | "password" | "date" |"datetime-local" | "file";
  value: string | number;
  placeholder: string;
  label?: string;
  name: string;
  error?: boolean;
  disabled?: boolean;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickEyeIcon?: () => void;
  isTypePassword?: boolean;
  isTypeSearch?:boolean
}

const Input: FC<InputProps> = ({
  type,
  value,
  placeholder,
  error,
  disabled,
  name,
  label,
  onChange,
  onClickEyeIcon,
  isTypePassword,
  isTypeSearch,
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="inputLabel">{label}</label>}
      <div className="input-inner-view">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input"
        />
        {isTypePassword ? (
          <EYE_ICON
            className="eyeIcon"
           style={{marginRight:"0.5rem"}}
            onClick={onClickEyeIcon}
          />
        ) : (
          <></>
        )}
          {isTypeSearch ? (
          <img
            className="eyeIcon"
            src={ICONS.search}
            style={{ marginRight: ".5rem" }}
            onClick={onClickEyeIcon}
            alt=""
          />
        ) : (
          <></>
        )}
      </div>
      {error && <p className="error">Input filed can't be empty!</p>}
    </div>
  );
};

export default Input;
