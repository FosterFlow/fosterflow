import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Form, FormGroup, Input, FormFeedback, InputGroup, Label } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

function Settings(props) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState(null);

    const formik = useFormik({
        initialValues: {
            first_name: props.profile.first_name || '',
            last_name: props.profile.last_name || '',
            email: (props.user.authorizedUser && props.user.authorizedUser.email) || ''
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Please Enter Your First Name'),
            last_name: Yup.string().required('Please Enter Your Second Name'),
            email: Yup.string().email('Invalid email address').required('Please Enter Your Email')
        }),
        onSubmit: values => {
            // Submit the form values to your backend or a Redux action
            console.log('Settings page', 'onSubmit', values);
        },
    });

    return (
        <React.Fragment>
            <div className="user-profile me-lg-1">
                <div className="user-profile-wrapper">
                    <div className="p-4">
                        <h4 className="mb-0">{t('Settings')}</h4>
                    </div>

                    <div className="user-profile-sroll-area">
                        <div className="border-bottom px-4">
                            <div className="mb-4 profile-user">
                                <img src={avatar1} className="rounded-circle avatar-lg img-thumbnail"/>
                            </div>
                        </div>
                        {/* End profile user */}

                        {/* Start User profile description */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Personal Info')}
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <FormGroup>
                                            <Label>{t('First Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="first_name" 
                                                value={formik.values.first_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.first_name && formik.errors.first_name ? true : false}
                                            />
                                            {formik.touched.first_name && formik.errors.first_name && (
                                                <FormFeedback>{formik.errors.first_name}</FormFeedback>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Second Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="last_name" 
                                                value={formik.values.last_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.last_name && formik.errors.last_name ? true : false}
                                            />
                                            {formik.touched.last_name && formik.errors.last_name && (
                                                <FormFeedback>{formik.errors.last_name}</FormFeedback>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Email')}</Label>
                                            <Input 
                                                type="email" 
                                                name="email" 
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.email && formik.errors.email ? true : false}
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <FormFeedback>{formik.errors.email}</FormFeedback>
                                            )}
                                        </FormGroup>

                                        <Button type="submit">{t('Update')}</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                            {/* end profile card */}
                        </div>
                        {/* End User profile description */}
                    </div>
                    {/* End scroll areaa */}     
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    profile: state.Profile,
    user: state.User
});

export default withRouter(connect(mapStateToProps)(Settings));
