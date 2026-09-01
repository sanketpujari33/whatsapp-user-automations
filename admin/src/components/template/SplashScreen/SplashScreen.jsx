// Local Imports
// import Logo from "assets/imgFullLogo.svg?react";
import dream1_logo from "assets/logo/AdminLogo.png"
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
      {/* <Logo className="size-28" /> */}
      <img src={dream1_logo} alt="" />
      <Progress
        color="secondary"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
