import React from 'react';
import { NavLink as RouterNavLink } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { useTranslation } from "react-i18next";

const Profile = (props) => {
  /* intilize t variable for multi language implementation */
  const { 
    profile,
    avatar,
    firstName,
    lastName
  } = props;
  const { t } = useTranslation();

  function fullName (){
    if (profile !== null) {
      return firstName + " " + lastName; 
    }

    return t("Name not specified");
  }

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
            <div className="px-4 pb-4">
              <div className="mb-4">
                <img
                  src={avatar}
                  className="rounded-circle avatar-lg img-thumbnail"
                />
              </div>

              <h5 className="font-size-16 mb-1 text-truncate">
                {fullName()}
              </h5>
            </div>
            {/* End profile user  */}
          </div>
          {/* end user-profile-scroll-area  */}
        </div>
      </div>
    </React.Fragment>
  );
}

//TODO: suscribe only to required fields. Prevent redundunt re-render 
const mapStateToProps = (state) => ({
  profile: state.UserAgentProfile.profile,
  firstName: state.UserAgentProfile.firstName,
  lastName: state.UserAgentProfile.lastName,
  avatar: state.UserAgentProfile.avatar,
});

export default withRouter(connect(mapStateToProps)(Profile));
