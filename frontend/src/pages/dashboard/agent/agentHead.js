import React from 'react';
import { Row, Col } from "reactstrap";
import { 
    Link
} from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { deleteChat as actionDeleteChat} from "../../../redux/chat/actions";

function UserHead(props) {
    return (
        <React.Fragment>
            <div className="container-fluid user-chat-header">
                <Row className="m-0">
                    <Col sm={6} xs={10} >
                        <Row>
                        <Col sm={1} xs={1}>
                            <Link to="/agents" className="user-chat-back text-muted p-2 d-lg-none">
                                <i className="ri-arrow-left-s-line"></i>
                            </Link>
                        </Col>
                        <Col>
                            <span className="user-chat-agent pt-2 ps-2">{props.activeAgent?.name}</span>
                        </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

        </React.Fragment>
    );
}


const mapStateToProps = (state) => {

    console.log("Dashabord Tabs UserHead mapStateToProps state", state);
    return { 
        activeAgent: state.Agents.activeAgent
    };
};

const mapDispatchToProps = {
    actionDeleteChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));