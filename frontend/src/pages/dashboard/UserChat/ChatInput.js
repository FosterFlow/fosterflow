import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Form } from "reactstrap";
import { connect } from "react-redux";
import { addMessage as actionAddMessage, addDialogue} from "../../../redux/chat/actions";
import { bindActionCreators } from "redux";
import { useTranslation } from 'react-i18next';

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const textAreaRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }, [textMessage]);

    const handleChange = event => {
        settextMessage(event.target.value);
    }

    const formSubmit = (event, textMessage) => {
        event.preventDefault();
        addMessage(textMessage);
    }

    //function for send data to onaddMessage function(in userChat/index.js component)
    const addMessage = (textMessage) => {
        if (props.authorizedUser === null){
            return;
        }

        if (props.authorizedUser.is_email_confirmed === false){
            return;
        }

        //if text value is not empty then call onaddMessage function
        if (textMessage !== "") {
            if (props.newChat){
                props.addDialogue({
                    "user_id": props.authorizedUser.id,
                    "name": textMessage.substring(0, 32),
                    "message": textMessage
                });
                settextMessage("");
                return;        
            }

            props.actionAddMessage({
                "message_text": textMessage,
                "dialog_id": props.activeDialogueId
            });
            settextMessage("");
        }
    }

    //function for handling 'Enter' key press
    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            addMessage(textMessage);
        }
    }

    return (
        <React.Fragment>
            <div className="chat-input p-3 p-lg-3">
                <Form onSubmit={(e) => formSubmit(e, textMessage)} >
                    <Row className='g-0'>
                        <Col>
                            <div>
                                <textarea
                                    ref={textAreaRef} 
                                    value={textMessage} 
                                    onChange={handleChange} 
                                    onKeyDown={handleKeyDown}
                                    className="form-control form-control-lg bg-light border-light" 
                                    placeholder={t('Enter Message') + '...'} 
                                    style={{resize: 'none', overflow: 'auto', minHeight: '50px', maxHeight: '200px'}}
                                />
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="chat-input-links ms-2">
                                <ul className="list-inline mb-0 ms-0">
                                    <li className="list-inline-item">
                                        <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send">
                                            <i className="ri-send-plane-2-fill"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    console.log("Dashabord Tabs ChatsInput mapStateToProps state", state);
    return { 
        activeDialogueId: state.Chat.activeDialogueId,
        authorizedUser: state.User.authorizedUser,
        newChat: state.Chat.newChat
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionAddMessage, addDialogue }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);