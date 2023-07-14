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
            <div className="p-2 p-lg-2 border-bottom">
                <Row className="align-items-center">
                    <Col sm={4} xs={8}>
                        <div className="d-flex align-items-center">
                            <div className="d-block d-lg-none me-2 ms-0">
                                <Link to="#" onClick={(event) => closeUserChat(event)} className="user-chat-remove text-muted font-size-16 p-2">
                                    <i className="ri-arrow-left-s-line"></i></Link>
                            </div>
                        </div>
                    </Col>
                    {/* TODO: don't show on intial "/chats" page */}
                    <Col sm={8} xs={4} >
                        <ul className="list-inline user-chat-nav text-end mb-0">
                            
                                <li className="list-inline-item">
                                {!props.activeNewChat && (
                                    <a href="#" onClick={(event) => deleteDialogue(event)} className="ri-delete-bin-line"></a>
                                )}
                                </li>
                        </ul>
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
        activeNewChat: state.Chat.activeNewChat,
    };
};

const mapDispatchToProps = {
    actionDeleteDialogue,
    showChatWindow,
    setActiveNewChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserHead));