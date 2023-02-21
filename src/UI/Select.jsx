const Select = ({ label, value, options, onChange, className }) => {
   return (
      <div className={className}>
         <label>
            {label}
            <select value={value} onChange={onChange}>
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
