import React, { useEffect } from 'react';
import withRouter from '../components/withRouter';
import { getLayoutMode } from '../redux/layout/actions';

const NonAuth = (props) => {
    const layoutMode = getLayoutMode();
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    document.body.setAttribute("data-bs-theme", layoutMode);

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

export default withRouter(NonAuth);