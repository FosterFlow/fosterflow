import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//Import formik validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';

//Import actions and helpers
import { forgetPassword, authError } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

/**
 * Forget Password component
 * @param {*} props 
 */
const ForgetPassword = (props) => {
    const [errors, setErrors] = useState(null);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

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
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required(t('Please enter your email'))
        }),
        onSubmit: values => {
            props.forgetPassword(values.email);
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
                                    <div className="p-3">
                                        {
                                            errors && errors.details &&
                                            <Alert color="danger">{errors.details}</Alert>
                                        }
                                        {
                                            props.passwordResetStatus ? 
                                            <Alert color="success" className="text-center mb-4">{t('Email and instructions was sent to your email')}.</Alert>
                                            : <Alert color="info" className="text-center mb-4">{t('Enter your Email and instructions will be sent to you')}.</Alert>
                                        }
                                        <Form onSubmit={formik.handleSubmit}>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Email')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder="Enter Email"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email}
                                                        invalid={formik.touched.email && formik.errors.email ? true : false}
                                                    />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <div className="d-grid">
                                                <Button color="primary" block type="submit">{t('Reset')}</Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                {t('Remember It')}? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin')} </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error, passwordResetStatus } = state.Auth;
    return { user, loading, error, passwordResetStatus };
};

export default connect(mapStateToProps, { forgetPassword, authError })(ForgetPassword);