import { Console } from "console";
import { HTMLInputTypeAttribute, useEffect, useMemo, useState } from "react";

interface TextEntryProps {
  label: string;
  hint?: string;
  type?: TextEntryType;
  onChange: Function;
  valid?: boolean;
  setIsTextValid?: Function;
}

//ReplacePositiveLookaheads is still buggy - please fix it or thoroughly test it with test cases.
const ReplacePositiveLookaheads = (regexString: string) => {
  const positiveLookaheads =
    regexString.match(/(?<=\(\?=.*\[)[^\]]+(?=\])/g) || [];
  const newString = `[${positiveLookaheads.join("")}]`;
  const regexWithoutLookaheads = RemovePositiveLookaheads(regexString);
  const index = regexWithoutLookaheads.indexOf("^") + 1;
  return (
    regexWithoutLookaheads.slice(0, index) +
    newString +
    regexWithoutLookaheads.slice(index)
  );
};

const RemovePositiveLookaheads = (regexString: string) => {
  const regexWithoutLookaheads = regexString.replace(
    /\(\?=\.\*\[[^\]]+\]\)/g,
    ""
  );
  return regexWithoutLookaheads;
};

const PartiallyTypedRegex = (regex: RegExp) => {
  let regexString = regex.toString();
  regexString = RemovePositiveLookaheads(regexString);
  regexString = regexString.replace("^", "");
  regexString = regexString.replace("$", "");

  let result = "";
  let openParentheses = 0;
  for (let i = 1; i < regexString.length - 1; i++) {
    const char = regexString[i];
    // TODO: Fix the issue with the + and * operators causing the function to not work due to unnecessary parentheses.
    if (char === "+" || char === "*") {
      result += `${char}(`;
      openParentheses++;
    } else if (char === "[") {
      result += `(${char}`;
      openParentheses++;
    } else if (char === "{") {
      result += `{0`;
      i++;
    } else if (char === ")" && regexString[i + 1] === "(") {
      result += ")?";
    } else {
      result += char;
    }
  }
  for (let i = 0; i < openParentheses; i++) {
    result += ")?";
  }
  result = "^" + result + "$";
  return new RegExp(result);
};

type TextEntryType =
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "url"
  | "lettersWithSpaces"
  | "lettersNoSpaces";

const patternTypes: Record<TextEntryType, RegExp> = {
  // HTMLInputTypeAttribute:
  email: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
  number: /^[0-9]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
  search: /^.*$/,
  tel: /^[0-9]{10}$/,
  text: /^.*$/,
  url: /^(ftp|http|https):\/\/[^ "]+$/,
  // Custom
  lettersWithSpaces: /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/,
  lettersNoSpaces: /^[a-zA-Z0-9_-]{4,20}$/,
  // TODO: add Integer
};

const TextEntry = (props: TextEntryProps) => {
  const [text, setText] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(
    props.valid !== undefined ? props.valid : false
  );

  const validOutline = isValid
    ? "outline-none outline outline-success focus:outline-success"
    : "";

  useEffect(() => {
    if (props.valid !== undefined) {
      setIsValid(props.valid);
    } else {
      props.setIsTextValid && props.setIsTextValid(isValid);
    }
  }, [isValid, props.valid]);

  useEffect(() => {
    props.onChange(text);
    setIsValid(patternTypes[props.type ?? "text"].test(text));
  }, [text]);

  const partiallyTypedRegex = useMemo(
    //TODO add more pattern types like text
    () => PartiallyTypedRegex(patternTypes[props.type ?? "text"]),
    [props.type]
  );

  const HandleInputOnChange = (event: any) => {
    if (partiallyTypedRegex.test(event.target.value)) {
      setText(event.target.value);
    }
    // TODO add else pop up please enter valid char to user
  };

  return (
    <div className="relative">
      <input
        type={props.type ?? "text"}
        id={props.label.replaceAll(" ", "_")}
        className={`peer peer block w-full appearance-none rounded bg-secondary-dark px-2.5 pb-2.5 pt-5 text-base text-foreground focus:outline-none focus:outline focus:outline-secondary-light focus:ring-0 ${validOutline}`}
        placeholder=" "
        required
        value={text}
        onChange={HandleInputOnChange}
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
