import React, { useEffect } from 'react';
import { 
        Alert, 
        Spinner
    } from 'reactstrap';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../../redux/actions';


/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
        const { t } = useTranslation();
        const {
                logoutLoading
        } = props;

        useEffect(() => {
                console.log("Pages Auth Logout");
                props.logoutUser();
        }, []);

        return (
                <React.Fragment>
                        <div className="account-pages p-3">
                                {logoutLoading &&
                                        <Alert color="info">
                                                <span>
                                                        <Spinner size="sm"/>&nbsp;
                                                        {t('Clearing cache')}...
                                                </span>
                                        </Alert>
                                }
                        </div>
                </React.Fragment>
        )
}

const mapStateToProps = (state) => {
        const {
                logoutLoading
        } = state.Auth;

        return {
                logoutLoading
        };
};

export default connect(mapStateToProps, { logoutUser })(Logout);