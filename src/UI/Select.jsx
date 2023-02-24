import clsx from "clsx";

const Select = ({ label, value, options, onChange, className, leereOption = false }) => {
   return (
      <div className={clsx("flex items-start", className)}>
         <label>
            <p className="ml-0.5 mb-1 font-semibold">{label}</p>

            <select className="cursor-pointer" value={value} onChange={onChange}>
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
