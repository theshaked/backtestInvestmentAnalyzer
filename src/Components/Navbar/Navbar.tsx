import { Link, Outlet } from "react-router-dom";
import Button from "../Button/Button";

interface NavbarProps {
  title: string;
  links: { label: string; url: string }[];
}

const Navbar = (props: NavbarProps) => {
  return (
    <div className="z-3 fixed top-0 flex h-12 w-full flex-grow items-center bg-secondary-dark text-center align-middle ">
      <img className="m-1 w-12" src="Backtest Investment Analyzer Logo.png" />
      <div className="flex">
        {props.links.map((link) => (
          <Link
            className="rounded px-4 py-2 text-lg text-foreground transition-all duration-500 ease-out hover:rounded-lg hover:bg-primary hover:bg-opacity-80"
            key={link.label}
            to={link.url}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex gap-2">
        <Button onClick={() => console.log("Login onClick")} children="Login" />
        <Button
          onClick={() => console.log("Sign up onClick")}
          children="Sign up"
          primaryColor
        />
      </div>

      <Outlet />
    </div>
  );
};

export default Navbar;
