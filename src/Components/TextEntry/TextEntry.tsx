interface TextEntryProps {
  label: string;
  hint?: string;
}

const TextEntry = (props: TextEntryProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        id={props.label.replaceAll(" ", "_")}
        className="peer block w-full appearance-none rounded bg-secondary-dark px-2.5 pb-2.5 pt-5 text-base text-foreground focus:outline focus:outline-secondary-light"
        placeholder=" "
        required
      />
      <label
        htmlFor={props.label.replaceAll(" ", "_")}
        className="pointer-events-none absolute top-4 left-2.5 z-10 mb-1 block origin-[0] -translate-y-4 scale-75 transform text-sm font-medium text-secondary-lighter duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-lighter"
      >
        {props.label}
      </label>
    </div>
  );
};

export default TextEntry;
