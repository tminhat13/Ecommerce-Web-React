import { FormModal } from "../../components/modal/modal";
import "./header.css";
import { CartForm } from "../../components/cartModal/cartModal";

export const Header = () => {
  return (
    <div className="app-header">
      <div className="headerTitle">
        <h1 className="headerTitle">Management</h1>
      </div>
      <div className="searchBox">
        <input type="text" className="searchTerm" placeholder="Search" />
      </div>
      <div className="tools-container">
        <FormModal />
        {/* <CartForm /> */}
      </div>
    </div>
  );
};
