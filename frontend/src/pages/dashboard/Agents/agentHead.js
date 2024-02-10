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
                    <Col sm={11} xs={10}>
                        <Link to="/agents" className="user-chat-back d-lg-none text-muted p-2">
                            <i className="ri-arrow-left-s-line"></i>
                        </Link>
                    </Col>
                </Row>
            </div>

        </React.Fragment>
    );
}


const mapStateToProps = (state) => {

    console.log("Dashabord Tabs UserHead mapStateToProps state", state);
    return { 
        activeChatId: state.Chat.activeChatId,
    };
};

const mapDispatchToProps = {
    actionDeleteChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));