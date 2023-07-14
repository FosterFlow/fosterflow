import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { changeLayoutMode } from '../../redux/actions';
import withRouter from '../../components/withRouter';

//i18n
import { useTranslation } from 'react-i18next';

//Import Components
import LeftSidebarMenu from "./LeftSidebarMenu";

const Index = ({layoutMode, authorizedUser, changeLayoutMode, confirmEmail, children, router}) => {
    
    //function for capital first letter of current page pathname
    const capitalizeFirstLetter = (string) => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    useEffect(() => {
        let getLayoutMode = localStorage.getItem("layoutMode");
        if (getLayoutMode) {
            changeLayoutMode(getLayoutMode);
        } else {
            changeLayoutMode(layoutMode);
        }

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
                    {t('tWe have sent you an email to confirm your account. Please check your inbox')}. 
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

Index.propTypes = {
    layoutMode: PropTypes.any,
};

const mapStateToProps = state => {
    const { layoutMode } = state.Layout;
    const { dialogues, messages } = state.Chat;
    const { authorizedUser } = state.User;
    return { dialogues, messages, authorizedUser, layoutMode };
};

export default withRouter(connect(mapStateToProps, { changeLayoutMode })(Index));