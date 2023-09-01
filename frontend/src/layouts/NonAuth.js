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
        confirmEmail,
        confirmEmailInitState,
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
                {refreshTokenUpdateErrors && (
                    <Alert color="danger">
                        <h6>
                            {t('Authentification error')}
                        </h6>
                        {refreshTokenUpdateErrors.details &&
                            (<div>
                                {t('Errors details')}:
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
    } = state.Auth;
    return {
        refreshTokenUpdateErrors,
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        layoutMode: state.Layout.layoutMode
    };
};

const mapDispatchToProps = {
    confirmEmail
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NonAuth));