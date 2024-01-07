import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatInput from "../UserChat/ChatInput";
import AgentHead from "./AgentHead";
import { useTranslation } from 'react-i18next';
import { 
    useLocation 
} from "react-router-dom";

function UserChat(props) {
    const {
        activeAgent
    } = props;
    const { t } = useTranslation();
    const location = useLocation();
    const isNewAgentChat = location.pathname === '/agents/';

    const renderAgentName = () => {
        if (activeAgent === null) {
            return t('Choose agent for the new chat')
        }

        const name = activeAgent.name || t('No name');
        return (
            <>
                {t('Start chatting with')} {name}
            </>
        );
    };

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new ${isNewAgentChat ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <AgentHead />
                    <div
                        className="user-chat-conversation"
                        id="messages">
                            <h1>
                                {renderAgentName()}
                            </h1>
                    </div>
                </div>
                {activeAgent !== null && <ChatInput/>}
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        activeAgent: state.Agents.activeAgent
    }
};

export default withRouter(connect(mapStateToProps)(UserChat));
