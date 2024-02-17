import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatInput from "../chat/chatInput";
import AgentHead from "./agentHead";

function UserChat(props) {
    const {
        activeAgent
    } = props;

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new ${activeAgent !== null ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <AgentHead />
                    <div
                        className="user-chat-conversation"
                        id="messages">
                  
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
