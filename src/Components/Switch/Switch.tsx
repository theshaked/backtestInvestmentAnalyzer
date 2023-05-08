import { Dispatch, SetStateAction, useCallback } from "react";

interface SwitchProps {
  isChecked: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  label?: string;
}

const Switch = (props: SwitchProps) => {
  const handleOnChange = useCallback(() => {
    props.onChange(!props.isChecked);
  }, [props.isChecked]);

  return (
    <div className="flex justify-between">
      {props.label && (
        <span className="ml-3 text-sm font-medium text-foreground">
          {props.label}
        </span>
      )}
      <label className="relative flex cursor-pointer">
        <input
          type="checkbox"
          value=""
          checked={props.isChecked}
          onChange={handleOnChange}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 rounded-full bg-secondary after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full " />
      </label>
    </div>
  );
};

export default Switch;
