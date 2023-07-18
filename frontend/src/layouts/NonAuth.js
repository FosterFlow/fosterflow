import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import withRouter from '../components/withRouter';

const NonAuth = (props) => {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (props.layoutMode){
        //TODO: move to jsx template
        document.body.setAttribute("data-bs-theme", props.layoutMode);
    }

    useEffect(() => {
        let currentPage = capitalizeFirstLetter(props.router.location.pathname);
        document.title = currentPage;
    }, []);

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return { 
        layoutMode: state.Layout.layoutMode
    };
};

export default withRouter(connect(mapStateToProps)(NonAuth));