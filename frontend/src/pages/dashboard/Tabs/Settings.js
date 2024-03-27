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
    Spinner,
    InputGroup 
} from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import _ from 'lodash';
import withRouter from "../../../components/withRouter";
import {
    updateUserAgentProfileData,
    updateUserAgentProfileDataInitState,
    updateUserAgentProfileDataFailed,

    changePassword,
    changePasswordInitState,
    changePasswordFailure,

    updateUserAgentProfileAvatar
} from '../../../redux/actions';
import AvatarEditor from 'react-avatar-editor'

function Settings(props) {
    const { t } = useTranslation();
    const { 
        userAgent,
        profile,
        user,
        auth,

        firstName,
        lastName,
        profileId,
        avatar,

        updateUserAgentProfileData,
        updateUserAgentProfileDataInitState,
        updateUserAgentProfileDataFailed,

        userAgentProfileAvatarErrors,
        userAgentProfileAvatarSuccess,
        userAgentProfileAvatarLoading,

        userAgentProfileDataLoading,
        userAgentProfileDataErrors,
        userAgentProfileDataSuccess,
        
        changePassword,
        changePasswordInitState,
        changePasswordFailure,
        
        updateUserAgentProfileAvatar,
    } = props;
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const avatarEditorRef = useRef(null);
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordNewShown, setPasswordNewShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown => !passwordShown);
    };

    const togglePasswordNewVisibility = () => {
        setPasswordNewShown(passwordNewShown => !passwordNewShown);
    };

    function getAgentAvatar (){
        if (selectedAvatar !== null){
            return URL.createObjectURL(selectedAvatar);
        }

        return avatar;
      }

    function submitAvatar(event) {
        event.preventDefault();
    
        if (avatarEditorRef.current) {
            const canvas = avatarEditorRef.current.getImageScaledToCanvas();
            
            // Specify the MIME type for the Blob
            canvas.toBlob((blob) => {
                // You now have the cropped image as a blob with an extension
                
                const formData = new FormData();
                formData.append('avatar', blob, 'avatar.png'); // Add a file name with extension
    
                if (profileId) {
                    updateUserAgentProfileAvatar(profileId, formData);
                    return;
                }
                
                // TODO: Handle any errors or other scenarios here
            }, 'image/png'); // MIME type for PNG
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

    return (
        <React.Fragment>
            <div className="user-profile me-lg-1">
                <div className="user-profile-wrapper">
                    <div className="p-4">
                        <h4 className="mb-0">{t('Settings')}</h4>
                    </div>

                    <div className="user-profile-sroll-area">
                        {
                            (userAgent && userAgent.errors) &&
                            <Alert color="danger">{userAgent.errors}</Alert>
                        }
                        {
                            (profile && profile.errors) &&
                            <Alert color="danger">{profile.errors}</Alert>
                        }    
                        {/* Start Avatar card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('User\'s photo')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        userAgentProfileAvatarErrors?.avatar &&
                                        <Alert color="danger">{userAgentProfileAvatarErrors.avatar}</Alert>
                                    }
                                    {
                                         userAgentProfileAvatarSuccess &&
                                         <Alert color="success">{t("The photo has been successfully updated")}.</Alert>
                                    }
                                    <Form onSubmit={submitAvatar}>
                                        <FormGroup>
                                            <Label>{t('Photo')}</Label>
                                            <div className='pb-3'>
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
                                            </div>
                                            <Input
                                                id="exampleFile"
                                                name="file"
                                                type="file"
                                                disabled={userAgentProfileAvatarLoading}
                                                onChange={(e) => setSelectedAvatar(e.target.files[0])} // Handle file selection
                                            />
                                            <FormFeedback>
                                                {
                                                    userAgentProfileAvatarErrors?.avatar
                                                }
                                            </FormFeedback>
                                        </FormGroup>
                                        <Button type="submit" disabled={userAgentProfileAvatarLoading}>
                                            {userAgentProfileAvatarLoading &&
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
                                        (userAgentProfileDataErrors 
                                            && typeof userAgentProfileDataErrors === "string") &&
                                        <Alert color="danger">{userAgentProfileDataErrors}</Alert>
                                    }
                                    {
                                         userAgentProfileDataSuccess &&
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
                                                    && userAgentProfileDataErrors
                                                    && userAgentProfileDataErrors.first_name)}
                                                placeholder={t('Enter first name')}
                                                disabled={userAgentProfileDataLoading}
                                            />
                                            {personalInfoForm.touched.first_name 
                                                && userAgentProfileDataErrors
                                                && userAgentProfileDataErrors.first_name
                                                && (
                                                    <FormFeedback type="invalid">
                                                        <ul>
                                                            {userAgentProfileDataErrors.first_name.map((error, index) => (
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
                                                    && userAgentProfileDataErrors
                                                    && userAgentProfileDataErrors.last_name)}
                                                disabled={userAgentProfileDataLoading}
                                            />
                                            {personalInfoForm.touched.last_name 
                                                && userAgentProfileDataErrors
                                                && userAgentProfileDataErrors.last_name
                                                && (
                                                    <FormFeedback type="invalid">
                                                        <ul>
                                                            {userAgentProfileDataErrors.last_name.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <Button type="submit" disabled={userAgentProfileDataLoading}>
                                            {userAgentProfileDataLoading &&
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
                                                    (user && user.authorizedUser 
                                                    && user.authorizedUser.email) || 
                                                    t('Email information not found')
                                                }
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Reset password')}</Label>
                                                <div className='pb-4'>
                                                    <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                        <span className="input-group-text text-muted">
                                                            <i className="ri-lock-2-line"></i>
                                                        </span>
                                                        <Input 
                                                            type={passwordShown ? "text" : "password"}
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
                                                        <span className="input-group-text border-light text-muted" onClick={togglePasswordVisibility} style={{cursor: 'pointer'}}>
                                                            {passwordShown ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
                                                        </span>
                                                        {securityForm.touched.old_password && auth.changePassswordErrors && auth.changePassswordErrors.old_password && (
                                                            <FormFeedback type="invalid">
                                                                <ul>
                                                                    {auth.changePassswordErrors.old_password.map((error, index) => (
                                                                        <li key={index}>{error}</li>
                                                                    ))}
                                                                </ul>
                                                            </FormFeedback>
                                                        )}
                                                    </InputGroup>
                                                </div>
                                            
                                            <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                <span className="input-group-text text-muted">
                                                    <i className="ri-lock-2-line"></i>
                                                </span>
                                                <Input 
                                                    type={passwordNewShown ? "text" : "password"}
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
                                                <span className="input-group-text border-light text-muted" onClick={togglePasswordNewVisibility} style={{cursor: 'pointer'}}>
                                                    {passwordNewShown ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
                                                </span>
                                                {securityForm.touched.new_password && auth.changePassswordErrors && auth.changePassswordErrors.new_password
                                                    && (
                                                        <FormFeedback type="invalid">
                                                            <ul>
                                                                {auth.changePassswordErrors.new_password.map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        </FormFeedback>
                                                    )}
                                            </InputGroup>   
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
            </div>
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields
const mapStateToProps = (state) => ({
    userAgent: state.Agents.userAgent,
    profile: state.UserAgentProfile.profile,
    firstName: state.UserAgentProfile.firstName,
    lastName: state.UserAgentProfile.lastName,
    profileId: state.UserAgentProfile.id,
    avatar: state.UserAgentProfile.avatar,
    userAgentProfileAvatarErrors: state.UserAgentProfile.userAgentProfileAvatarErrors,
    userAgentProfileAvatarSuccess: state.UserAgentProfile.userAgentProfileAvatarSuccess,
    userAgentProfileAvatarLoading: state.UserAgentProfile.userAgentProfileAvatarLoading,
    userAgentProfileDataLoading: state.UserAgentProfile.userAgentProfileDataLoading,
    userAgentProfileDataErrors: state.UserAgentProfile.userAgentProfileDataErrors,
    userAgentProfileDataSuccess: state.UserAgentProfile.userAgentProfileDataSuccess,
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
    updateUserAgentProfileAvatar    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
