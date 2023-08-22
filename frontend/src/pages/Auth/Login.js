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
    InputGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from "../../components/withRouter";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { loginUser, loginUserFailed  } from '../../redux/actions';

/**
 * Login component
 * @param {*} props 
 */
const Login = (props) => {
    const { loading, loginErrors } = props;
    const { t } = useTranslation();

    useEffect(() => {
            props.loginUserFailed(null);
    }, []);

    // validation
    const loginForm = useFormik({
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
            props.loginUser(values.email, values.password );
        },
    });

    //TODO: reduce number of invokes
    function getEmailErrors () {
        let errors = [];
        if (loginForm.errors && loginForm.errors.email) {
            errors.push(loginForm.errors.email);
        }

        if (loginErrors !== null && loginErrors.email) {
            errors = [...errors, ...loginErrors.email]
        }

        return errors
    }

    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container className='login-page'>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            <Card>
                                <CardBody className="p-4">
                                    {
                                        loginErrors  && loginErrors.details &&
                                        (
                                            <Alert color="danger">
                                                <ul>
                                                    {loginErrors.details.map((error, index) => (
                                                        <li key={index}>{error}</li>
                                                    ))}
                                                </ul>
                                            </Alert>
                                        )
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
                                                        invalid={loginForm.touched.email && loginForm.errors.email ? true : false}
                                                    />
                                                    <FormFeedback>
                                                        {
                                                            getEmailErrors().length > 0 && (
                                                                <ul>
                                                                    {getEmailErrors().map((error, index) => (
                                                                        <li key={index}>{error}</li>
                                                                    ))}
                                                                </ul>
                                                            )
                                                        }
                                                    </FormFeedback>
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
                                                        invalid={loginForm.touched.password && loginForm.errors.password ? true : false}
                                                    />
                                                    {loginForm.touched.password && loginForm.errors.password ? (
                                                        <FormFeedback type="invalid">{loginForm.errors.password}</FormFeedback>
                                                    ) : null}

                                                </InputGroup>
                                            </FormGroup>

                                            {/* <div className="form-check mb-4">
                                                <Input type="checkbox" className="form-check-input" id="remember-check" />
                                                <Label className="form-check-label" htmlFor="remember-check">{t('Remember me')}</Label>
                                            </div> */}

                                            <div className="d-grid">
                                                <Button color="primary" block type="submit">{t('Sign in')}</Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
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
    //TODO: show loading
    const { loading, loginErrors } = state.Auth;
    return { loading, loginErrors };
};

export default withRouter(connect(mapStateToProps, { loginUser, loginUserFailed })(Login));