import React, { memo, useState, useEffect, useRef } from 'react';
import { Button, Form } from "reactstrap";
import { connect } from "react-redux";
import { 
    addChat, 
    sendMessage,
    setSkipFetchMessages
} from "../../../redux/chat/actions";
import { 
    useLocation 
} from "react-router-dom";
import { isMobileDevice } from '../../../helpers/mobileDevices';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import withRouter from "../../../components/withRouter";

const ChatInput = memo(function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const textAreaRef = useRef(null);
    const { t } = useTranslation();
    const {
        activeAgentId,
        activeChat,
        authorizedUser,
        userAgent,
        fetchMessagesLoading,
        addChat,
        sendMessage,
        setSkipFetchMessages
    } = props;
    const location = useLocation();
    const isAgentsPage = location.pathname.startsWith('/agents');
    const isNewChat = location.pathname.startsWith('/chats/new_chat');
    useEffect(() => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 3}px`;
    }, [textMessage]);

    const handleChange = event => {
        settextMessage(event.target.value);
    }
    const [currentActiveChatId] = useState(activeChat?.id || 0);
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

        if (userAgent === null ||
            authorizedUser === null,
            authorizedUser.is_email_confirmed === false ||
            trimmedText === ""){
            return;
        }

        const newOrAgentChat = isNewChat || isAgentsPage;

        if (newOrAgentChat){
            addChat({
                "addressee_agent_id": activeAgentId, 
                "owner_agent_id": userAgent.id,
                "name": trimmedText.substring(0, 32),
                "message": trimmedText
            });
            settextMessage("");
            return;        
        }
        
        sendMessage({
            "addressee_agent_id": activeChat.addressee_agent_id,
            "chat_id": activeChat.id,
            "message_text": trimmedText,
            "owner_agent_id": userAgent.id
        });
        settextMessage("");
    }

    useEffect(() => {
        if (isAgentsPage || isNewChat) {
            const activeChatDataId = activeChat?.id || 0;
            
            if (activeChatDataId === 0) {
                return;
            }

            //Redirect to specific chat page once message was sent
            if (currentActiveChatId !== activeChatDataId) {
                setSkipFetchMessages(true);
                props.router.navigate(`/chats/${activeChatDataId}`);
            }
        }
    }, [activeChat]);

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

    function getPlaceHolder () {
        if (fetchMessagesLoading) {
            return t('Loading chat history') + '...';
        }
        
        if (activeAgentId === 0) {
            return t('Choose agent for the new chat') + '...';
        }
        
        return t('Enter message') + '...';   
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
                        placeholder={getPlaceHolder()} 
                        disabled={fetchMessagesLoading || activeAgentId === 0}
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
});

const mapStateToProps = (state) => {
    const {
        activeChat,
        fetchMessagesLoading
    } = state.Chat;

    return {
        activeAgentId: state.Agents.activeAgentId, 
        activeChat,
        fetchMessagesLoading,
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent,
    }
};

const mapDispatchToProps = {
    addChat,
    sendMessage,
    setSkipFetchMessages
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatInput));