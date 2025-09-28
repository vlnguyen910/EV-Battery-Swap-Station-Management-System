import { Link } from 'react-router-dom';

// Navigation component
export default function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/stations">Stations</Link></li>
        <li><Link to="/batteries">Batteries</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
  );
}