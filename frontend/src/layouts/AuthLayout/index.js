import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import withRouter from '../../components/withRouter';

//i18n
import { useTranslation } from 'react-i18next';

//Import Components
import LeftSidebarMenu from "./LeftSidebarMenu";

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
        // Dispatch an action to send the confirmation email again
        props.confirmEmail();
    };
    
    return (
        <React.Fragment>
            {props.authorizedUser && !props.authorizedUser.is_email_confirmed &&
                <Alert color="info">
                    {t('We have sent you an email to confirm your account. Please check your inbox')}. 
                    <button onClick={sendConfirmationEmailAgain}>{t('Click here')}</button> {t('to send again')}.
                </Alert>}
            <div className="layout-wrapper d-lg-flex">
                {/* left sidebar menu */}
                <LeftSidebarMenu />
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

export default withRouter(connect(mapStateToProps)(Index));