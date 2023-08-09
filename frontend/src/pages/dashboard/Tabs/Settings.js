import React from 'react';
import { Card, Button, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

function Settings(props) {
    const { t } = useTranslation();

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
                                <Button type="button" color="light" className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                    <i className="ri-pencil-fill"></i>
                                </Button>
                            </div>

                            <h5 className="font-size-16 mb-1 text-truncate">
                                {props.profile.first_name} {props.profile.last_name}
                            </h5>
                        </div>
                        {/* End profile user */}

                        {/* Start User profile description */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Personal Info')}
                                </CardHeader>
                                <CardBody>
                                    <div className="float-end">
                                        <Button color="light" size="sm" type="button" >
                                            <i className="ri-edit-fill me-1 align-middle"></i> {t('Edit')}
                                        </Button>
                                    </div>

                                    <div>
                                        <p className="text-muted mb-1">{t('Full Name')}</p>
                                        <h5 className="font-size-14">
                                            {props.profile.first_name} {props.profile.last_name}
                                        </h5>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Email')}</p>
                                        <h5 className="font-size-14">
                                            {props.user.authorizedUser.email}
                                        </h5>
                                    </div>
                                </CardBody>
                            </Card>
                            {/* end profile card */}
                        </div>
                        {/* End User profile description */}
                    </div>
                    {/* End scroll areaa */}     
                </div>
                <SideBarMenuMobile />
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    profile: state.Profile,
    user: state.User
});

const mapDispatchToProps = {
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));