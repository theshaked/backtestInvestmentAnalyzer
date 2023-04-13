import { useEffect, useState } from "react";
import Button from "../Button/Button";
import TextEntry from "../TextEntry/TextEntry";

interface SignUpProps {}

const SignUp = (props: SignUpProps) => {
  const [firstName, setFirstName] = useState("");
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameValid, setLastNameValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameValid, setUserNameValid] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const isFormValid = () => {
    return (
      firstNameValid &&
      lastNameValid &&
      userNameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const formData = {
        firstName,
        lastName,
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

  useEffect(() => {
    setConfirmPasswordValid(password === confirmPassword && passwordValid);
  }, [password, confirmPassword, passwordValid]);

  return (
    <form className="space-y-3 p-2">
      <span className="text-3xl">Create your account</span>
      <div className="grid gap-3 md:grid-cols-2">
        <TextEntry
          label="First Name"
          type="lettersWithSpaces"
          onChange={setFirstName}
          setIsTextValid={setFirstNameValid}
        />
        <TextEntry
          label="Last Name"
          type="lettersWithSpaces"
          onChange={setLastName}
          setIsTextValid={setLastNameValid}
        />
      </div>
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
      {/* TODO add a password strength indicator to help users create stronger passwords. */}
      <TextEntry
        type="password"
        label="Password"
        onChange={setPassword}
        setIsTextValid={setPasswordValid}
      />
      <TextEntry
        type="password"
        label="Confirm Password"
        onChange={setConfirmPassword}
        valid={confirmPasswordValid}
      />

      <Button
        onClick={handleSubmit}
        children={"Submit"}
        primaryColor
        disabled={!isFormValid()}
      />
    </form>
  );
};

export default SignUp;
