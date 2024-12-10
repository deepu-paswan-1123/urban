import React, { useEffect, useRef, useState } from "react";

import "../../styles/Widget/dropdown.css";
import { FaSortDown } from "react-icons/fa";
export default function Dropdown({
  items,
  onSelect,
  currentValue,
  primary = false,
  icon,
  text,
  style,
  placeholder,
  disabledItems = [],
}) {
  const [value, setValue] = useState("");

  function onChange(value) {
    setOpen(false);

    if (disabledItems.includes(value)) return;
    setValue(value);
    if (onSelect) onSelect(value);
  }

  useEffect(() => {
    setValue(currentValue ? currentValue : items[0].value);
  }, [currentValue]);

  const [open, setOpen] = useState(false);

  function getValueText(value) {
    const item = items.find((item) => item.value == value);
    return item ? item.name : "";
  }

  return (
    <div className="simple-dropdown" >
      {/* <select defaultValue={value} onChange={(e) => onChange(e.target.value)}>
        {items.map((value, index) =>  <option key={index} value={value.value}>{value.name}</option>)}

      </select> */}
      <div
        className={
          primary ? "dropdown-input primary hover" : "dropdown-input hover"
        }
        style={style}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <span className="fade-text">{!getValueText(value) && !text && placeholder}</span>
        <span >{text ? text : getValueText(value)}</span>
        <FaSortDown className="mb-1 ml-3" />
      </div>
      {open && (
        <div className="dropdown-items" >
          {items.map((child, index) => (
            <span
              className={disabledItems.includes(child.value) ? "disabled" : ""}
              onClick={(e) => onChange(e.target.dataset.value)}
              key={index}
              // style={style}
              data-value={child.value}
            >
              {child.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
