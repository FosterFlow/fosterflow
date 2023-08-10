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
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

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
            personalInfoForm.setErrors(formErrors);
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
            securityForm.setErrors(formErrors);
        }
    }, [props.user.error]);

    const personalInfoForm = useFormik({
        initialValues: {
            first_name: props.profile.first_name || '',
            last_name: props.profile.last_name || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired(),
            last_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired(),
        }),
        onSubmit: values => {
            console.log('Settings page personalInfoForm', 'onSubmit', values);
        },
    });

    const securityForm = useFormik({
        initialValues: {
            current_password: '', // initialize with an empty string
            new_password: ''     // initialize with an empty string
        },
        validationSchema: Yup.object({
            current_password: Yup.string()  // no requirement since it's optional
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    t('The password must meet the requirements below')  // Your custom error message for simplicity
                ),
            new_password: Yup.string()  // no requirement since it's optional
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    t('The password must meet the requirements below')  // Your custom error message for simplicity
                )
                .oneOf([Yup.ref('current_password'), null], t('Passwords must match'))
        }),
        onSubmit: values => {
            console.log('Settings page securityForm', 'onSubmit', values);
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
                                    <Form onSubmit={personalInfoForm.handleSubmit}>
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
                                                value={personalInfoForm.values.first_name}
                                                onChange={personalInfoForm.handleChange}
                                                onBlur={personalInfoForm.handleBlur}
                                                invalid={personalInfoForm.touched.first_name && personalInfoForm.errors.first_name ? true : false}
                                                placeholder={t('Enter first name')}
                                            />
                                            {personalInfoForm.touched.first_name && personalInfoForm.errors.first_name && (
                                                <FormFeedback>{personalInfoForm.errors.first_name}</FormFeedback>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Second Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="last_name" 
                                                value={personalInfoForm.values.last_name}
                                                onChange={personalInfoForm.handleChange}
                                                onBlur={personalInfoForm.handleBlur}
                                                invalid={personalInfoForm.touched.last_name && personalInfoForm.errors.last_name ? true : false}
                                                placeholder={t('Enter second name')}
                                            />
                                            {personalInfoForm.touched.last_name && personalInfoForm.errors.last_name && (
                                                <FormFeedback>{personalInfoForm.errors.last_name}</FormFeedback>
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
                                    <Form onSubmit={securityForm.handleSubmit}>
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

                                        <FormGroup>
                                            <Label>{t('Reset password')}</Label>
                                            <div className='pb-4'>
                                                <Input 
                                                    type="password" 
                                                    name="current_password" 
                                                    value={securityForm.values.current_password}
                                                    onChange={securityForm.handleChange}
                                                    onBlur={securityForm.handleBlur}
                                                    invalid={securityForm.touched.current_password && securityForm.errors.current_password ? true : false}
                                                    placeholder={t('Enter current password')}
                                                />
                                                <FormFeedback>
                                                    {securityForm.touched.current_password && securityForm.errors.current_password}
                                                </FormFeedback>
                                            </div>
                                            
                                            <Input 
                                                type="password" 
                                                name="new_password" 
                                                value={securityForm.values.new_password}
                                                onChange={securityForm.handleChange}
                                                onBlur={securityForm.handleBlur}
                                                invalid={securityForm.touched.new_password && securityForm.errors.new_password ? true : false}
                                                placeholder={t('Enter new password')}
                                            />
                                            <FormFeedback>
                                                {securityForm.touched.new_password && securityForm.errors.new_password}
                                            </FormFeedback>    
                                            <ul className='pt-3'>
                                                <li>{t('At least one lowercase character')}.</li>
                                                <li>{t('At least one uppercase character')}.</li>
                                                <li>{t('At least one digit')}.</li>
                                                <li>{t('At least one special character (in this set: @ $ ! % * ? & #)')}.</li>
                                                <li>{t('At least 8 characters in total')}.</li>
                                            </ul>
                                        </FormGroup>
                                        <Button type="submit">{t('Update password')}</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* end profile card */}
                    </div>
                    {/* End User profile description */}   
                </div>
                {/* End scroll areaa */} 
                <SideBarMenuMobile /> 
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    profile: state.Profile,
    user: state.User
});

export default withRouter(connect(mapStateToProps)(Settings));
