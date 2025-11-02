import logo from "../assets/north-star-logo.jpg";

export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logo} alt="North Star Logo" className="header-logo" />
        <div>
          <h2>North Star</h2>
          <p>Cinema Management</p>
        </div>
      </div>
      <div className="header-right">
        <p>Owner Access</p>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
