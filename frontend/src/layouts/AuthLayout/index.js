import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import withRouter from '../../components/withRouter';
import { sendConfirmationEmail } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Components
import SidebarMenuDesktop from "./SidebarMenuDesktop";

const Index = (props) => {
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    if (props.layoutMode){
        //TODO: move to jsx template
        document.body.setAttribute("data-bs-theme", props.layoutMode);
    }
    
    useEffect(() => {
        //set document title according to page path name
        document.title = "FosterFlow Chat";
    }, []);

    const sendConfirmationEmailAgain = () => {
        props.sendConfirmationEmail();
    };
    
    return (
        <React.Fragment>
            {props.authorizedUser && !props.authorizedUser.is_email_confirmed &&
                <Alert color="info">
                    {t('We have sent you an email to confirm your account. Please check your inbox')}. 
                     <a href="#" onClick={sendConfirmationEmailAgain}> {t('Click here')}</a> {t('to send again')}.
                </Alert>}
            <div className="layout-wrapper d-lg-flex">
                {/* left sidebar menu */}
                <SidebarMenuDesktop />
                    {/* render page content */}
                    {props.children}
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return { 
        authorizedUser: state.User.authorizedUser,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    sendConfirmationEmail
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));