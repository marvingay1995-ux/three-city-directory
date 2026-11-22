import { DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import AccountDemo from "../../components/account-demo";
export default function AccountPage() {
  return <div className="shell"><DirectoryHeader/><main id="main-content" tabIndex={-1}><AccountDemo/></main><DirectoryFooter/></div>;
}
