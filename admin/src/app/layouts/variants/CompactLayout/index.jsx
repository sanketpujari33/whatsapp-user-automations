import { BaseLayout } from "components/layouts";

const config = {
  header: { showProfile: true, showNavLinks: false, borderBottom: true },
  sidebar: { variant: "single", visible: true, compact: true },
  contentClass: "p-7 grid grid-cols-1"
};

export default function CompactLayout() {
  return <BaseLayout config={config} />;
}
