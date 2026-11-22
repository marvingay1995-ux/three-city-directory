import { DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import DashboardDemo from "../../components/dashboard-demo";
export default function DashboardPage() {
  return <div className="shell"><DirectoryHeader/><main id="main-content" tabIndex={-1}><DashboardDemo/></main><DirectoryFooter/></div>;
}
