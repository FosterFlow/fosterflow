import React from 'react';
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { deleteChat as actionDeleteChat, showChatWindow, setActiveNewChat} from "../../../redux/chat/actions";

function UserHead(props) {
    const id = Number(props.router.params.id) || 0;

    function closeUserChat(event) {
        event.preventDefault();
        if (id > 0){
            props.showChatWindow(false);
            return;
        }
        
        props.setActiveNewChat(false);
    }

    function deleteChat(event) {
        event.preventDefault();
        console.log("UserHead deleteChat activeChatId ", props.activeChatId);
        props.actionDeleteChat(props.activeChatId);
        props.router.navigate("/chats/");
    }

    return (
        <React.Fragment>
            <div className="container-fluid user-chat-header">
                <Row className="m-0">
                    <Col sm={11} xs={10}>
                        <Link to="#" onClick={(event) => closeUserChat(event)} className="user-chat-back d-lg-none text-muted p-2">
                            <i className="ri-arrow-left-s-line"></i>
                        </Link>
                    </Col>
                    {/* TODO: don't show on intial "/chats" page */}
                    <Col sm={1} xs={2} >
                        {!props.newChat && (
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
        newChat: state.Chat.newChat,
    };
};

const mapDispatchToProps = {
    actionDeleteChat,
    showChatWindow,
    setActiveNewChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));