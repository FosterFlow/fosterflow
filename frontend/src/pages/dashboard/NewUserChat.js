import React, { useEffect} from 'react';
import { connect } from "react-redux";
import withRouter from "../../components/withRouter";
import ChatInput from "./UserChat/ChatInput";
import UserHead from "./UserChat/UserHead";
import { useTranslation } from 'react-i18next';
import {
    getAgents, 
    setActiveAgent,
} from "../../redux/actions";

function UserChat(props) {
    const { t } = useTranslation();
    const {
        agents,
        getAgents,
        authorizedUser
    } = props;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false){
            return;
        }

        getAgents();
    }, [authorizedUser]);

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new ${props.newChat ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div
                        className="user-chat-conversation"
                        id="messages">
                            {/* Replacing h1 title with a selector */}
                            <label htmlFor="agentSelector">{t('Select an agent to chat with:')}</label>
                            <select id="agentSelector" name="agentSelector">
                                {agents && agents.map((agent, index) => 
                                    <option key={index} value={agent.user_id}>{agent.first_name + ' ' + agent.last_name}</option>
                                )}
                            </select>
                    </div>
                </div>
                <ChatInput/>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        messages: state.Chat.messages,
        newChat: state.Chat.newChat,
        authorizedUser: state.User.authorizedUser,
        agents: state.Agents.agents,
    }
};

const mapDispatchToProps = {
    getAgents,
    setActiveAgent,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));