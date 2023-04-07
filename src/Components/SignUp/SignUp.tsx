import Button from "../Button/Button";
import TextEntry from "../TextEntry/TextEntry";

interface SignUpProps {}

const SignUp = (props: SignUpProps) => {
  return (
    <form className="space-y-3 p-2">
      <span className="text-3xl">Create your account</span>
      <div className="grid gap-3 md:grid-cols-2">
        <TextEntry
          label="First Name"
          type="lettersWithSpaces"
          onChange={console.log}
        />
        <TextEntry
          label="Last Name"
          type="lettersWithSpaces"
          onChange={console.log}
        />
      </div>
      <TextEntry
        type="lettersNoSpaces"
        label="User Name"
        onChange={console.log}
      />
      <TextEntry type="email" label="Email" onChange={console.log} />
      {/* TODO add a password strength indicator to help users create stronger passwords. */}
      <TextEntry type="password" label="Password" onChange={console.log} />
      <TextEntry
        type="password"
        label="Confirm Password"
        onChange={console.log}
      />

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
