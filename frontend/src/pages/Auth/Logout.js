import { useEffect } from 'react';
import { connect } from 'react-redux';

//redux store
import { logoutUser } from '../../redux/actions';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
        useEffect(() => {
                console.log("Pages Auth Logout");
                props.logoutUser();
            }, []); 

        return null;
}

export default connect(null, { logoutUser })(Logout);