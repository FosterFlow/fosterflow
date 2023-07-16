import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card, Button } from "reactstrap";

import SimpleBar from "simplebar-react";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function Settings(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">
                <div className="px-4 pt-4">
                    <h4 className="mb-0">{t('Settings')}</h4>
                </div>

                <div className="text-center border-bottom p-4">
                    <div className="mb-4 profile-user">
                        <img src={avatar1} className="rounded-circle avatar-lg img-thumbnail"/>
                        <Button type="button" color="light" className="avatar-xs p-0 rounded-circle profile-photo-edit">
                            <i className="ri-pencil-fill"></i>
                        </Button>

                    </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{t('Patricia Smith')}</h5>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline-block mb-1">
                        <DropdownToggle tag="a" className="text-muted pb-1 d-block" >
                            {t('Available')} <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem>{t('Available')}</DropdownItem>
                            <DropdownItem>{t('Busy')}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {/* End profile user */}

                {/* Start User profile description */}
                <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">

                    <div id="profile-setting-accordion" className="custom-accordion">
                        <Card className="accordion-item border mb-2">
                            <CustomCollapse
                                title="Personal Info"
                                isOpen={isOpen1}
                                toggleCollapse={toggleCollapse1}
                            >

                                <div className="float-end">
                                    <Button color="light" size="sm" type="button" ><i className="ri-edit-fill me-1 align-middle"></i> {t('Edit')}</Button>
                                </div>

                                <div>
                                    <p className="text-muted mb-1">{t('Name')}</p>
                                    <h5 className="font-size-14">{t('Patricia Smith')}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Email')}</p>
                                    <h5 className="font-size-14">'adc@123.com'</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Time')}</p>
                                    <h5 className="font-size-14">'11:40 AM'</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Location')}</p>
                                    <h5 className="font-size-14 mb-0">{t('California')}, {t('USA')}</h5>
                                </div>
                            </CustomCollapse>
                            
                        </Card>
                        {/* end profile card */}

                    </div>
                    {/* end profile-setting-accordion */}
                </SimpleBar>
                {/* End User profile description */}
            </div>
        </React.Fragment>
    );
}

export default Settings;