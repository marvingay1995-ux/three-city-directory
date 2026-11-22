import { DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import ProfileEditorDemo from "../../components/profile-editor-demo";
export default function ProfileEditorPage() {
  return <div className="shell"><DirectoryHeader/><main id="main-content" tabIndex={-1}><ProfileEditorDemo/></main><DirectoryFooter/></div>;
}
