import { ChangeEvent, FC, HTMLAttributes, InputHTMLAttributes } from 'react';
import './Input.css';
import { ReactComponent as EYE_ICON } from '../../../resources/assets/eye-icon.svg';
import { ReactComponent as EYE_OFF_ICON } from '../../../resources/assets/eye-off-icon.svg';
import { ICONS } from '../../icons/Icons';
import { FormInput } from '../../../core/models/data_models/typesModel';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'datetime-local'
    | 'file';
  value: string | number;
  placeholder: string;
  label?: string;
  name: string;
  error?: boolean;
  disabled?: boolean;

  onChange: (e: FormInput) => void;
  onClickEyeIcon?: () => void;
  isTypePassword?: boolean;
  isTypeSearch?: boolean;
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
  ...rest
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="inputLabel">{label}</label>}
      <div className="input-inner-view">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          value={value}
          onChange={(e) => {
            if (name.includes('unique')) {
              const trim = e.target.value.trim();
              e.target.value = trim;
            }
            return typeof onChange !== 'undefined' &&
              !e.target.value.startsWith(' ')
              ? onChange(e)
              : undefined;
          }}
          className="input"
          disabled={disabled}
          {...rest}
        />
        {isTypePassword && type === 'text' ? (
          <EYE_ICON
            className="eyeIcon"
            style={{ marginRight: '0.5rem' }}
            onClick={onClickEyeIcon}
          />
        ) : (
          <></>
        )}
        {isTypePassword && type === 'password' ? (
          <EYE_OFF_ICON
            className="eyeIcon"
            style={{ marginRight: '0.5rem' }}
            onClick={onClickEyeIcon}
          />
        ) : (
          <></>
        )}
        {isTypeSearch ? (
          <img
            className="eyeIcon"
            src={ICONS.search}
            style={{ marginRight: '.5rem' }}
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
