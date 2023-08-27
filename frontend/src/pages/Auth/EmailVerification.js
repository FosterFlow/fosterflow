import { 
    Container, 
    Alert,
    Spinner
} from 'reactstrap';
import { Navigate  } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import withRouter from "../../components/withRouter";
import { 
    confirmEmail,
    sendConfirmationEmail
} from '../../redux/actions';
import { useTranslation } from 'react-i18next';

//TODO need to handle 2 cases: when we redirect to authorized page or not authorized page

const EmailVerification = (props) => {
    const { t } = useTranslation();
    const { token } = useParams();
    const { 
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors,
        confirmEmail,
        sendConfirmationEmail
     } = props;

    useEffect(() => {
        console.log("useEffect", token);
        confirmEmail(token);
    }, []);

    return (
        <React.Fragment>
            {/* In case if user is already logged in it manages at router */}
            {confirmEmailSuccess && (
                // TODO: We have to show successfull message at login page
                <Navigate to={{ pathname: "/login" }} />
            )}
            <Container className="justify-content-center pt-5">
                {confirmEmailLoading && (
                    <p>
                        <Spinner size="sm"/> {t('Loading')}...
                    </p>
                    
                )}
                {confirmEmailErrors && (
                    <Alert color="danger">
                        <h4>
                            {t('Confirmation failed')}.
                        </h4>
                        {confirmEmailErrors.details &&
                            (<p>
                                {t('Errors details')}:
                                <ul>
                                    {confirmEmailErrors.details.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </p>)
                        }
                        <p>
                            <a href="#" onClick={sendConfirmationEmail}> {t('Try to resend confirmation email')}</a>.
                        </p>
                        <p>
                            {t('Or contact our support by email')}: <a href="mailto:hello@soshace.com">hello@soshace.com</a>.
                        </p>
                    </Alert>
                )}
            </Container>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { 
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors
    } = state.Auth;
    return { 
        confirmEmailLoading,
        confirmEmailSuccess,
        confirmEmailErrors
    };
};

const mapDispatchToProps = {
    confirmEmail,
    sendConfirmationEmail
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailVerification));