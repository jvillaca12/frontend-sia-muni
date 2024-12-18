import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface CustomInputProps {
  className?: string;
  type: string;
  placeholder: string;
  icon?: IconProp;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  visiblePassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  className,
  type,
  placeholder,
  icon,
  value,
  onChange,
  name,
  visiblePassword = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      className={className}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{ position: 'absolute', left: '10px', fontSize: '1.5em' }}
        />
      )}
      <input
        type={isPasswordVisible && visiblePassword ? 'text' : type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        name={name}
        style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
      />
      { visiblePassword && (
        <FontAwesomeIcon
          icon={isPasswordVisible ? faEyeSlash : faEye}
          style={{ position: 'absolute', right: '10px', fontSize: '1.5em', cursor: 'pointer' }}
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

export default CustomInput;
