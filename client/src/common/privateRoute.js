import { Navigate } from 'react-router-dom';

const PrivateRoute = props => {
    const auth = true

    return auth ? (<div>{props.children}</div>) : <Navigate to="/login" />
}

export default PrivateRoute