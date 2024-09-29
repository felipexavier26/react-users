import React from 'react';
import './input.css';

function Input({ type, text, name, placeholder, value, onChange }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{text}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-control"
                required
            />
        </div>
    );
}
export default Input;