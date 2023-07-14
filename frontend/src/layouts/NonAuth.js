import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeLayoutMode } from '../redux/actions';
import withRouter from '../components/withRouter';

const NonAuth = (props) => {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        let getLayoutMode = localStorage.getItem('layoutMode');
        if (getLayoutMode) {
            props.changeLayoutMode(getLayoutMode);
        } else {
            props.changeLayoutMode(props.layoutMode);
        }
        let currentPage = capitalizeFirstLetter(props.router.location.pathname);
        document.title = currentPage;
    }, []);

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
};

NonAuth.propTypes = {
    layoutMode: PropTypes.any,
};

const mapStateToProps = (state) => {
    const { layoutMode } = state.Layout;
    return { layoutMode };
};

export default withRouter(connect(mapStateToProps, { changeLayoutMode })(NonAuth));