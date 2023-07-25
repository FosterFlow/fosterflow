import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from "../../components/withRouter";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';

//Import action
import { registerUser, authError } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

/**
 * Register component
 * @param {*} props 
 */
const Register = (props) => {
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const [errors, setErrors] = useState(null);

    //resetting previeous errors
    useEffect(() => {
            props.authError(null);
    }, []);

    useEffect(() => {
        if (props.error && props.error.errors) {
            const propsErrors = props.error.errors;
            setErrors(propsErrors);
            let formErrors = {};
            for (let key in propsErrors) {
                formErrors[key] = propsErrors[key][0];
            }
            formik.setErrors(formErrors);
        }
    }, [props.error]);
    
    // validation
    const formik = useFormik({
        initialValues: {            
            email: '',
            password: ''
        },
        validationSchema: Yup.object({            
            email: Yup.string().email(t('Enter proper email')).required('Required'),
            password: Yup.string()
                .required('Required')
        }),
        onSubmit: values => {
            console.log('Register page', 'onSubmit', values.email, values.password );
            props.registerUser(values.email, values.password );
        },
    });

    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card>
                                <CardBody className="p-4">
                                    {
                                        errors && errors.details &&
                                        <Alert color="danger">{errors.details}</Alert>
                                    }
                                    {
                                        props.user && <Alert color="success">{t('We provided confirmation link to your email address')}.</Alert>
                                    } 
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

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
                                                        placeholder={t('Enter Email')}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email}
                                                        invalid={formik.touched.email && formik.errors.email ? true : false}
                                                    />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                                                    ) : null}
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
                                                        placeholder={t('Enter Password')}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.password}
                                                        invalid={formik.touched.password && formik.errors.password ? true : false}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                                                    ) : null}

                                                </InputGroup>
                                            </FormGroup>


                                            <div className="d-grid">
                                                <Button color="primary" block type="submit">{t('Sign up')}</Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t('Already have an account')} ? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
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
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { registerUser, authError })(Register));