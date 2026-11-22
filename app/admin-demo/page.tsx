import { DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import AdminDemo from "../../components/admin-demo";
export default function AdminDemoPage() {
  return <div className="shell"><DirectoryHeader/><main id="main-content" tabIndex={-1}><AdminDemo/></main><DirectoryFooter/></div>;
}
