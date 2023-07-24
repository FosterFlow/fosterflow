import React from 'react';
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { deleteDialogue as actionDeleteDialogue, showChatWindow, setActiveNewChat} from "../../../redux/chat/actions";

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

    function deleteDialogue(event) {
        event.preventDefault();
        console.log("UserHead deleteDialogue activeDialogueId ", props.activeDialogueId);
        props.actionDeleteDialogue(props.activeDialogueId);
        props.router.navigate("/chats/");
    }

    return (
        <React.Fragment>
            <div className="container-fluid border-bottom">
                <Row className="m-0">
                    <Col sm={10} xs={10}>
                        <Link to="#" onClick={(event) => closeUserChat(event)} className="user-chat-back text-muted font-size-16 p-2">
                            <i className="ri-arrow-left-s-line"></i>
                        </Link>
                    </Col>
                    {/* TODO: don't show on intial "/chats" page */}
                    <Col sm={2} xs={2} >
                        {!props.newChat && (
                            <a href="#" onClick={(event) => deleteDialogue(event)} className="user-chat-delete p-2 ri-delete-bin-line"></a>
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
        activeDialogueId: state.Chat.activeDialogueId,
        newChat: state.Chat.newChat,
    };
};

const mapDispatchToProps = {
    actionDeleteDialogue,
    showChatWindow,
    setActiveNewChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));