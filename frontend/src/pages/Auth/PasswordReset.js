import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

//i18n
import { useTranslation } from 'react-i18next';

//redux store
import { validateResetToken, resetPasswordConfirm, authError  } from '../../redux/actions';
import withRouter from "../../components/withRouter";

/**
 * ResetPassword component
 * @param {*} props 
 */
const ResetPassword = (props) => {
    /* initialize t variable for multi language implementation */
    const { t } = useTranslation();
    const [errors, setErrors] = useState(null);
    let { token } = useParams();

    useEffect(() => {
        props.authError(null);
        //TODO: show errors of validation
        props.validateResetToken(token);
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

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string().required(t('Please Enter Your New Password')),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], t('Passwords must match')).required(t('Please Confirm Your New Password'))
        }),
        onSubmit: values => {
            console.log('ResetPassword page', 'onSubmit', values.password, token );
            props.resetPasswordConfirm(values.password, token);
        },
    });

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            <Card>
                                <CardBody className="p-4">
                                    {/* TODO: need to manage 3 cases: loading, error */}
                                    { props.resetPasswordConfirmed &&
                                        <Alert color="success" className="text-center mb-4">{t('Password was updated successfully')}. 
                                            <Link to="/login" className="font-weight-medium text-primary"> {t('Login now')} </Link> 
                                        </Alert>
                                    }
                                    {
                                        errors && errors.details &&
                                         <Alert color="danger">{errors.details}</Alert>
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('New Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder="Enter New Password"
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

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Confirm New Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder="Confirm New Password"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}                                                        
                                                        value={formik.values.confirmPassword}
                                                        invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? true : false}
                                                    />
                                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                                        <FormFeedback type="invalid">{formik.errors.confirmPassword}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <div className="d-grid">
                                                <Button color="primary" block className="waves-effect waves-light" type="submit">{t('Reset Password')}</Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t("Remember your password")}? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin now')} </Link> </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error, resetPasswordConfirmed } = state.Auth;
    return { user, loading, error, resetPasswordConfirmed };
};

const mapDispatchToProps = {
    validateResetToken,
    resetPasswordConfirm,
    authError
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));