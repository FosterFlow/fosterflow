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
    Label,
    Spinner 
} from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';
import { updateProfileData, changePassword, updateProfileAvatar } from '../../../redux/actions';

function Settings(props) {
    const { t } = useTranslation();
    const [formAlertError, setformAlertError] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        const profile = props.profile;
        if (profile.error && profile.error.errors) {
            const propsErrors = profile.error.errors;
            if (propsErrors.details){
                setformAlertError(propsErrors.details);
            }

            let formErrors = {};
            for (let key in propsErrors) {
                formErrors[key] = propsErrors[key][0];
            }
            personalInfoForm.setErrors(formErrors);
        }
    }, [props.profile.error]);

    function getProfileAvatar (){
        if (selectedAvatar !== null){
            return URL.createObjectURL(selectedAvatar);
        }

        if (props.profile && props.profile.profile) {
          const profile = props.profile.profile;
          return profile.avatar;
        }
        return "";
      }

    function submitAvatar (event){
        event.preventDefault();

        if (selectedAvatar !== null){
            const user = props.user;
            
            if (user && user.authorizedUser) {
                props.updateProfileAvatar(user.authorizedUser.id, selectedAvatar);
                return;
            }
        }

        //TODO: show exception, that avatar wasn't chosen
    }

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

    function getFirstName (){
        return (props.profile
        && props.profile.profile 
        && props.profile.profile.first_name) || '';
    }

    function getLastName (){
        return (props.profile
            && props.profile.profile  
            && props.profile.profile.last_name) || ''
    }

    //Filling the form after page reloading
    useEffect(() => {
        const lastName = getLastName();
        const formikLastName = personalInfoForm.values.last_name;

        if ((lastName !== "") && (formikLastName === "")) {
            personalInfoForm.setFieldValue('last_name', lastName);
        }

        const firstName = getFirstName();
        const formikFirstName = personalInfoForm.values.first_name;
        
        if ((firstName !== "") && (formikFirstName === "")) {
            personalInfoForm.setFieldValue('first_name', firstName);
        }
    }, [props.profile]);

    const personalInfoForm = useFormik({
        initialValues: {
            first_name: getFirstName(),
            last_name: getLastName(),
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
            const user = props.user;
            if (user && user.authorizedUser) {
                props.updateProfileData(user.authorizedUser.id, values);
                return;
            } 
            //TODO: handle error if we don't have active User;
            console.log ('Settings page personalInfoForm', 'onSubmit error', "No active user");
        },
    });

    const securityForm = useFormik({
        initialValues: {
            current_password: '', // initialize with an empty string
            new_password: ''     // initialize with an empty string
        },
        validationSchema: Yup.object({
            current_password: Yup.string()  // no requirement since it's optional
                .required(t('Please enter your current password')),
            new_password: Yup.string() 
                .required(t('Please enter new password'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    t('The password must meet the requirements below')  // Your custom error message for simplicity
                )
        }),
        onSubmit: values => {
            console.log('Settings page securityForm', 'onSubmit', values);
            const currentPassword = values.current_password;
            const newPassword = values.new_password;
            props.changePassword(currentPassword, newPassword);
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
                        {/* Start Avatar card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('User\'s photo')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        formAlertError &&
                                         <Alert color="danger">{formAlertError}</Alert>
                                    }
                                    <Form onSubmit={submitAvatar}>
                                        <FormGroup>
                                            <Label>{t('Photo')}</Label>
                                            <div className='pb-3'>
                                            <img 
                                                src={getProfileAvatar ()} 
                                                className="rounded-circle avatar-lg img-thumbnail"
                                                />
                                            </div>
                                            <Input
                                                id="exampleFile"
                                                name="file"
                                                type="file"
                                                disabled={props.profile.avatarLoading}
                                                onChange={(e) => setSelectedAvatar(e.target.files[0])} // Handle file selection
                                            />
                                        </FormGroup>
                                        <Button type="submit" disabled={props.profile.avatarLoading}>
                                            {props.profile.avatarLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End Avatar card */}
                        {/* Start Personal information card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Personal information')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        formAlertError &&
                                         <Alert color="danger">{formAlertError}</Alert>
                                    }
                                    <Form onSubmit={personalInfoForm.handleSubmit}>
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
                                                disabled={props.profile.profileDataLoading}
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
                                                disabled={props.profile.profileDataLoading}
                                            />
                                            {personalInfoForm.touched.last_name && personalInfoForm.errors.last_name && (
                                                <FormFeedback>{personalInfoForm.errors.last_name}</FormFeedback>
                                            )}
                                        </FormGroup>
                                        <Button type="submit" disabled={props.profile.profileDataLoading}>
                                            {props.profile.profileDataLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End Personal information card */}
                        {/* Start Security section card */}
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
                                                    disabled={props.auth.changePasswordLoading}
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
                                                disabled={props.auth.changePasswordLoading}
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
                                        <Button type="submit" disabled={props.auth.changePasswordLoading}>
                                            {props.auth.changePasswordLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update password')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End security card */}
                    </div>
                    {/* End User profile description */}   
                </div>
                {/* End scroll areaa */} 
                <SideBarMenuMobile /> 
            </div>
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields
const mapStateToProps = (state) => ({
    profile: state.Profile,
    user: state.User,
    auth: state.Auth
});

const mapDispatchToProps = {
    updateProfileData,
    changePassword,
    updateProfileAvatar
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));