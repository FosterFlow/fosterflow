//TODO: it renders 8 times, figure it out
//Move all params to internal components
import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatHead from "./ChatHead";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";

function Chat(props) {
    console.log ('Chats Chat component rendering');
    const {
        activeChatId,
    } = props;

    

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
    return {
        activeChatId: state.Chat.activeChatId,
    }
};

export default withRouter(connect(mapStateToProps)(Chat));