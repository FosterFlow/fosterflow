import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../components/withRouter";
import ChatInput from "./UserChat/ChatInput";
import UserHead from "./UserChat/UserHead";
import { useTranslation } from 'react-i18next';

function UserChat(props) {
    const {
        activeAgent
    } = props;
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new user-chat-show`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div
                        className="user-chat-conversation"
                        id="messages">
                            <h1>{
                                activeAgent ?
                                    activeAgent.first_name + ' ' + activeAgent.last_name 
                                    : t('Choose agent for the new chat')
                            }</h1>
                    </div>
                </div>
                <ChatInput/>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return { 
        activeAgent: state.Agents.activeAgent,
    }
};

export default withRouter(connect(mapStateToProps)(UserChat));
