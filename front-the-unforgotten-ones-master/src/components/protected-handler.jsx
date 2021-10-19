import React from 'react';
import Link from '@material-ui/core/Link';

const ProtectedHandler = ({ history }) => {
  const session = useContext(SessionContext);
  if (session.email === undefined) {
    history.push('/login');
  }
  return (
    <div>
      <h6>Protected data for {session.email}</h6>
      <Link to="/logout">Logout here</Link>
    </div>
  );
};

export default ProtectedHandler;
