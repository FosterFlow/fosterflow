/* List of missages that we are sending to the server, we show loader for them */
import React from 'react';
import { 
    Spinner,
} from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import _ from 'lodash';

function SendingMessages(props) {
    const {
        sendingMessagesQueue, 
        activeChatId,
    } = props;
    //TODO: review if it's neccesary to store all messages into store
    const relevantSendingMessages = sendingMessagesQueue.filter(message => message.chat_id === activeChatId);

    return (
        <React.Fragment>
            {/* List of missages that we are sending to the server, we show loader for them */}
            {
                relevantSendingMessages.map((message, key) =>
                    <React.Fragment key={key}>
                        {
                            <li className="user-chat-conversation-list-item right">
                                <div className="user-chat-message user-chat-message-formatting">
                                    <Spinner size="sm"/>&nbsp;&nbsp;
                                    {message.message_text}
                                </div>
                            </li>
                        }
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const {
        activeChatId,
        activeChat,
    } = state.Chat;

    return {
        sendingMessagesQueue: state.Message.sendingMessagesQueue,
        activeChatId,
        activeChat,
    }
};

export default withRouter(connect(mapStateToProps, null)(SendingMessages));