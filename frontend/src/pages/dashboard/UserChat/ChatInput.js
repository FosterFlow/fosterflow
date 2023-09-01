import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from "reactstrap";
import { connect } from "react-redux";
import { addChat} from "../../../redux/chat/actions";
import { bindActionCreators } from "redux";
import { useTranslation } from 'react-i18next';

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const textAreaRef = useRef(null);
    const { t } = useTranslation();
    const {
        activeChatId,
        wsConnection,
        authorizedUser,
        newChat,
        addChat
    } = props;

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    useEffect(() => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 3}px`;
    }, [textMessage]);

    const handleChange = event => {
        settextMessage(event.target.value);
    }

    const formSubmit = (event, textMessage) => {
        if (isMobileDevice()) {
            event.preventDefault();
            return;
        }
         
        addMessage(textMessage);
    }
    

    const handleButtonClick = (event, textMessage) => {
        if (isMobileDevice()) {
            event.preventDefault();
            addMessage(textMessage);
        }
    }

    //function for send data to onaddMessage function(in userChat/index.js component)
    const addMessage = (textMessage) => {
        if (authorizedUser === null){
            return;
        }

        if (authorizedUser.is_email_confirmed === false){
            return;
        }

        //if text value is not empty then call onaddMessage function
        if (textMessage !== "") {
            if (newChat){
                addChat({
                    "user_id": authorizedUser.id,
                    "name": textMessage.substring(0, 32),
                    "message": textMessage
                });
                settextMessage("");
                //TODO: need to make web socket request once we get chatId
                return;        
            }

            wsConnection.send(JSON.stringify(
                {
                    "chat_id": activeChatId,
                    "prompt": textMessage,
                    "owner_id": authorizedUser.id,
                    "method": "request" 
                }
            ));
            settextMessage("");
        }
    }

    //function for handling 'Enter' key press
    const handleKeyDown = (event) => {
        if (isMobileDevice()) {
            return;
        }

        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            addMessage(textMessage);
        }
    }

    return (
        <React.Fragment>
            <div className="chat-input">
                <Form onSubmit={(e) => formSubmit(e, textMessage)} >
                    <textarea
                        ref={textAreaRef} 
                        value={textMessage} 
                        onChange={handleChange} 
                        onKeyDown={handleKeyDown}
                        className="form-control form-control-lg bg-light border-light" 
                        placeholder={t('Enter Message') + '...'} 
                        style={{resize: 'none', overflow: 'auto', minHeight: '50px', maxHeight: '200px'}}
                    />
                        <Button onClick={(e) => handleButtonClick(e, textMessage)} type="submit" color="primary" className="font-size-16 btn-sm chat-send">
                            <i className="ri-send-plane-2-fill"></i>
                        </Button>
                </Form>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        activeChatId: state.Chat.activeChatId,
        wsConnection: state.Chat.wsConnection,
        authorizedUser: state.User.authorizedUser,
        newChat: state.Chat.newChat,
    }
};

const mapDispatchToProps = {
    addChat
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);