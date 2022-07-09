import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../api';
import { ROUTES } from '../App';

const PrivateRoute = props => {
    const { authenticated } = useContext(AuthContext)

    return authenticated ? (<div>{props.children}</div>) : <Navigate to={ROUTES.login} />
}

const AdminRoute = props => {
    const { authenticated, isAdmin } = useContext(AuthContext)

    return authenticated && isAdmin ? (<div>{props.children}</div>) : <Navigate to={ROUTES.login} />
}

export { PrivateRoute, AdminRoute }