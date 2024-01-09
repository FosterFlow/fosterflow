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
    const isNewChat = location.pathname.startsWith('/chats/new_chat');
    const {
        activeChatId,
        agents,
        activeChatData,
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
            <div className="container-fluid user-chat-header">
                <Row className="m-0">
                    <Col sm={1} xs={2} >
                        <Link to="/chats" className="user-chat-back text-muted p-2 d-lg-none">
                            <i className="ri-arrow-left-s-line"></i>
                        </Link>
                        {!isNewChat && (
                            <span className="user-chat-agent pt-2 ps-2">Agent: {agents[activeChatData?.addressee_agent_id]}</span>
                        )}
                    </Col>
                    {/* TODO: don't show on intial "/chats" page */}
                    <Col className="text-end">
                        {!isNewChat && (
                            <a href="#" onClick={(event) => deleteChat(event)} className="user-chat-delete p-2 pe-4 ri-delete-bin-line"></a>
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
        agents: state.Agents.agents,
        activeChatData: state.Chat.activeChatData
    };
};

const mapDispatchToProps = {
    actionDeleteChat,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));