import Button from "../Button/Button";
import TextEntry from "../TextEntry/TextEntry";

interface SignUpProps {}

const SignUp = (props: SignUpProps) => {
  return (
    <form className="space-y-3 p-2">
      <span className="text-3xl">Create your account</span>
      <div className="grid gap-3 md:grid-cols-2">
        <TextEntry label="First Name" />
        <TextEntry label="Last Name" />
      </div>
      <TextEntry label="Email" />
      <TextEntry label="Password" />
      <TextEntry label="Confirm Password" />

      <Button
        onClick={() => {
          console.log("boi");
        }}
        children={"Submit"}
        primaryColor
      />
    </form>
  );
};

export default SignUp;
