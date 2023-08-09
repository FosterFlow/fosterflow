import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import {
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { useTranslation } from "react-i18next";

function Profile(props) {
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="user-profile me-lg-1">
        <div className="user-profile-wrapper">
          <div className="p-4">
            <div className="user-chat-nav float-end">
              <RouterNavLink to="/settings" className="btn btn-light btn-sm">
                <i className="ri-pencil-fill"></i> {t("Edit")}
              </RouterNavLink>
            </div>
            <h4 className="mb-0">{t("My Profile")}</h4>
          </div>

          <div className="user-profile-sroll-area">
            <div className="px-4 border-bottom">
              <div className="mb-4">
                <img
                  src={avatar1}
                  className="rounded-circle avatar-lg img-thumbnail"
                />
              </div>

              <h5 className="font-size-16 mb-1 text-truncate">
                {props.profile.first_name} {props.profile.last_name}
              </h5>
            </div>
            {/* End profile user  */}
        
            {/* Start user-profile-desc */}
            <div className="p-4">
              <Card className="border">
                  <CardHeader>{t("About")}</CardHeader>
                  <CardBody>
                    <p className="text-muted mb-1">{t("Name")} {t("Surname")}</p>
                    <h5 className="font-size-14">
                      {props.profile.first_name} {props.profile.last_name}
                    </h5>
                  </CardBody>
              </Card>
              {/* End About card  */}
            </div>
            {/* end user-profile-desc  */}
          </div>
          {/* end user-profile-scroll-area  */}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
