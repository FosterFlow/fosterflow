import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from "reactstrap";
import { connect } from "react-redux";
import { 
    addChat, 
    sendMessage
} from "../../../redux/chat/actions";
import { isMobileDevice } from '../../../helpers/mobileDevices';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const textAreaRef = useRef(null);
    const { t } = useTranslation();
    const {
        activeAgentId,
        activeChatId,
        authorizedUser,
        userAgents,
        newChat,
        fetchMessagesLoading,
        addChat,
        sendMessage,
    } = props;

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
        const trimmedText = _.trim(textMessage);

        if (userAgents.length === 0 ||
            authorizedUser === null,
            authorizedUser.is_email_confirmed === false ||
            trimmedText === ""){
            return;
        }

        if (newChat){
            addChat({
                "owner_agent_id": userAgents[0].id,
                "name": trimmedText.substring(0, 32),
                "message": trimmedText
            });
            settextMessage("");
            return;        
        }

        sendMessage({
            "addressee_agent_id": activeAgentId,
            "chat_id": activeChatId,
            "message_text": trimmedText,
            "owner_agent_id": userAgents[0].id
        });
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
                        placeholder={
                            fetchMessagesLoading ? (
                                t('Loading chat history') + '...'
                            ) : (
                                t('Enter message') + '...'   
                            )
                        } 
                        disabled={fetchMessagesLoading}
                    />
                        <Button 
                            onClick={(event) => handleButtonClick(event, textMessage)} 
                            type="submit" 
                            color={textMessage.trim() && "primary"}
                            disabled={!textMessage.trim()}
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
        newChat,
        fetchMessagesLoading
    } = state.Chat;

    return {
        activeAgentId: state.Agents.activeAgentId, 
        activeChatId,
        newChat,
        fetchMessagesLoading,
        authorizedUser: state.User.authorizedUser,
        userAgents: state.Agents.userAgents,
    }
};

const mapDispatchToProps = {
    addChat,
    sendMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);