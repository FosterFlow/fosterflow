import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    Alert,
    Spinner,
} from 'reactstrap';
import withRouter from '../../components/withRouter';
import { 
    sendConfirmationEmail, 
    getAuthorizedUser, 
    getAgent 
} from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Components
import SidebarMenuDesktop from "./SidebarMenuDesktop";

const Index = (props) => {
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const {
        children,
        sendConfirmationEmailLoading,
        sendConfirmationEmailSuccess,
        sendConfirmationEmailErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        authorizedUser,
        layoutMode,
        getAuthorizedUser,
        getAgent,
        sendConfirmationEmail
    } = props;

    if (layoutMode){
        //TODO: move to jsx template
        document.body.setAttribute("data-bs-theme", props.layoutMode);
    }
    
    useEffect(() => {
        document.title = "FosterFlow Chat";
        getAuthorizedUser();
    }, []);


    useEffect(() => {
        if (authorizedUser && authorizedUser.id){
            getAgent(authorizedUser.id);
        }
    }, [authorizedUser]);

    return (
        <React.Fragment>
            
            <div className="auth-layout">
                
                {authorizedUser && !authorizedUser.is_email_confirmed &&
                    <Alert className="auth-layout-alert" color="info">
                        {confirmEmailLoading ? (
                            <span>
                                <Spinner size="sm"/>
                                {t('Sending')}...
                            </span>
                            
                        ):(
                            <span>
                                {t('We have sent you an email to confirm your account. Please check your inbox')}.
                                <a href="#" onClick={sendConfirmationEmail}> 
                                    {t('Click here')}
                                </a>
                                {t('to send again')}.
                            </span>
                        )}
                    </Alert>
                }
                {sendConfirmationEmailSuccess && (
                    <Alert color="success">
                        <h4>
                            {t('Email was successfully re-send to your email')}.
                        </h4>
                    </Alert>)
                }
                <div className="auth-layout-content">
                    {/* left sidebar menu */}
                        <SidebarMenuDesktop />
                    {/* render page content */}
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {
        sendConfirmationEmailLoading,
        sendConfirmationEmailSuccess,
        sendConfirmationEmailErrors,

        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
    } = state.Auth;
    return {
        
        authorizedUser: state.User.authorizedUser,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    sendConfirmationEmail,
    getAuthorizedUser,
    getAgent
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));