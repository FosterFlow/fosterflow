import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import withRouter from '../../components/withRouter';
import { getLayoutMode } from '../../redux/layout/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Components
import LeftSidebarMenu from "./LeftSidebarMenu";

const Index = ({authorizedUser, confirmEmail, children }) => {
    const layoutMode = getLayoutMode();
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    document.body.setAttribute("data-bs-theme", layoutMode);
    useEffect(() => {
        //set document title according to page path name
        document.title = "FosterFlow Chat";
    }, []);

    const sendConfirmationEmailAgain = () => {
        // Dispatch an action to send the confirmation email again
        confirmEmail();
    };
    
    return (
        <React.Fragment>
            {authorizedUser && !authorizedUser.is_email_confirmed &&
                <Alert color="info">
                    {t('We have sent you an email to confirm your account. Please check your inbox')}. 
                    <button onClick={sendConfirmationEmailAgain}>{t('Click here')}</button> {t('to send again')}.
                </Alert>}
            <div className="layout-wrapper d-lg-flex">
                {/* left sidebar menu */}
                <LeftSidebarMenu />
                    {/* render page content */}
                    {children}
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const { dialogues, messages } = state.Chat;
    const { authorizedUser } = state.User;
    return { dialogues, messages, authorizedUser };
};

export default withRouter(connect(mapStateToProps)(Index));