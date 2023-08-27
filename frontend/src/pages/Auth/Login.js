import React, { useEffect } from 'react';
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
import withRouter from "../../components/withRouter";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { loginUser, loginUserInitState, loginUserFailure } from '../../redux/actions';
import _ from 'lodash';

/**
 * Login component
 * @param {*} props 
 */
const Login = (props) => {
    const {
        loginLoading, 
        loginErrors, 
        loginUser,
        loginUserInitState,  
        loginUserFailure 
    } = props;
    const { t } = useTranslation();

    // TODO: Formik cause redundant re-rendering
    const loginForm = useFormik({
        validateOnChange: false,
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(t('Please enter your email'))
                .email(t('Enter proper email')),
            password: Yup.string().required(t('Please enter your password'))
        }),
        onSubmit: values => {
            console.log('Login page', 'onSubmit', values.email, values.password );
            loginUser(values.email, values.password );
        },
    });

    useEffect(() => {
        const loginFormErrors = loginForm.errors;
        const errors = {};

        if (_.isEmpty(loginFormErrors)) {
            if (loginErrors === null) {
                return;
            }

            loginUserInitState();
            return;
        }

        const emailErrors = loginFormErrors.email;
        if (emailErrors) {
            if (Array.isArray(emailErrors)){
                errors.email = [...emailErrors];
            } else {
                errors.email = [emailErrors];
            }
        }

        const passwordErrors = loginFormErrors.password;
        if (passwordErrors) {
            if (Array.isArray(passwordErrors)){
                errors.password = [...passwordErrors];
            } else {
                errors.password = [passwordErrors];
            }
        }

        loginUserFailure (errors);
    }, [loginForm.errors]);

    return (
        <React.Fragment>
            <div className="account-pages pt-sm-5">
                <Container className='login-page'>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            <Card>
                                <CardBody className="p-4">
                                    
                                    {loginErrors  && loginErrors.details &&
                                        (<Alert color="danger">
                                            <ul>
                                                {loginErrors.details.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </Alert>)
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={loginForm.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Email')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted" id="basic-addon3">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder={t('Enter email')}
                                                        onChange={loginForm.handleChange}
                                                        onBlur={loginForm.handleBlur}                                                        
                                                        value={loginForm.values.email}
                                                        autoComplete="username"
                                                        disabled={loginLoading}                                                        
                                                        invalid={
                                                            (loginForm.touched.email && 
                                                            loginErrors &&
                                                            loginErrors.email) ? true : false}
                                                    />
                                                    {loginForm.touched.email &&
                                                     loginErrors &&
                                                     loginErrors.email &&
                                                        (<FormFeedback>
                                                            <ul>
                                                                {loginErrors.email.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>)}
                                                </InputGroup>
                                            </div>

                                            <FormGroup className="mb-4">
                                                <div className="float-end">
                                                    <Link to="/forget-password" className="text-muted font-size-13">{t('Forgot password')}?</Link>
                                                </div>
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder={t('Enter password')}
                                                        onChange={loginForm.handleChange}
                                                        onBlur={loginForm.handleBlur}                                                        
                                                        value={loginForm.values.password}
                                                        autoComplete="current-password"
                                                        disabled={loginLoading}   
                                                        invalid={(
                                                            loginForm.touched.password &&
                                                            loginErrors &&
                                                            loginErrors.password) ? true : false}
                                                    />
                                                    {loginForm.touched.password && loginErrors && loginErrors.password &&
                                                        (<FormFeedback>
                                                            <ul>
                                                                {loginErrors.password.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>)}
                                                </InputGroup>
                                            </FormGroup>

                                            {/* <div className="form-check mb-4">
                                                <Input type="checkbox" className="form-check-input" id="remember-check" />
                                                <Label className="form-check-label" htmlFor="remember-check">{t('Remember me')}</Label>
                                            </div> */}

                                            <div className="d-grid">
                                                <Button color="primary" disabled={loginLoading} type="submit">
                                                    {loginLoading &&
                                                        <div className='pe-2 d-inline-block'>
                                                            <Spinner size="sm"/>
                                                        </div>
                                                    }
                                                    {t('Sign in')}
                                                </Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="text-center">
                                <p>{t("Don't have an account")} ? <Link to="/register" className="font-weight-medium text-primary"> {t('Signup now')} </Link> </p>
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
        loginLoading, 
        loginErrors 
    } = state.Auth;
    
    return { 
        loginLoading, 
        loginErrors 
    };
};

const mapDispatchToProps = {
    loginUser,
    loginUserInitState,
    loginUserFailure
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));