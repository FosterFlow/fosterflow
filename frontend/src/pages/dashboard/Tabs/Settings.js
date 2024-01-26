import React, { 
    useEffect, 
    useState, 
    useRef  
} from 'react';
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
import _ from 'lodash';
import withRouter from "../../../components/withRouter";
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';
import {
    updateUserAgentProfileData,
    updateUserAgentProfileDataInitState,
    updateUserAgentProfileDataFailed,

    changePassword,
    changePasswordInitState,
    changePasswordFailure,

    updateUserAgentProfileAvatar,
    getUserAgentProfile 
} from '../../../redux/actions';
import AvatarEditor from 'react-avatar-editor'

function Settings(props) {
    const { t } = useTranslation();
    const { 
        agents,
        agent,
        profile,
        user,
        auth,

        firstName,
        lastName,
        profileId,

        updateUserAgentProfileData,
        updateUserAgentProfileDataInitState,
        updateUserAgentProfileDataFailed,
        
        changePassword,
        changePasswordInitState,
        changePasswordFailure,
        
        updateUserAgentProfileAvatar,
        getUserAgentProfile
    } = props;
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const avatarEditorRef = useRef(null);

    //TODO: redevelop to flat structure into agent and remove this method
    function getAgentAvatar (){
        if (selectedAvatar !== null){
            return URL.createObjectURL(selectedAvatar);
        }

        if (agents) {
            return agents.avatar;
        }
        return "";
      }

    function submitAvatar(event) {
        event.preventDefault();
    
        if (avatarEditorRef.current) {
            const canvas = avatarEditorRef.current.getImageScaledToCanvas();
            canvas.toBlob((blob) => {
                // You now have the cropped image as a blob
                
                const formData = new FormData();
                formData.append('avatar', blob);
    
                if (user && user.authorizedUser) {
                    updateUserAgentProfileAvatar(user.authorizedUser.id, formData);
                    return;
                }
                
                // TODO: Handle any errors or other scenarios here
            });
        }
    }

    /**
     * Setting the lastName, once we get it from the server
     * 
    **/
    useEffect(() => {
        // Check if both firstName and lastName have values
        if (firstName !== "" && lastName !== "") {
            personalInfoForm.setValues({
                ...personalInfoForm.values, // Preserve other form values
                first_name: firstName,
                last_name: lastName
            });
        }
    }, [profile]);

    const personalInfoForm = useFormik({
        initialValues: {
            first_name: firstName,
            last_name: lastName,
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:+<>=/]+$/, t('No special characters allowed'))
                .required(t('Please enter your first name')),
            last_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:+<>=/]+$/, t('No special characters allowed'))
                .required(t('Please enter your last name')),
        }),
        onSubmit: values => {
            console.log('Settings page personalInfoForm', 'onSubmit', values);
            if (profileId !== 0) {
                updateUserAgentProfileData(profileId, values);
                return;
            } 
            //TODO: handle error if we don't have active User;
            console.log ('Settings page personalInfoForm', 'onSubmit error', "No profile id");
        },
    });

    useEffect(() => {
        const personalInfoFormErrors = personalInfoForm.errors;
        const errors = {};

        if (_.isEmpty(personalInfoFormErrors)) {
            if (personalInfoFormErrors === null) {
                return;
            }

            updateUserAgentProfileDataInitState();
            return;
        }

        const firstNameErrors = personalInfoFormErrors.first_name;
        if (firstNameErrors) {
            if (Array.isArray(firstNameErrors)){
                errors.firs_name = [...firstNameErrors];
            } else {
                errors.first_name = [firstNameErrors];
            }
        }

        const lastNameErrors = personalInfoFormErrors.last_name;
        if (lastNameErrors) {
            if (Array.isArray(lastNameErrors)){
                errors.last_name = [...lastNameErrors];
            } else {
                errors.last_name = [lastNameErrors];
            }
        }

        updateUserAgentProfileDataFailed(errors);
    }, [personalInfoForm.errors]);

    const securityForm = useFormik({
        initialValues: {
            old_password: '', // initialize with an empty string
            new_password: ''     // initialize with an empty string
        },
        validationSchema: Yup.object({
            old_password: Yup.string()  // no requirement since it's optional
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
            const oldPassword = values.old_password;
            const newPassword = values.new_password;
            changePassword(oldPassword, newPassword);
        },
    });

    useEffect(() => {
        const securityFormErrors = securityForm.errors;
        const errors = {};

        if (_.isEmpty(securityFormErrors)) {
            if (securityFormErrors === null) {
                return;
            }

            changePasswordInitState();
            return;
        }

        const oldPasswordErrors = securityFormErrors.old_password;
        if (oldPasswordErrors) {
            if (Array.isArray(oldPasswordErrors)){
                errors.old_password = [...oldPasswordErrors];
            } else {
                errors.old_password = [oldPasswordErrors];
            }
        }

        const newPasswordErrors = securityFormErrors.new_password;
        if (newPasswordErrors) {
            if (Array.isArray(newPasswordErrors)){
                errors.new_password = [...newPasswordErrors];
            } else {
                errors.new_password = [newPasswordErrors];
            }
        }

        changePasswordFailure(errors);
    }, [securityForm.errors]);

    useEffect(() => {
        if (agent === null) {
          return
        }
    
        if (profile === null) {
          getUserAgentProfile(agent.id)
        }
    
    }, [profile, agent]);

    return (
        <React.Fragment>
            <div className="user-profile me-lg-1">
                <div className="user-profile-wrapper">
                    <div className="p-4">
                        <h4 className="mb-0">{t('Settings')}</h4>
                    </div>

                    <div className="user-profile-sroll-area">
                        {
                            (agents && agents.errors) &&
                            <Alert color="danger">{agents.errors}</Alert>
                        }
                        {/* Start Avatar card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('User\'s photo')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        (agents && agents.avatarErrors 
                                            && typeof agents.avatarErrors === "string") &&
                                        <Alert color="danger">{agents.avatarErrors}</Alert>
                                    }
                                    {
                                         agents.avatarSuccess &&
                                         <Alert color="success">{t("The photo has been successfully updated")}.</Alert>
                                    }
                                    <Form onSubmit={submitAvatar}>
                                        <FormGroup>
                                            <Label>{t('Photo')}</Label>
                                            <div className='pb-3'>
                                            </div>
                                            <AvatarEditor
                                                ref={avatarEditorRef}
                                                image={getAgentAvatar ()} 
                                                className="rounded-circle avatar-lg img-thumbnail"
                                                width={150}
                                                height={150}
                                                border={0}
                                                color={[255, 255, 255, 0.6]} // RGBA
                                                scale={1}
                                                rotate={0}
                                            />
                                            <Input
                                                id="exampleFile"
                                                name="file"
                                                type="file"
                                                disabled={agents.avatarLoading}
                                                onChange={(e) => setSelectedAvatar(e.target.files[0])} // Handle file selection
                                            />
                                            <FormFeedback>
                                                {
                                                    agents.avatarErrors 
                                                    && typeof agents.avatarErrors === "object"
                                                    && agents.avatarErrors.avatar
                                                }
                                            </FormFeedback>
                                        </FormGroup>
                                        <Button type="submit" disabled={agents.avatarLoading}>
                                            {agents.avatarLoading &&
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
                                        (agents && agents.agentDataErrors 
                                            && typeof agents.agentDataErrors === "string") &&
                                        <Alert color="danger">{agents.agentDataErrors}</Alert>
                                    }
                                    {
                                         agents.agentDataSuccess &&
                                         <Alert color="success">{t("Personal information has been successfully updated")}.</Alert>
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
                                                invalid={!!(personalInfoForm.touched.first_name 
                                                    && agents.agentDataErrors
                                                    && agents.agentDataErrors.first_name)}
                                                placeholder={t('Enter first name')}
                                                disabled={agents.agentDataLoading}
                                            />
                                            {personalInfoForm.touched.first_name 
                                                && agents.agentDataErrors
                                                && agents.agentDataErrors.first_name
                                                && (
                                                    <FormFeedback type="invalid">
                                                        <ul>
                                                            {agents.agentDataErrors.first_name.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </FormFeedback>
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
                                                placeholder={t('Enter second name')}
                                                invalid={!!(personalInfoForm.touched.last_name 
                                                    && agents.agentDataErrors
                                                    && agents.agentDataErrors.last_name)}
                                                disabled={agents.agentDataLoading}
                                            />
                                            {personalInfoForm.touched.last_name 
                                                && agents.agentDataErrors
                                                && agents.agentDataErrors.last_name
                                                && (
                                                    <FormFeedback type="invalid">
                                                        <ul>
                                                            {agents.agentDataErrors.last_name.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <Button type="submit" disabled={agents.agentDataLoading}>
                                            {agents.agentDataLoading &&
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
                                        (auth && auth.changePassswordErrors 
                                            && typeof auth.changePassswordErrors === "string") &&
                                        <Alert color="danger">{auth.changePassswordErrors}</Alert>
                                    }
                                    {
                                         auth.changePasswordSuccess &&
                                         <Alert color="success">{t("The password has been successfully changed")}.</Alert>
                                    }
                                    <Form onSubmit={securityForm.handleSubmit}>
                                        <FormGroup className='border p-3'>
                                            <Label>{t('Email')}:</Label>
                                            <div>
                                                {
                                                    user && user.authorizedUser 
                                                    && user.authorizedUser.email ||
                                                    t('Email information not found')
                                                }
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Reset password')}</Label>
                                            <div className='pb-4'>
                                                <Input 
                                                    type="password" 
                                                    name="old_password" 
                                                    value={securityForm.values.old_password}
                                                    onChange={securityForm.handleChange}
                                                    onBlur={securityForm.handleBlur}
                                                    placeholder={t('Enter current password')}
                                                    invalid={!!(securityForm.touched.old_password 
                                                        && auth.changePassswordErrors
                                                        && auth.changePassswordErrors.old_password)}
                                                    disabled={auth.changePasswordLoading}
                                                />
                                                {securityForm.touched.old_password 
                                                    && auth.changePassswordErrors
                                                    && auth.changePassswordErrors.old_password
                                                    && (
                                                        <FormFeedback type="invalid">
                                                            <ul>
                                                                {auth.changePassswordErrors.old_password.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>
                                                )}
                                            </div>
                                            
                                            <Input 
                                                type="password" 
                                                name="new_password" 
                                                value={securityForm.values.new_password}
                                                onChange={securityForm.handleChange}
                                                onBlur={securityForm.handleBlur}
                                                placeholder={t('Enter new password')}
                                                invalid={!!(securityForm.touched.new_password
                                                    && auth.changePassswordErrors
                                                    && auth.changePassswordErrors.new_password)}
                                                disabled={auth.changePasswordLoading}
                                            />
                                            {securityForm.touched.new_password
                                                && auth.changePassswordErrors
                                                && auth.changePassswordErrors.new_password
                                                && (
                                                    <FormFeedback type="invalid">
                                                        <ul>
                                                            {auth.changePassswordErrors.new_password.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </FormFeedback>
                                            )}   
                                            <ul className='pt-3'>
                                                <li>{t('At least one lowercase character')}.</li>
                                                <li>{t('At least one uppercase character')}.</li>
                                                <li>{t('At least one digit')}.</li>
                                                <li>{t('At least one special character (in this set: @ $ ! % * ? & #)')}.</li>
                                                <li>{t('At least 8 characters in total')}.</li>
                                            </ul>
                                        </FormGroup>
                                        <Button type="submit" disabled={auth.changePasswordLoading}>
                                            {auth.changePasswordLoading &&
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
    agents: state.Agents,
    agent: state.Agents.agent,
    profile: state.UserAgentProfile.userAgentProfile,
    firstName: state.UserAgentProfile.firstName,
    lastName: state.UserAgentProfile.lastName,
    profileId: state.UserAgentProfile.id,
    user: state.User,
    auth: state.Auth
});

const mapDispatchToProps = {
    updateUserAgentProfileData,
    updateUserAgentProfileDataInitState,
    updateUserAgentProfileDataFailed,

    changePassword,
    changePasswordInitState,
    changePasswordFailure,

    updateUserAgentProfileAvatar,
    getUserAgentProfile
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));