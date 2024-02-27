/**
 * Layout for pages for authorized users like dashboard pages
 */
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
    getUserAgents,
    getUserAgentProfile
} from '../../redux/actions';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Alerts = (props) => {
    const { t } = useTranslation();
    const supportEmail =  config.SUPPORT_EMAIL;
    const { emailVerifyToken } = useParams();
    const {
        sendConfirmationEmailLoading,
        sendConfirmationEmailErrors,

        confirmEmail,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        
        authorizedUser,
        layoutMode,

        sendConfirmationEmail,
        getUserAgentProfile,
        userAgent,
        profile
    } = props;

    if (layoutMode){
        //TODO: move to jsx template
        document.body.setAttribute("data-bs-theme", props.layoutMode);
    }

    function sendConfirmationEmailHandler (event) {
        event.preventDefault();
        sendConfirmationEmail();
    }
    
    useEffect(() => {
        if (emailVerifyToken === undefined) {
            return;
        } 
        confirmEmail(emailVerifyToken);
    }, [emailVerifyToken]);

    useEffect(() => {
        if (userAgent === null) {
          return
        }
    
        if (profile === null) {
          getUserAgentProfile(userAgent.id)
        }
    
    }, [profile, userAgent]);


    return (
        <React.Fragment>
                {confirmEmailLoading && 
                    <Alert color="info">
                        <span>
                            <Spinner size="sm"/>&nbsp;
                            {t('Validating your email address')}...
                        </span>
                    </Alert>
                }
                {sendConfirmationEmailLoading && 
                    <Alert color="info">
                        <span>
                            <Spinner size="sm"/>&nbsp;
                            {t('Sending email confirmation')}...
                        </span>
                    </Alert>
                }   
                {confirmEmailSuccess && (
                    <Alert color="success">
                            {t('Email was successfully confirmed')}.
                    </Alert>)
                }
                {sendConfirmationEmailErrors && (
                    <Alert color="danger">
                        <h6>
                            {t('Sending of confirmation email failed')}
                        </h6>
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
                            <a href="#" onClick={sendConfirmationEmailHandler}> 
                                {t('Try resend confirmation email')}.
                            </a>&nbsp;
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>)
                }
                {confirmEmailErrors && (
                    <Alert color="danger">
                        <h6>
                            {t('Confirmation failed')}
                        </h6>
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
                            {t('Try resend confirmation email')}.&nbsp;
                            <a href="#" onClick={sendConfirmationEmailHandler}> 
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
                !sendConfirmationEmailLoading &&
                    <Alert color="info">
                        <div>
                            {t('We have sent you an email to confirm your account. Please check your inbox')}.&nbsp;
                                <a href="#" onClick={sendConfirmationEmailHandler}> 
                                    {t('Click here')}&nbsp;
                                </a>
                            {t('to send again')}.
                        </div>
                        <div>
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>
                }
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const {
        sendConfirmationEmailLoading,
        sendConfirmationEmailErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
    } = state.Auth;
    return {
        sendConfirmationEmailLoading,
        sendConfirmationEmailErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        userAgent: state.Agents.userAgent,
        profile: state.UserAgentProfile.profile,
        authorizedUser: state.User.authorizedUser,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    confirmEmail,
    sendConfirmationEmail,
    getAuthorizedUser,
    getUserAgents,
    getUserAgentProfile
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alerts));