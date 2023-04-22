import { useState } from "react";
import Button from "../Button/Button";
import TextEntry from "../TextEntry/TextEntry";

interface LoginProps {}

const Login = (props: LoginProps) => {
  const [userName, setUserName] = useState("");
  const [userNameValid, setUserNameValid] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const isFormValid = () => {
    return userNameValid && emailValid && passwordValid;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const formData = {
        userName,
        email,
        password,
      };
      //TODO Call your function to submit form data here
      // e.g. submitFormData(formData)
    } else {
      //  Form data is invalid,TODO display error message
      console.log("Form data is invalid");
    }
  };

  return (
    <form className="space-y-3 p-2">
      <span className="text-3xl">Login to your account</span>
      <TextEntry
        type="lettersNoSpaces"
        label="User Name"
        onChange={setUserName}
        setIsTextValid={setUserNameValid}
      />
      <TextEntry
        type="email"
        label="Email"
        onChange={setEmail}
        setIsTextValid={setEmailValid}
      />
      <TextEntry
        type="password"
        label="Password"
        onChange={setPassword}
        setIsTextValid={setPasswordValid}
      />
      <Button
        onClick={handleSubmit}
        children={"Login"}
        primaryColor
        disabled={!isFormValid()}
      />
    </form>
  );
};

export default Login;
