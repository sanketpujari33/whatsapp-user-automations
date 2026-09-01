import { BaseLayout } from "components/layouts";

const config = {
  header: { showProfile: true, showNavLinks: true, borderBottom: true },
  sidebar: { visible: false },
  contentClass: "p-7 grid grid-cols-1"
};

export default function HorizontalLayout() {
  return <BaseLayout config={config} />;
}
