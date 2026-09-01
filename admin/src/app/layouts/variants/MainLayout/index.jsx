import { BaseLayout } from "components/layouts";

const config = {
  header: { showProfile: true, showNavLinks: true, borderBottom: true },
  sidebar: { variant: "dual-panel", visible: true },
  contentClass: "p-7 grid grid-cols-1"
};

export default function MainLayout() {
  return <BaseLayout config={config} />;
}
