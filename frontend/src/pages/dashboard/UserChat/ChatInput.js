import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from "reactstrap";
import { connect } from "react-redux";
import { addChat} from "../../../redux/chat/actions";
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
        fetchMessagesLoading,
        addChat,
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
            //Form submit happen when user clicks to Enter button.
            //On mobile devices, Enter button makes a new line.
            event.preventDefault();
            return;
        }
         
        addMessage(textMessage);
        event.preventDefault();
    }

    const handleButtonClick = (event, textMessage) => {
        if (isMobileDevice()) {
            //Form submit happen when user clicks to Enter button.
            //On mobile devices, Enter button makes a new line.
            event.preventDefault();
            addMessage(textMessage);
        }
    }

    //function for send data to onaddMessage function(in userChat/index.js component)
    const addMessage = (textMessage) => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false ||
            textMessage === ""){
            return;
        }

        if (newChat){
            addChat({
                "user_id": authorizedUser.id,
                "name": textMessage.substring(0, 32),
                "message": textMessage
            });
            settextMessage("");
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
                <Form onSubmit={(event) => formSubmit(event, textMessage)} >
                    <textarea
                        ref={textAreaRef} 
                        value={textMessage} 
                        onChange={handleChange} 
                        onKeyDown={handleKeyDown}
                        className="form-control form-control-lg bg-light border-light" 
                        placeholder={t('Enter Message') + '...'} 
                        style={{resize: 'none', overflow: 'auto', minHeight: '50px', maxHeight: '200px'}}
                        disabled={fetchMessagesLoading}
                    />
                        <Button 
                            onClick={(event) => handleButtonClick(event, textMessage)} 
                            type="submit" color="primary" 
                            disabled={fetchMessagesLoading}
                            className="font-size-16 btn-sm chat-send">
                                <i className="ri-send-plane-2-fill"></i>
                        </Button>
                </Form>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const {
        activeChatId,
        wsConnection,
        newChat,
        fetchMessagesLoading
    } = state.Chat;

    return { 
        activeChatId,
        wsConnection,
        newChat,
        fetchMessagesLoading,
        authorizedUser: state.User.authorizedUser,
    }
};

const mapDispatchToProps = {
    addChat
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);