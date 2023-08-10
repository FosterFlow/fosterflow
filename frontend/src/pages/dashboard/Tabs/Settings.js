import React, { useEffect, useState } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Button, 
    Form, 
    FormGroup, 
    Input, 
    FormFeedback, 
    Alert, 
    Label 
} from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

function Settings(props) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState(null);
    const [formAlertError, setformAlertError] = useState(null);

    //TODO: review errors works
    useEffect(() => {
        const profile = props.profile;
        if (profile.error && profile.error.errors) {
            const propsErrors = profile.error.errors;
            if (propsErrors.details){
                setformAlertError(propsErrors.details);
            }
            setErrors(propsErrors);
            let formErrors = {};
            for (let key in propsErrors) {
                formErrors[key] = propsErrors[key][0];
            }
            formik.setErrors(formErrors);
        }
    }, [props.profile.error]);

    //TODO: review errors works
    useEffect(() => {
        const user = props.user;
        if (user.error && user.error.errors) {
            const propsErrors = user.error.errors;
            if (propsErrors.details){
                setformAlertError(propsErrors.details);
            }
            let formErrors = {};
            for (let key in propsErrors) {
                formErrors[key] = propsErrors[key][0];
            }
            formik.setErrors(formErrors);
        }
    }, [props.user.error]);

    const formik = useFormik({
        initialValues: {
            first_name: props.profile.first_name || '',
            last_name: props.profile.last_name || '',
            email: (props.user.authorizedUser && props.user.authorizedUser.email) || ''
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired(),
            last_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired(),
            email: Yup.string()
                .email(t('Invalid email address'))
                .required(t('Please enter your email'))
        }),
        onSubmit: values => {
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
                        {/* Start User profile description */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Personal Info')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        formAlertError &&
                                         <Alert color="danger">{formAlertError}</Alert>
                                    }
                                    <Form onSubmit={formik.handleSubmit}>
                                        <FormGroup>
                                            <Label>{t('Photo')}</Label>
                                            <div className='pb-3'>
                                                <img src={avatar1} className="rounded-circle avatar-lg img-thumbnail"/>
                                            </div>
                                            <Input
                                                id="exampleFile"
                                                name="file"
                                                type="file"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>{t('First Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="first_name" 
                                                value={formik.values.first_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.first_name && formik.errors.first_name ? true : false}
                                                placeholder={t('Enter first name')}
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
                                                placeholder={t('Enter second name')}
                                            />
                                            {formik.touched.last_name && formik.errors.last_name && (
                                                <FormFeedback>{formik.errors.last_name}</FormFeedback>
                                            )}
                                        </FormGroup>
                                        <Button type="submit">{t('Update')}</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* end profile card */}
                        {/* Start User profile description */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Security section')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        formAlertError &&
                                         <Alert color="danger">{formAlertError}</Alert>
                                    }
                                    <Form onSubmit={formik.handleSubmit}>
                                        <FormGroup className='border p-3'>
                                            <Label>{t('Email')}:</Label>
                                            <div>
                                                {
                                                    props.user && props.user.authorizedUser 
                                                    && props.user.authorizedUser.email ||
                                                    t('Email information not found')
                                                }
                                            </div>
                                        </FormGroup>

                                        <FormGroup className='border p-3'>
                                            <Label>{t('Reset password')}</Label>
                                            <div className='pb-4'>
                                                <Input 
                                                    type="password" 
                                                    name="current_password" 
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.last_name && formik.errors.last_name ? true : false}
                                                    placeholder={t('Enter current password')}
                                                />
                                            </div>
                                            
                                            <Input 
                                                type="password" 
                                                name="new_password" 
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.last_name && formik.errors.last_name ? true : false}
                                                placeholder={t('Enter new password')}
                                            />
                                        </FormGroup>

                                        <Button type="submit">{t('Update')}</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* end profile card */}
                    </div>
                    {/* End User profile description */}   
                </div>
                {/* End scroll areaa */}  
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    profile: state.Profile,
    user: state.User
});

export default withRouter(connect(mapStateToProps)(Settings));
