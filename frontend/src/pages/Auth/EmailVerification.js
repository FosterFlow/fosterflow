import { Container, Row, Col, CardBody, Alert } from 'reactstrap';
import { Link, Navigate  } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { confirmEmail } from '../../redux/actions';
import { useTranslation } from 'react-i18next';

//TODO need to handle 2 cases: when we redirect to authorized page or not authorized page

function EmailVerification(props) {
    const { t } = useTranslation();
    let { token } = useParams();

    console.log("EmailVerification page");

    useEffect(() => {
        // Dispatch the action to confirm the email when the component mounts
        props.confirmEmail(token);
    }, []);

    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            {/* TODO: need to manage 3 cases: loading, confirmed, error */}
                            <CardBody className="p-4">
                                {/* In case if user is already logged in it manages at router */}
                                {props.emailConfirmed ? (
                                    // We have to show successfull message at login page
                                    <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
                                ) : (
                                    <Alert color="danger">
                                        {t('Confirmation failed')}.
                                    </Alert>
                                )}
                                <Link to="/login" className="font-weight-medium text-primary"> {t('Sign in now')} </Link>
                            </CardBody>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { loading, emailConfirmed } = state.Auth;
    return { loading, emailConfirmed };
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirmEmail: (token) => dispatch(confirmEmail(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);