import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import { connect } from "react-redux";
import { setLayoutMode, setLanguage } from "../../redux/actions";
import { useTranslation } from 'react-i18next';

//TODO move to css sprite
import usFlag from "../../assets/images/flags/us.jpg";
import spain from "../../assets/images/flags/spain.jpg";
import germany from "../../assets/images/flags/germany.jpg";
import italy from "../../assets/images/flags/italy.jpg";
import russia from "../../assets/images/flags/russia.jpg";

function SidebarMenuDesktop(props) {
    const {
        layoutMode,
        language, 
        avatar,
        setLayoutMode,
        setLanguage
    } = props;
    const { t } = useTranslation();

    const onChangeLayoutMode = (event) => { 
        event.preventDefault();
        let newLayoutMode = layoutMode;
        newLayoutMode === "dark" ? newLayoutMode = "light" : newLayoutMode = "dark";

        setLayoutMode(newLayoutMode);
    }

    const [dropdownProfile, setDropdownProfile] = useState(false);
    const [dropdownChangeLanguge, setDropdownChangeLanguge] = useState(false);

    const toggleProfile = () => setDropdownProfile(!dropdownProfile);
    const toggleChangeLanguge = () => setDropdownChangeLanguge(!dropdownChangeLanguge);

    useEffect(() => {
        document.body.setAttribute("data-bs-theme", layoutMode);
    }, [layoutMode]);
    
    return (
        <React.Fragment>
            {/* Desktop version start */}
            <div className="side-menu me-lg-1 d-none d-lg-block">
                    <Nav pills className="side-menu-nav justify-content-center" role="tablist">
                    <NavItem id="Agents" title={t('Agents')}>
                            <RouterNavLink to="/agents" id="pills-chat-tab" className="nav-link" activeclassname="active">
                                <i className="ri-contacts-book-line"></i>
                            </RouterNavLink>
                        </NavItem>
                        <NavItem id="Chats" title={t('Chats')}>
                            <RouterNavLink to="/chats" id="pills-chat-tab" className="nav-link" activeclassname="active">
                                <i className="ri-message-3-line"></i>
                            </RouterNavLink>
                        </NavItem>
                        <li className='flex-grow-1'></li>
                        <NavItem id="Settings" title={t('Settings')}>
                            <RouterNavLink 
                                to="/settings" 
                                id="pills-setting-tab" 
                                className="nav-link" 
                                activeclassname="active">
                                    <i className="ri-settings-2-line"></i>
                            </RouterNavLink>
                        </NavItem>
                        <Dropdown nav isOpen={dropdownChangeLanguge} className="btn-group dropup" toggle={toggleChangeLanguge}>
                            <DropdownToggle nav id="languages" title={t('Change Language')}>
                                <i className="ri-global-line"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => setLanguage('en')} active={language === "en"}>
                                    <img src={usFlag} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('English')}</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => setLanguage('es')} active={language === "es"}>
                                    <img src={spain} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Spanish')}</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => setLanguage('de')} active={language === "de"}>
                                    <img src={germany} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('German')}</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => setLanguage('it')} active={language === "it"}>
                                    <img src={italy} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Italian')}</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => setLanguage('ru')} active={language === "ru"}>
                                    <img src={russia} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Russian')}</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <NavItem id="light-dark" title={t('Dark / Light Mode')}>
                            <NavLink onClick={onChangeLayoutMode}>
                                <i className="ri-sun-line theme-mode-icon"></i>
                            </NavLink>
                        </NavItem>
                        <Dropdown nav isOpen={dropdownProfile} className="nav-item btn-group dropup profile-user-dropdown" toggle={toggleProfile}>
                            <DropdownToggle title={t('Profile')} className="nav-link" tag="a">
                                <img src={avatar} alt="" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <RouterNavLink to="/profile">
                                        {t('Profile')} <i className="ri-profile-line float-end text-muted"></i>
                                    </RouterNavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <RouterNavLink to="/settings">
                                        {t('Settings')} <i className="ri-settings-3-line float-end text-muted"></i>
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
           {/* Desktop version end */}
            
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        layoutMode: state.Layout.layoutMode,
        language: state.Layout.language,
        avatar: state.UserAgentProfile.avatar,
    };
};

const mapDispatchToProps = {
    setLayoutMode,
    setLanguage
  };

export default connect(mapStatetoProps, mapDispatchToProps)(SidebarMenuDesktop);