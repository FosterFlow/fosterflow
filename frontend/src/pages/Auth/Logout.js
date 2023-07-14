import { connect } from 'react-redux';
import withRouter from "../../components/withRouter";

//redux store
import { logoutUser } from '../../redux/actions';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = () => {
        console.log("Pages Auth Logout");
        localStorage.removeItem("tokens");
}

export default withRouter(connect(null, { logoutUser })(Logout));