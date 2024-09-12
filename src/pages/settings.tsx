import { Link } from "react-router-dom";

export default function Settings () {
    return (
        <div>
            <h1>Settings</h1>
            <ul>
                <li>
                    <Link to="/map">Map</Link>
                </li>
                <li>
                    <Link to="/favorites">Favorites</Link>
            </li>
        </ul>
        </div>
    );
}