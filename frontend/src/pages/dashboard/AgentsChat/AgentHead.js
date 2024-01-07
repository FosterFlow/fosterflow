import React from 'react';
import { Row, Col } from "reactstrap";
import { 
    Link, 
    useLocation 
} from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { deleteChat as actionDeleteChat} from "../../../redux/chat/actions";

function UserHead(props) {
    const location = useLocation();
    const isNewChat = location.pathname === '/chats/new_chat';

    function deleteChat(event) {
        event.preventDefault();
        props.actionDeleteChat(props.activeChatId);
        props.router.navigate("/chats/");
    }

    return (
        <React.Fragment>
            <div className="container-fluid user-chat-header">
                <Row className="m-0">
                    <Col sm={11} xs={10}>
                        <Link to="/agents" className="user-chat-back d-lg-none text-muted p-2">
                            <i className="ri-arrow-left-s-line"></i>
                        </Link>
                    </Col>
                    {/* TODO: don't show on intial "/chats" page */}
                    <Col sm={1} xs={2} >
                        {!isNewChat && (
                            <a href="#" onClick={(event) => deleteChat(event)} className="user-chat-delete p-2 ri-delete-bin-line"></a>
                        )}
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