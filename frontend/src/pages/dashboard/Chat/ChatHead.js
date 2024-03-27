import React, {memo} from 'react';
import { Row, Col } from "reactstrap";
import { 
    Link, 
    useLocation 
} from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { deleteChat as actionDeleteChat} from "../../../redux/chat/actions";

const ChatHead = memo(function ChatHead(props) {
    console.log ('Chats ChatHead component rendering');
    const location = useLocation();
    const isNewChat = location.pathname.startsWith('/chats/new_chat');
    const {
        activeChatId,
        aiAgents,
        activeAgent,
        actionDeleteChat,
        router
    } = props;

    function deleteChat(event) {
        event.preventDefault();
        actionDeleteChat(activeChatId);
        router.navigate("/chats/");
    }

    return (
        <React.Fragment>
            <div className="user-chat-header">
                <Row className="m-0">
                    <Col sm={6} xs={10} >
                        <Row>
                            <Col className="d-lg-none user-chat-back">
                                <Link to="/chats" className="text-muted p-2">
                                    <i className="ri-arrow-left-s-line"></i>
                                </Link>
                            </Col>
                            <Col className="py-2">
                                {(!isNewChat && aiAgents.length > 0) && (
                                    <span className="user-chat-agent">{activeAgent?.name}</span>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col className="text-end">
                        {!isNewChat && (
                            <a href="#" onClick={(event) => deleteChat(event)} className="user-chat-delete p-2 pe-4 ri-delete-bin-line"></a>
                        )}
                    </Col>
                </Row>
            </div>

        </React.Fragment>
    );
});

const mapStateToProps = (state) => {
    return { 
        activeChatId: state.Chat.activeChatId,
        aiAgents: state.Agents.aiAgents,
        activeAgent: state.Agents.activeAgent
    };
};

const mapDispatchToProps = {
    actionDeleteChat,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatHead));