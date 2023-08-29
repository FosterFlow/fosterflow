import React, { Suspense } from 'react';
import { 
    Routes as SwitchRoute,
    Route, 
    Navigate, 
    useLocation, 
} from 'react-router-dom';
import { 
    authProtectedRoutes, 
    authRoutes, 
    publicRoutes 
} from './routes';
import { connect } from "react-redux";
import NonAuthLayout from "../layouts/NonAuth";
import AuthLayout from "../layouts/AuthLayout/";

/**
 * Main Route component
 */
const Routes = (props) => {
    const location = useLocation();
    const { 
        isAuthenticated,
        confirmEmailSuccess
    } = props;
    
    const emailVerifyPattern = /\/email-verify\/([^/]+)/;
    const emailVerifyTokenPattern = /\/email-verify-token\/([^/]+)/;
    const matchEmailVerifyPattern = location.pathname.match(emailVerifyPattern);
    const matchEmailVerifyTokenPattern = location.pathname.match(emailVerifyTokenPattern);
    
    const isAuthRoute = authRoutes.some(route => route.path === location.pathname);
    const isAuthProtectedRoute = authProtectedRoutes.some(route => route.path === location.pathname);

    //Email verification
    if (matchEmailVerifyPattern) {
        const token = matchEmailVerifyPattern[1];
        if (isAuthenticated) {
            return <Navigate to={{ pathname: `/chats/email-verify-token/${token}`, state: { from: location } }} />;
        }
     
        return <Navigate to={{ pathname: `/login/email-verify-token/${token}`, state: { from: location } }} />;
    }

    //After successfull email validation
    if (matchEmailVerifyTokenPattern && confirmEmailSuccess) {
        if (isAuthenticated) {
            return <Navigate to={{ pathname: `/chats`, state: { from: location } }} />;
        }
        return <Navigate to={{ pathname: `/login`, state: { from: location } }} />;
    }

    //Redirect in case if user not authenticated and tried to reach protected route
    if (!isAuthenticated && isAuthProtectedRoute) {
        return <Navigate to={{ pathname: "/login", state: { from: location } }} />;
    }

    //Redirect in case if user is authenticated and tried to reach auth route like login or register
    if (isAuthenticated && isAuthRoute) {
        return <Navigate to={{ pathname: "/chats", state: { from: location } }} />;
    }

    return (
        // rendering the router with layout
        <React.Fragment>
            {/* TODO add styled loading page */}
            <Suspense fallback={<div>Loading...</div>} >
                <SwitchRoute>
                    {/* public routes */}
                    {authRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={NonAuthLayout} 
                            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
                            key={idx} 
                        />
                    )}

                    {/* private/auth protected routes */}
                    {authProtectedRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={AuthLayout} 
                            element={<AuthLayout>{route.component}</AuthLayout>}
                            key={idx} 
                        />
                    )}

                    {/* public routes */}
                    {publicRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={AuthLayout} 
                            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
                            key={idx} 
                        />
                    )}
                </SwitchRoute>
            </Suspense>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        //cause re-render of the router if user was authenticated or logout
        isAuthenticated: state.Auth.isAuthenticated,
        confirmEmailSuccess: state.Auth.confirmEmailSuccess
    }
};

export default connect(mapStateToProps)(Routes);