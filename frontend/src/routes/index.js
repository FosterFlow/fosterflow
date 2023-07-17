import React, { Suspense } from 'react';
import { Routes as SwitchRoute, Route, Navigate } from 'react-router-dom';
import { isUserAuthenticated } from '../helpers/authUtils';

//import routes
import { authProtectedRoutes, authRoutes, publicRoutes } from './routes';
import { connect } from "react-redux";

//import layouts
import NonAuthLayout from "../layouts/NonAuth";
import AuthLayout from "../layouts/AuthLayout/";

const AuthProtected = (props) => {
  
      //TODO: check number of invokes
      if (!isUserAuthenticated() ) {
            return (
                <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
            );
        }
  
    return <>{props.children}</>;
  };

const AuthRoutes = (props) => {
  
      //TODO: check number of invokes
      if (isUserAuthenticated() ) {
            return (
                <Navigate to={{ pathname: "/chats", state: { from: props.location } }} />
            );
        }
  
    return <>{props.children}</>;
  };

/**
 * Main Route component
 */
const Routes = () => {

    return (
        // rendering the router with layout
        <React.Fragment>
            <Suspense fallback = {<div></div>} >
                <SwitchRoute>
                    {/* public routes */}
                    {authRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={NonAuthLayout} 
                            element={
                                <AuthRoutes>
                                    <NonAuthLayout>{route.component}</NonAuthLayout>
                                </AuthRoutes>
                            }
                            key={idx} 
                        />
                    )}

                    {/* private/auth protected routes */}
                    {authProtectedRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={AuthLayout} 
                            element={
                                <AuthProtected>
                                    <AuthLayout>
                                        {route.component}
                                    </AuthLayout>
                                </AuthProtected>
                            }
                            key={idx} 
                        />
                    )}

                    {/* public routes */}
                    {publicRoutes.map((route, idx) =>
                        <Route 
                            path={route.path} 
                            layout={AuthLayout} 
                            element={
                                <NonAuthLayout>{route.component}</NonAuthLayout>
                            }
                            key={idx} 
                        />
                    )}
                </SwitchRoute>
            </Suspense>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const areAuthTokensNull = state.Auth.tokens === null;
    return {
        //cause re-render of the router if user was authentificated or logout
        areAuthTokensNull: areAuthTokensNull
    }
  };
  
  export default connect(mapStateToProps)(Routes);
