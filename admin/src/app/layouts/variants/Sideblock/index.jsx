import { BaseLayout } from "components/layouts";

const config = {
  header: { showProfile: true, showNavLinks: true, borderBottom: true },
  sidebar: { variant: "single", visible: true },
  contentClass: "p-7 grid grid-cols-1"
};

export default function Sideblock() {
  return <BaseLayout config={config} />;
}
