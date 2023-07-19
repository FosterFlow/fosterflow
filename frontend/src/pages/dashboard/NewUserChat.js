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
            <div className={`user-chat w-100 overflow-hidden ${props.activeNewChat ? 'user-chat-show' : ''}`}>
                <div className="d-lg-flex">
                    <div className={props.userSidebar ? "w-70" : "w-100"}>
                        {/* render user head */}
                        <UserHead />

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            className="chat-conversation"
                            id="messages">
                                <h1>{t('Start the Chat with GPT-4 Model')}</h1>        
                        </SimpleBar>
                        <ChatInput/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        messages: state.Chat.messages,
        userSidebar: state.Layout.userSidebar,
        activeNewChat: state.Chat.activeNewChat
}
    
};

export default withRouter(connect(mapStateToProps)(UserChat));
