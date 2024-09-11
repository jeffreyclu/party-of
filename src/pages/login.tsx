import { useState } from 'react';
import { User } from 'firebase/auth';
import { auth, provider, signInWithPopup, signOut } from '../firebase';


const Login = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.error("Error logging in: ", error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div>
      {user !== null ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          {user.photoURL && user.displayName && <img src={user.photoURL} alt={user.displayName} />}
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Login;
