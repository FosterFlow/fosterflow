/**
 * Layout for pages for authorized users like dashboard pages
 */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import withRouter from '../../components/withRouter';
import {
    getAuthorizedUser, 
    getUserAgents,
} from '../../redux/actions';
import Alerts from "./Alerts";
import SidebarMenuDesktop from "./SidebarMenuDesktop";
import SidebarMenuMobile from "./SidebarMenuMobile";

const Index = (props) => {
    console.log ('Layouts Authout Layout index rendering');
    const {
        children,
        getAuthorizedUser,
        getUserAgents,
    } = props;

    useEffect(() => {
        document.title = "FosterFlow Chat";

        if (!document.body.classList.contains('mobileStickUrlBar')) {
            document.body.classList.add('mobileStickUrlBar');
        }

        if (!document.documentElement.classList.contains('overscrollYnone')) {
            document.documentElement.classList.add('overscrollYnone');
        }

        getAuthorizedUser();
        getUserAgents();
    }, []);

    return (
        <React.Fragment>
            <div className="auth-layout">
                <Alerts/>
                <div className="auth-layout-content">
                    {/* left sidebar menu */}
                    <SidebarMenuDesktop />
                    
                    {/* render page content */}
                    {children}
                    
                </div>
                <SidebarMenuMobile />
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    getAuthorizedUser,
    getUserAgents
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));