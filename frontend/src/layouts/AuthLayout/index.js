import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    Alert,
    Spinner,
} from 'reactstrap';
import withRouter from '../../components/withRouter';
import {
    confirmEmail, 
    sendConfirmationEmail, 
    getAuthorizedUser, 
    getAgent 
} from '../../redux/actions';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import SidebarMenuDesktop from "./SidebarMenuDesktop";
import { useParams } from 'react-router-dom';

const Index = (props) => {
    const { t } = useTranslation();
    const supportEmail =  config.SUPPORT_EMAIL;
    const { token: emailVerifyToken } = useParams();
    const {
        children,
        sendConfirmationEmailLoading,
        sendConfirmationEmailSuccess,
        sendConfirmationEmailErrors,

        confirmEmail,
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
        if (emailVerifyToken === undefined) {
            return;
        } 
        confirmEmail(emailVerifyToken);
    }, [emailVerifyToken]);

    useEffect(() => {
        if (authorizedUser && authorizedUser.id){
            getAgent(authorizedUser.id);
        }
    }, [authorizedUser]);

    return (
        <React.Fragment>
            <div className="auth-layout">
                {confirmEmailLoading && (
                    <Alert className="auth-layout-alert" color="info">
                    <span>
                        <Spinner size="sm"/>&nbsp;
                        {t('Validating your email address')}...
                    </span>
                </Alert>
                )}
                {confirmEmailSuccess && (
                    <Alert color="success">
                            {t('Email was successfully confirmed')}.
                    </Alert>)
                }
                {sendConfirmationEmailErrors && (
                    <Alert color="danger">
                        <h5>
                            {t('Sending of confirmation email failed')}.
                        </h5>
                        {sendConfirmationEmailErrors.details &&
                            (<div>
                                {t('Errors details')}:
                                <ul>
                                    {sendConfirmationEmailErrors.details.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>)
                        }
                        <div>
                            <a href="#" onClick={sendConfirmationEmail}> 
                                {t('Try resend confirmation email')}.
                            </a>&nbsp;
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>)
                }
                {confirmEmailErrors && (
                    <Alert color="danger">
                        <h4>
                            {t('Confirmation failed')}.
                        </h4>
                        {confirmEmailErrors.details &&
                            (<div>
                                {t('Errors details')}:
                                <ul>
                                    {confirmEmailErrors.details.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>)
                        }
                        <div>
                            {t('Try resend confirmation email')}.
                            <a href="#" onClick={sendConfirmationEmail}> 
                                {t('Click here')}&nbsp;
                                </a>
                            {t('to send again')}.
                        </div>
                        <div>
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>
                )}
                {authorizedUser && 
                !authorizedUser.is_email_confirmed &&
                !confirmEmailLoading && 
                sendConfirmationEmailErrors === null && 
                confirmEmailErrors === null && 
                    <Alert className="auth-layout-alert" color="info">
                        <span>
                            {sendConfirmationEmailLoading ? (
                                <span>
                                    <Spinner size="sm"/>&nbsp;
                                    {t('Sending email confirmation')}...
                                </span>) : (
                                <>
                                    {t('We have sent you an email to confirm your account. Please check your inbox')}.
                                    <a href="#" onClick={sendConfirmationEmail}> 
                                        {t('Click here')}&nbsp;
                                    </a>
                                    {t('to send again')}.
                                </>) 
                            }
                        </span>
                    </Alert>
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
        sendConfirmationEmailLoading,
        sendConfirmationEmailSuccess,
        sendConfirmationEmailErrors,

        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,

        authorizedUser: state.User.authorizedUser,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    confirmEmail,
    sendConfirmationEmail,
    getAuthorizedUser,
    getAgent
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));