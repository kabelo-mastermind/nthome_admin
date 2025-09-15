import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidebarTitle = ({ isMobile, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (toggleSidebar) toggleSidebar(); // optional: close sidebar
    navigate("/"); // go to home page
  };

  return (
    <div
      className="sidebar-title"
      onClick={handleClick}
      style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
    >
      <FaHome className="icon home_icon" />
      <h3 style={{ margin: 0 }}>Nthome</h3>
    </div>
  );
};

export default SidebarTitle;
