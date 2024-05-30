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
  customRegex?: string;
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
  customRegex,
  ...rest
}) => {
  const validationRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customRegex) {
      const pattern = new RegExp(customRegex, 'g');
      e.target.value = e.target.value.replaceAll(pattern, '');
    } else {
      if (
        type === 'text' &&
        !(name.includes('email') || isTypePassword)
      ) {
        e.target.value = e.target.value.replaceAll(
          /[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF_\- $,\.]| {2,}/g,
          ''
        );
      }
    }
    if (e.target.value.length < 100) {
      onChange(e);
    }
  };
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
              ? validationRules(e)
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
