import ReactSlider from "react-slider";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number | number[];
  onChange: (value: number | number[]) => void;
}

const Slider = (props: SliderProps) => {
  const handleChange = (newValue: number[]) => {
    props.onChange(newValue);
  };

  return (
    <ReactSlider
      className="slider h-8 w-full"
      min={props.min}
      max={props.max}
      step={props.step}
      value={Array.isArray(props.value) ? props.value : [props.value]}
      onChange={handleChange}
      renderThumb={(props, state) => (
        <div
          {...props}
          className={
            "flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-primary text-foreground outline-none active:cursor-grabbing"
          }
        >
          {state.valueNow}
        </div>
      )}
      renderTrack={(props, state) => (
        <div
          {...props}
          className={`top-1/2 h-1 rounded-full  ${
            state.index === 0 ||
            state.index === state.value.length ||
            typeof state.value === "number"
              ? "bg-secondary"
              : "bg-primary-light"
          }`}
        ></div>
      )}
    />
  );
};

export default Slider;
