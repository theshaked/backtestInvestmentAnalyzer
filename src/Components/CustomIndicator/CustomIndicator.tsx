import { useState } from "react";
import Slider from "../Slider/Slider";
import Switch from "../Switch/Switch";

interface CustomIndicatorProps {
  sliderText: string;
  SliderValues: number | number[];
  setSliderValues: (value: number | number[]) => void;
  isUsing: boolean;
  setIsUsing: React.Dispatch<React.SetStateAction<boolean>>;
  range: { min: number; max: number };
  step: number;
}

const CustomIndicator = (props: CustomIndicatorProps) => {
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-base text-foreground">{props.sliderText}</h2>
        <Switch
          isChecked={props.isUsing}
          onChange={props.setIsUsing}
          label={"Use Indicator"}
        />
      </div>
      <Slider
        value={props.SliderValues}
        min={props.range.min}
        max={props.range.max}
        onChange={props.setSliderValues}
        step={props.step}
      />
    </div>
  );
};

export default CustomIndicator;
