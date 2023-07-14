import React from 'react';
import { Collapse, CardBody, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";

//i18n
import { useTranslation } from 'react-i18next';

function CustomCollapse(props) {
    const { isOpen, toggleCollapse } = props;

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Link to="#" onClick={toggleCollapse} className="text-dark" >
                <CardHeader id="profile-user-headingOne">
                    <h5 className="font-size-14 m-0">
                        {
                            props.iconClass && <i className={props.iconClass + " me-2 align-middle d-inline-block"}></i>
                        }
                        {t(props.title)}
                        <i className={isOpen ? "mdi mdi-chevron-up float-end accor-plus-icon" : "mdi mdi-chevron-right float-end accor-plus-icon"}></i>
                    </h5>
                </CardHeader>
            </Link>

            <Collapse isOpen={isOpen}>
                <CardBody>
                    {props.children}
                </CardBody>
            </Collapse>
        </React.Fragment>
    );
}

export default CustomCollapse;