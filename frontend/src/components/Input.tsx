import React, { ChangeEvent } from 'react';

type InputProps = {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ id, type, placeholder, value, onChange }) => {
  return (
    <div className='mb-4 w-5/6'>
      <label htmlFor={id} className='sr-only'>
        {placeholder}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:border-green-500 focus:ring-green-500 text-lg' // Increased text size
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
