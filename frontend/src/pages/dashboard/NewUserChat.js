import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../components/withRouter";
import SimpleBar from "simplebar-react";

// Import Components
import ChatInput from "./UserChat/ChatInput";
import UserHead from "./UserChat/UserHead";
//i18n
import { useTranslation } from 'react-i18next';


function UserChat(props) {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new ${props.newChat ? 'user-chat-show' : ''}`}>
                <UserHead />
                <div className="user-chat-content-wrapper">
                     <SimpleBar
                        className="chat-conversation"
                        id="messages">
                        <h1>{t('Start the Chat with GPT-4 Model')}</h1>        
                    </SimpleBar>
                    <ChatInput/>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        messages: state.Chat.messages,
        newChat: state.Chat.newChat
    }
};

export default withRouter(connect(mapStateToProps)(UserChat));
