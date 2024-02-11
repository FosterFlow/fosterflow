//TODO: it renders 8 times, figure it out
//Move all params to internal components
import React, { useEffect } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import _ from 'lodash';
import ChatHead from "./chatHead";
import ChatBody from "./chatBody";
import ChatInput from "./chatInput";
import { 
    setActiveAgent,
} from "../../../redux/actions";

function Chat(props) {
    console.log ('Chats Chat component rendering');
    const {
        activeChatId,
        activeChat, 
        setActiveAgent,
        authorizedUser,
        addChatRequestMessage,
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
            <div className={`user-chat ${activeChatId > 0 ? 'user-chat-show' : ''}`}>
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
    } = state.Chat;

    const {
        addChatRequestMessage,
        skipMessagesFetching
    } = state.Message;

    return {
        activeChatId,
        activeChat,
        addChatRequestMessage,
        skipMessagesFetching,
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent,
    }
};

const mapDispatchToProps = {
    setActiveAgent
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));