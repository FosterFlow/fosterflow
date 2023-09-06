import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//Import formik validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
    forgetPassword,
    forgetPasswordInitState,
    forgetPasswordFailure
} from '../../redux/actions';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import config from '../../config';

/**
 * Forget Password component
 * @param {*} props 
 */
const ForgetPassword = (props) => {
    const { t } = useTranslation();
    const { 
        forgetPassword,
        forgetPasswordInitState,
        forgetPasswordFailure,
        forgetPasswordLoading,
        forgetPasswordSuccess,
        forgetPasswordErrors,
    } = props;
    const supportEmail =  config.SUPPORT_EMAIL;
    const forgetPasswordForm = useFormik({
        validateOnChange: false,
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
            .email(t('Enter proper email'))
            .required(t('Please enter your email'))
        }),
        onSubmit: values => {
            forgetPassword(values.email);
        },
    });

    useEffect(() => {
        const forgetPasswordFormErrors = forgetPasswordForm.errors;
        const errors = {};

        if (_.isEmpty(forgetPasswordFormErrors)) {
            if (forgetPasswordErrors === null) {
                return;
            }

            forgetPasswordInitState();
            return;
        }

        const emailErrors = forgetPasswordFormErrors.email;
        if (emailErrors) {
            if (Array.isArray(emailErrors)){
                errors.email = [...emailErrors];
            } else {
                errors.email = [emailErrors];
            }
        }

        forgetPasswordFailure (errors);
    }, [forgetPasswordForm.errors]);

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
                                            forgetPasswordErrors && forgetPasswordErrors.details &&
                                            (<Alert color="danger">
                                                <ul>
                                                    {forgetPasswordErrors.details.map((error, index) => (
                                                        <li key={index}>{error}</li>
                                                    ))}
                                                </ul>
                                                {t('You can contact our support by email')}:&nbsp; 
                                                <a href={`mailto:${supportEmail}`}>
                                                    {supportEmail}
                                                </a>.
                                            </Alert>)
                                        }
                                        {
                                            forgetPasswordSuccess && 
                                            <Alert color="success" className="text-center mb-4">
                                                {t('Email with instructions was sent to you')}.
                                            </Alert>
                                        
                                        }
                                        {
                                            forgetPasswordLoading &&
                                            <Alert color="info" className="text-center mb-4">
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner size="sm"/>
                                                </div>
                                                {t('Sending email instruction to you')}...
                                            </Alert>
                                        }

                                        { (!forgetPasswordSuccess &&
                                            forgetPasswordErrors === null &&
                                            !forgetPasswordLoading
                                            ) &&
                                            <Alert color="info" className="text-center mb-4">
                                                {t('Enter your email and instructions will be sent to you')}.
                                            </Alert>
                                        }
                                        <Form onSubmit={forgetPasswordForm.handleSubmit}>

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
                                                        placeholder="Enter email"
                                                        onChange={forgetPasswordForm.handleChange}
                                                        onBlur={forgetPasswordForm.handleBlur}
                                                        value={forgetPasswordForm.values.email}
                                                        disabled={forgetPasswordLoading} 
                                                        invalid={!!(forgetPasswordForm.touched.email && 
                                                                    forgetPasswordErrors && 
                                                                    forgetPasswordErrors.email)}
                                                    />
                                                    {forgetPasswordForm.touched.email && 
                                                    forgetPasswordErrors && 
                                                    forgetPasswordErrors.email &&
                                                        (<FormFeedback>
                                                            <ul>
                                                                {forgetPasswordErrors.email.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>)
                                                    }
                                                </InputGroup>
                                            </FormGroup>

                                            <div className="d-grid">
                                                <Button disabled={forgetPasswordLoading} color="primary" type="submit">
                                                    {forgetPasswordLoading &&
                                                        <div className='pe-2 d-inline-block'>
                                                            <Spinner size="sm"/>
                                                        </div>
                                                    }
                                                        {t('Reset')}
                                                </Button>
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
    const {
        forgetPasswordLoading,
        forgetPasswordSuccess,
        forgetPasswordErrors,
    } = state.Auth;
    
    return {
        forgetPasswordLoading,
        forgetPasswordSuccess,
        forgetPasswordErrors,
    };
};

const mapDispatchToProps = {
    forgetPassword,
    forgetPasswordInitState,
    forgetPasswordFailure
}

export default connect(mapStateToProps, { forgetPassword, mapDispatchToProps  })(ForgetPassword);