import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    CardBody, 
    FormGroup, 
    Alert, 
    Form, 
    Input, 
    Button, 
    FormFeedback, 
    Label, 
    InputGroup,
    Spinner  
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { 
    validatePasswordResetToken,
    validatePasswordResetTokenInitState,
    validatePasswordResetTokenFailure,
    
    resetPassword,
    resetPasswordInitState,
    resetPasswordFailure 
} from '../../redux/actions';
import withRouter from "../../components/withRouter";
import config from '../../config';
import _ from 'lodash';
import logo from "../../assets/images/logo192.png";

/**
 * ResetPassword component
 * @param {*} props 
 */
const ResetPassword = (props) => {
    const { t } = useTranslation();
    const supportEmail =  config.SUPPORT_EMAIL;
    let { passwordResetToken } = useParams();
    const {
        validatePasswordResetTokenLoading,
        validatePasswordResetTokenSuccess,
        validatePasswordResetTokenErrors,
        
        resetPasswordLoading,
        resetPasswordSuccess,
        resetPasswordErrors,

        validatePasswordResetToken,
        
        resetPassword,
        resetPasswordInitState,
        resetPasswordFailure 
    } = props;

    useEffect(() => {
        validatePasswordResetToken(passwordResetToken);
    }, [passwordResetToken]);

    const passwordResetForm = useFormik({
        validateOnChange: false,
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
            .required(t('Please enter your password'))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                t('The password must meet the requirements below')  
            ),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], t('Passwords must match'))
                .required(t('Please confirm your new password'))
        }),
        onSubmit: values => {
            resetPassword(values.password, passwordResetToken);
        },
    });

    useEffect(() => {
        const passwordResetFormErrors = passwordResetForm.errors;
        const errors = {};

        if (_.isEmpty(passwordResetFormErrors)) {
            if (resetPasswordErrors === null) {
                return;
            }

            resetPasswordInitState();
            return;
        }

        const passwordErrors = passwordResetFormErrors.password;
        if (passwordErrors) {
            if (Array.isArray(passwordErrors)){
                errors.password = [...passwordErrors];
            } else {
                errors.password = [passwordErrors];
            }
        }

        const confirmPasswordErrors = passwordResetFormErrors.confirmPassword;
        if (confirmPasswordErrors) {
            if (Array.isArray(confirmPasswordErrors)){
                errors.confirmPassword = [...confirmPasswordErrors];
            } else {
                errors.confirmPassword = [confirmPasswordErrors];
            }
        }

        resetPasswordFailure(errors);
    }, [passwordResetForm.errors]);

    return (
        <React.Fragment>
            <div className="account-pages py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            <div className="text-center mb-3">
                                <Link to="/" className="auth-logo mb-4 d-block">
                                    <img src={logo} alt="" height="60" className="logo" />
                                </Link>
                                <h4>{t('Create a new password')}</h4>
                            </div>
                            <Card>
                                <CardBody className="p-3">
                                    {validatePasswordResetTokenLoading && (
                                        <Alert color="info">
                                            <Spinner size="sm"/>&nbsp;
                                            {t('Validating your credentials')}...
                                        </Alert>
                                    )}
                                    { resetPasswordSuccess &&
                                        <Alert color="success" className="text-center mb-4">
                                            {t('Password was updated successfully')}.&nbsp; 
                                            <Link to="/login" className="font-weight-medium"> 
                                                {t('Login now')}. 
                                            </Link> 
                                        </Alert>
                                    }
                                    { validatePasswordResetTokenSuccess &&
                                        <Alert color="success" className="text-center mb-4">
                                            {t('You can update your password now')}. 
                                        </Alert>
                                    }
                                    {resetPasswordErrors &&
                                     resetPasswordErrors.details &&
                                        (<Alert color="danger">
                                            <ul>
                                                {resetPasswordErrors.details.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                            {t('You can contact our support by email')}:&nbsp; 
                                            <a href={`mailto:${supportEmail}`}>
                                                {supportEmail}
                                            </a>.
                                        </Alert>)
                                    }
                                    {validatePasswordResetTokenErrors &&
                                     validatePasswordResetTokenErrors.details &&
                                        (<Alert color="danger">
                                            <ul>
                                                {validatePasswordResetTokenErrors.details.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                            {t('You can contact our support by email')}:&nbsp; 
                                            <a href={`mailto:${supportEmail}`}>
                                                {supportEmail}
                                            </a>.
                                        </Alert>)
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={passwordResetForm.handleSubmit}>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('New password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder={t('Enter new password')}
                                                        onChange={passwordResetForm.handleChange}
                                                        onBlur={passwordResetForm.handleBlur}                                                        
                                                        value={passwordResetForm.values.password}
                                                        disabled={validatePasswordResetTokenLoading ||
                                                            resetPasswordLoading}
                                                        invalid={
                                                            !!(passwordResetForm.touched.password &&
                                                            resetPasswordErrors &&
                                                            resetPasswordErrors.password)
                                                        }
                                                    />
                                                    {passwordResetForm.touched.password &&
                                                     resetPasswordErrors &&
                                                     resetPasswordErrors.password && (
                                                        (<FormFeedback>
                                                            <ul>
                                                                {resetPasswordErrors.password.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>)
                                                    ) }
                                                    
                                                </InputGroup>
                                                <ul>
                                                    <li>{t('At least one lowercase character')}.</li>
                                                    <li>{t('At least one uppercase character')}.</li>
                                                    <li>{t('At least one digit')}.</li>
                                                    <li>{t('At least one special character (in this set: @ $ ! % * ? & #)')}.</li>
                                                    <li>{t('At least 8 characters in total')}.</li>
                                                </ul>
                                            </FormGroup>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Confirm new password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder={t('Confirm new password')}
                                                        onChange={passwordResetForm.handleChange}
                                                        onBlur={passwordResetForm.handleBlur}                                                        
                                                        value={passwordResetForm.values.confirmPassword}
                                                        disabled={validatePasswordResetTokenLoading ||
                                                            resetPasswordLoading}
                                                        invalid={!!(passwordResetForm.touched.confirmPassword &&
                                                                resetPasswordErrors &&
                                                                resetPasswordErrors.confirmPassword)}
                                                    />
                                                    {passwordResetForm.touched.confirmPassword &&
                                                     resetPasswordErrors &&
                                                     resetPasswordErrors.confirmPassword && (
                                                        (<FormFeedback>
                                                            <ul>
                                                                {resetPasswordErrors.confirmPassword.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>)
                                                    ) }
                                                </InputGroup>
                                            </FormGroup>

                                            <div className="d-grid">
                                                <Button 
                                                    color="primary" 
                                                    disabled={
                                                        validatePasswordResetTokenLoading ||
                                                        resetPasswordLoading} 
                                                    type="submit">
                                                        {(validatePasswordResetTokenLoading ||
                                                        resetPasswordLoading) &&
                                                            <>
                                                                <Spinner size="sm"/>&nbsp;
                                                            </>
                                                        }
                                                        {t('Reset password')}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="text-center">
                                <p>{t("Remember your password")}?&nbsp; 
                                <Link to="/login" className="font-weight-medium">
                                     {t('Sign in now')}
                                </Link> </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { 
        validatePasswordResetTokenLoading,
        validatePasswordResetTokenSuccess,
        validatePasswordResetTokenErrors,
        resetPasswordLoading,
        resetPasswordSuccess,
        resetPasswordErrors
    } = state.Auth;
    return { 
        validatePasswordResetTokenLoading,
        validatePasswordResetTokenSuccess,
        validatePasswordResetTokenErrors,
        resetPasswordLoading,
        resetPasswordSuccess,
        resetPasswordErrors
    };
};

const mapDispatchToProps = {
    validatePasswordResetToken,
    validatePasswordResetTokenInitState,
    validatePasswordResetTokenFailure,
    
    resetPassword,
    resetPasswordInitState,
    resetPasswordFailure
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));