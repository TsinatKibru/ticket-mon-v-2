import { useState, useEffect } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label py-1">
        <span className={"label-text text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input w-full bg-white/[0.03] border-white/10 rounded-xl focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 text-sm h-12"
      />
    </div>
  );
}

export default InputText;
