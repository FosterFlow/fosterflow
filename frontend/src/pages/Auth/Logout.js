import { connect } from 'react-redux';

//redux store
import { logoutUser } from '../../redux/actions';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
        console.log("Pages Auth Logout");
        props.logoutUser();
}

export default connect(null, { logoutUser })(Logout);