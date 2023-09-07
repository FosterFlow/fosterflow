/**
 * Layout for pages for non authorized users like login, register
 */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Spinner } from 'reactstrap';
import withRouter from '../components/withRouter';
import config from '../config';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
    confirmEmail
} from '../redux/actions';

const NonAuth = (props) => {
    const { t } = useTranslation();
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const supportEmail =  config.SUPPORT_EMAIL;
    const { emailVerifyToken } = useParams();
    const {
        refreshTokenUpdateErrors,
        logoutErrors,
        confirmEmail,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        layoutMode
    } = props;

    if (layoutMode){
        //TODO: move to jsx template
        document.body.setAttribute("data-bs-theme", layoutMode);
    }

    let currentPage = capitalizeFirstLetter(props.router.location.pathname);
    document.title = currentPage;

    useEffect(() => {
        if (document.body.classList.contains('mobileStickUrlBar')) {
            document.body.classList.remove('mobileStickUrlBar');
        }

        if (document.documentElement.classList.contains('overscrollYnone')) {
            document.documentElement.classList.remove('overscrollYnone');
        }
    }, []);

    useEffect(() => {
        if (emailVerifyToken === undefined) {
            return;
        } 
        confirmEmail(emailVerifyToken);
    }, [emailVerifyToken]);

    return (
        <React.Fragment>
                {confirmEmailLoading && (
                    <Alert color="info">
                        <Spinner size="sm"/>&nbsp;
                        {t('Validating your email address')}...
                    </Alert>
                )}
                {confirmEmailSuccess && (
                    <Alert color="success">
                        {t('Email was successfully confirmed')}.
                    </Alert>)
                }
                {logoutErrors && (
                    <Alert color="danger">
                        <h6>
                            {t('An error occurred when exiting the application')}
                        </h6>
                        {logoutErrors.details &&
                            (<div>
                                {t('Details')}:
                                <ul>
                                    {logoutErrors.details.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>)
                        }
                        <div>
                            <hr/>
                            {t('Сontact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>
                )}
                {refreshTokenUpdateErrors && (
                    <Alert color="info">
                        <h6>
                            {t('Your session key was expired')}
                        </h6>
                        {refreshTokenUpdateErrors.details &&
                            (<div>
                                {t('Details')}:
                                <ul>
                                    {refreshTokenUpdateErrors.details.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>)
                        }
                        <div>
                            <hr/>
                            {t('Try to login once again')}.&nbsp;
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>
                )}
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
                            <hr/>
                            {t('Try to login and re-send confirmation email')}.&nbsp;
                            {t('Or contact our support by email')}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </div>
                    </Alert>
                )}
            {props.children}
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    const {
        refreshTokenUpdateErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        logoutErrors
    } = state.Auth;
    return {
        refreshTokenUpdateErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        logoutErrors,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    confirmEmail
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NonAuth));