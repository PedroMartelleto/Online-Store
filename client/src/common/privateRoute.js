import { Navigate } from 'react-router-dom';

const PrivateRoute = (component) => {
    const auth = false; //your logic

    return auth ? <component /> : <Navigate to="/login" />
}

export default PrivateRoute