//TODO: it renders 8 times, figure it out
import React, { useEffect } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import _ from 'lodash';
import ChatHead from "./ChatHead";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import { 
    setActiveAgent,
} from "../../../redux/actions";

function UserChat(props) {
    const {
        activeChatId,
        activeChat, 
        setActiveAgent,
        authorizedUser,
        addChatRequestMessage,
        chatWindow,
    } = props;

    function isChatDisabled(){
        return activeChatId === 0 ||
        authorizedUser === null ||
        authorizedUser.is_email_confirmed === false ||
        addChatRequestMessage !== undefined;
    }

    useEffect(() => {
        if (isChatDisabled()) { 
            return; 
        }
        
        const chatAgentId = activeChat?.addressee_agent_id;
        if (chatAgentId) {
            setActiveAgent(chatAgentId);
        }
    }, [activeChat]);

    return (
        <React.Fragment>
            <div className={`user-chat ${chatWindow ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <ChatHead />
                    <ChatBody/>
                </div>
                <ChatInput/>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const {
        activeChatId,
        activeChat,
        chatWindow,
        addChatRequestMessage,
        skipMessagesFetching
    } = state.Chat;

    return {
        activeChatId,
        activeChat,
        chatWindow,
        addChatRequestMessage,
        skipMessagesFetching,
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent,
    }
};

const mapDispatchToProps = {
    setActiveAgent
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));