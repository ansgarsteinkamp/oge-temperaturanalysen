import clsx from "clsx";

const Select = ({ label, value, options, onChange, className, leereOption = false, minWidth = null }) => {
   return (
      <div className={clsx("flex items-start", className)}>
         <label>
            <p className="ml-1 mb-1 font-semibold">{label}</p>

            <select className={clsx("cursor-pointer", minWidth)} value={value} onChange={onChange}>
               {leereOption && <option value=""></option>}
               {options.map(el => (
                  <option key={el.id} value={el.id}>
                     {el.label}
                  </option>
               ))}
            </select>
         </label>
      </div>
   );
};

export default Select;
