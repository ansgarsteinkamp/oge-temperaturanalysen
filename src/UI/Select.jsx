import clsx from "clsx";

const Select = ({ label, value, options, onChange, className }) => {
   return (
      <div className={clsx("flex items-start", className)}>
         <label>
            <p className="ml-0.5 mb-1 font-semibold">{label}</p>

            <select className="cursor-pointer" value={value} onChange={onChange}>
               <option value=""></option>
               {options.map(el => (
                  <option key={el.id} value={el.id}>
                     {el.name}
                  </option>
               ))}
            </select>
         </label>
      </div>
   );
};

export default Select;
