import { 
    Container, 
    Spinner
} from 'reactstrap';
import { Navigate  } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import withRouter from "../../components/withRouter";
import { 
    confirmEmail,
} from '../../redux/actions';
import { useTranslation } from 'react-i18next';

const EmailVerification = (props) => {
    const { t } = useTranslation();
    const { token } = useParams();
    const {
        isAuthenticated,
        confirmEmailLoading,
        confirmEmail,
     } = props;

    useEffect(() => {
        //TODO: move this logic to templates?
        console.log("useEffect", token);
        confirmEmail(token);
    }, []);

    return (
        //TODO: move this logic to the router?
        <React.Fragment>
            {!confirmEmailLoading && (
                <>
                    {isAuthenticated && (
                        // TODO: We have to show successfull / errors messages at chats page
                        <Navigate to={{ pathname: "/chats" }} />
                    )}
                    {!confirmEmailLoading && (
                        // TODO: We have to show successfull / errors message at login page
                        <Navigate to={{ pathname: "/login" }} />
                    )}
                </>
            )}
            <Container className="justify-content-center pt-5">
                {confirmEmailLoading && (
                    <p>
                        <Spinner size="sm"/> {t('Loading')}...
                    </p>
                )}
            </Container>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const {
        isAuthenticated,
        confirmEmailLoading,
    } = state.Auth;
    return {
        isAuthenticated, 
        confirmEmailLoading,
    };
};

const mapDispatchToProps = {
    confirmEmail,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailVerification));