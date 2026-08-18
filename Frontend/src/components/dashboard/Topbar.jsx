import "./Topbar.css";
import { Search, Bell, Settings } from "lucide-react";
import Avatar from "../ui/Avatar";

function Topbar() {
  return (
    <header className="topbar">

      <div className="topbar-left">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="topbar-right">
        <Bell size={20} />

        <Settings size={20} />

        <Avatar
          name="Vishal Prajapati"
          size={40}
        />
      </div>

    </header>
  );
}

export default Topbar;