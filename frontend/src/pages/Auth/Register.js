import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from "../../components/withRouter";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
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
import { 
    registerUser,
    registerUserInitState,
    registerUserFailure
 } from '../../redux/actions';
import { useTranslation } from 'react-i18next';
import logo from "../../assets/images/logo192.png";

/**
 * Register component
 * @param {*} props 
 */
const Register = (props) => {
    const { t } = useTranslation();
    const {
        registerLoading,
        registerSuccess,
        registerErrors, 
        registerUser,
        registerUserInitState,  
        registerUserFailure
    } = props;

    const registerForm = useFormik({
        validateOnChange: false,
        initialValues: {            
            email: '',
            password: ''
        },
        validationSchema: Yup.object({            
            email: Yup.string()
                .email(t('Enter proper email'))
                .required(t('Please enter your email')),
            password: Yup.string()
                .required(t('Please enter your password'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    t('The password must meet the requirements below')  
                ),
        }),
        onSubmit: values => {
            console.log('Register page', 'onSubmit', values.email, values.password );
            registerUser(values.email, values.password );
        },
    });

    useEffect(() => {
        const registerFormErrors = registerForm.errors;
        const errors = {};

        if (_.isEmpty(registerFormErrors)) {
            if (registerFormErrors === null) {
                return;
            }

            registerUserInitState();
            return;
        }

        const emailErrors = registerFormErrors.email;
        if (emailErrors) {
            if (Array.isArray(emailErrors)){
                errors.email = [...emailErrors];
            } else {
                errors.email = [emailErrors];
            }
        }

        const passwordErrors = registerFormErrors.password;
        if (passwordErrors) {
            if (Array.isArray(passwordErrors)){
                errors.password = [...passwordErrors];
            } else {
                errors.password = [passwordErrors];
            }
        }

        registerUserFailure(errors);
    }, [registerForm.errors]);

    return (
        <React.Fragment>

            <div className="account-pages pt-sm-3">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div className="text-center mb-3">
                                <Link to="/" className="auth-logo mb-3 d-block">
                                    <img src={logo} alt="" height="60" className="logo" />
                                </Link>
                                <h4>{t('Create your account')}</h4>
                            </div>
                            <Card>
                                <CardBody className="p-3">
                                    {registerErrors  && registerErrors.details &&
                                        (<Alert color="danger">
                                            <ul>
                                                {registerErrors.details.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </Alert>)
                                    }
                                    {
                                        registerSuccess &&
                                        <Alert color="success">
                                            {t('We provided confirmation link to your email address')}.
                                        </Alert>
                                    } 
                                    <div className="p-3">

                                        <Form onSubmit={registerForm.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Email')}</Label>
                                                <InputGroup className="input-group bg-soft-light rounded-3 mb-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder={t('Enter email')}
                                                        onChange={registerForm.handleChange}
                                                        onBlur={registerForm.handleBlur}
                                                        value={registerForm.values.email}
                                                        disabled={registerLoading}
                                                        invalid={!!(registerForm.touched.email 
                                                                    && registerErrors
                                                                    && registerErrors.email)}
                                                    />
                                                    {registerForm.touched.email 
                                                    && registerErrors
                                                    && registerErrors.email
                                                    && (
                                                        <FormFeedback type="invalid">
                                                            <ul>
                                                                {registerErrors.email.map((error, index) => (
                                                                        <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>
                                                    )}
                                                </InputGroup>
                                            </div>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder={t('Enter password')}
                                                        onChange={registerForm.handleChange}
                                                        onBlur={registerForm.handleBlur}
                                                        value={registerForm.values.password}
                                                        disabled={registerLoading}
                                                        invalid={!!(registerForm.touched.password 
                                                                    && registerErrors
                                                                    && registerErrors.password)}
                                                    />
                                                    {registerForm.touched.password
                                                    && registerErrors 
                                                    && registerErrors.password
                                                    &&(
                                                        <FormFeedback type="invalid">
                                                            <ul>
                                                                {registerErrors.password.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>
                                                    )}
                                                </InputGroup>
                                                <ul>
                                                    <li>{t('At least one lowercase character')}.</li>
                                                    <li>{t('At least one uppercase character')}.</li>
                                                    <li>{t('At least one digit')}.</li>
                                                    <li>{t('At least one special character (in this set: @ $ ! % * ? & #)')}.</li>
                                                    <li>{t('At least 8 characters in total')}.</li>
                                                </ul>
                                            </FormGroup>


                                            <div className="d-grid">
                                                <Button color="primary" disabled={registerLoading} type="submit">
                                                    {registerLoading &&
                                                        <div className='pe-2 d-inline-block'>
                                                            <Spinner size="sm"/>
                                                        </div>
                                                    }
                                                    {t('Sign up')}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="text-center">
                                <p>{t('Already have an account')} ? <Link to="/login" className="font-weight-medium"> {t('Signin')} </Link> </p>
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
        registerLoading,
        registerSuccess,
        registerErrors,
    } = state.Auth;
    
    return {
        registerLoading,
        registerSuccess,
        registerErrors,
    };
};

const mapDispatchToProps = {
    registerUser,
    registerUserInitState,
    registerUserFailure
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));