import React, { useState } from 'react';
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import { connect } from "react-redux";
import { setLayoutMode, setLanguage } from "../../redux/actions";
import { useTranslation } from 'react-i18next';

//TODO: move to sprite
import usFlag from "../../assets/images/flags/us.jpg";
import spain from "../../assets/images/flags/spain.jpg";
import germany from "../../assets/images/flags/germany.jpg";
import italy from "../../assets/images/flags/italy.jpg";
import russia from "../../assets/images/flags/russia.jpg";

function LeftSidebarMenu(props) {
    const { agent } = props;
    const { t } = useTranslation();

    function getAgentAvatar (){
        if (agent) {
            return agent.avatar;
        }
        return "";
    }

    const onChangeLayoutMode = (event) => { 
        event.preventDefault();
        let layoutMode = props.layoutMode; 
        layoutMode === "dark" ? layoutMode = "light" : layoutMode = "dark";

        props.setLayoutMode(layoutMode);
    }

    const [dropdownProfile, setDropdownProfile] = useState(false);
    const [dropdownChangeLanguge, setDropdownChangeLanguge] = useState(false);

    const toggleProfile = () => setDropdownProfile(!dropdownProfile);
    const toggleChangeLanguge = () => setDropdownChangeLanguge(!dropdownChangeLanguge);

    return (
        <React.Fragment>
            {/* Mobile version start */}
            <div className="side-menu d-lg-none">
                <Nav pills className="side-menu-nav justify-content-center" role="tablist">
                <NavItem id="Agents" title={t('Agents')}>
                        <RouterNavLink to="/agents" id="pills-chat-tab" className="nav-link" activeclassname="active">
                            <i className="ri-message-3-line"></i>
                        </RouterNavLink>
                    </NavItem>
                    <NavItem id="Chats" title={t('Chats')}>
                        <RouterNavLink to="/chats" id="pills-chat-tab" className="nav-link" activeclassname="active">
                            <i className="ri-message-3-line"></i>
                        </RouterNavLink>
                    </NavItem>

                    {/* TODO: Languages move to settings */}
                    <Dropdown nav isOpen={dropdownChangeLanguge} className="btn-group dropup" toggle={toggleChangeLanguge}>
                        <DropdownToggle nav title={t('Change Language')}>
                            <i className="ri-global-line"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => props.setLanguage('en')} active={props.language === "en"}>
                                <img src={usFlag} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('English')}</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => props.setLanguage('es')} active={props.language === "es"}>
                                <img src={spain} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Spanish')}</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => props.setLanguage('de')} active={props.language === "de"}>
                                <img src={germany} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('German')}</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => props.setLanguage('it')} active={props.language === "it"}>
                                <img src={italy} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Italian')}</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => props.setLanguage('ru')} active={props.language === "ru"}>
                                <img src={russia} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Russian')}</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* TODO: Dark/Light move to settings */}
                    <NavItem title={t('Dark / Light Mode')}>
                        <NavLink id="light-dark"  onClick={onChangeLayoutMode}>
                            <i className="ri-sun-line theme-mode-icon"></i>
                        </NavLink>
                    </NavItem>
                    <Dropdown nav isOpen={dropdownProfile} className="nav-item btn-group dropup profile-user-dropdown" toggle={toggleProfile}>
                        <DropdownToggle className="nav-link" tag="a" title={t('Profile')}>
                            <img src={getAgentAvatar()} alt="" className="profile-user rounded-circle" />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <RouterNavLink to="/profile">
                                    {t('Profile')} <i className="ri-profile-line float-end text-muted"></i>
                                </RouterNavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <RouterNavLink to="/settings">
                                    {t('Setting')} <i className="ri-settings-3-line float-end text-muted"></i>
                                </RouterNavLink>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
                                <RouterNavLink to="/logout">
                                    {t('Log out')} <i className="ri-logout-circle-r-line float-end text-muted"></i>
                                </RouterNavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Nav>
            </div>
            {/* Mobile version end */}
            
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        layoutMode: state.Layout.layoutMode,
        language: state.Layout.language,
        agent: state.Agent
    };
};

const mapDispatchToProps = {
    setLayoutMode,
    setLanguage
  };

export default connect(mapStatetoProps, mapDispatchToProps)(LeftSidebarMenu);