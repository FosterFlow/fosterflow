import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
} from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from "react-i18next";

function Profile(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen2(false);
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <React.Fragment>
      <div className="chat-leftsidebar me-lg-1">
        <div className="px-4 pt-4">
          <div className="user-chat-nav float-end">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                tag="a"
                className="font-size-18 text-muted dropdown-toggle"
              >
                <i className="ri-more-2-fill"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>
                  <RouterNavLink to="/settings">
                    {t("Edit")}
                  </RouterNavLink>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <h4 className="mb-0">{t("My Profile")}</h4>
        </div>

        <div className="text-center p-4 border-bottom">
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
        <div className="p-4 user-profile-desc">

          <div id="profile-user-accordion-1" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
              <CustomCollapse
                title="About"
                iconClass="ri-user-2-line"
                isOpen={isOpen1}
                toggleCollapse={toggleCollapse1}
              >
                <div>
                  <p className="text-muted mb-1">{t("Name")} {t("Surname")}</p>
                  <h5 className="font-size-14">
                    {props.profile.first_name} {props.profile.last_name}
                  </h5>
                </div>
              </CustomCollapse>
            </Card>
            {/* End About card  */}

          </div>
          {/* end profile-user-accordion  */}
        </div>
        {/* end user-profile-desc  */}
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
