import React, { useRef, useEffect } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import _ from 'lodash';

// Import Components
import UserHead from "./UserHead";
import ChatInput from "./ChatInput";

// Import actions
import { fetchMessages, addMessage, deleteMessage } from "../../../redux/chat/actions";
import { getUser } from "../../../redux/user/actions";

// Here's the custom component to render the code blocks
function CodeBlock({node, inline, className, children, ...props}) {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter style={solarizedlight} language={match[1]} PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

function UserChat(props) {
    const chatWindowRef = useRef();
    const userWasAtBottomRef = useRef(true);
    const { messages, activeDialogueId } = props;
    const relevantMessages = messages.filter(message => message.dialog_id === activeDialogueId);
    const debouncedHandleChatScroll = _.debounce(handleChatScroll, 100);

    function handleChatScroll() {
        const { scrollHeight, scrollTop, clientHeight } = chatWindowRef.current;
        userWasAtBottomRef.current = (scrollHeight - scrollTop) === clientHeight;
    };

    // Add useEffect to auto scroll to bottom when messages update
    useEffect(() => {
        if (Array.isArray(messages) && messages.length > 0){
            const { scrollHeight } = chatWindowRef.current;
            if (userWasAtBottomRef.current){
                chatWindowRef.current.scrollTop = scrollHeight;
            }
        }
    }, [messages]);

    return (
        <React.Fragment>
            <div className={`user-chat ${props.chatWindow ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div
                        ref={chatWindowRef}
                        onScroll={debouncedHandleChatScroll} 
                        className="user-chat-conversation p-3 p-lg-3"
                        id="messages">
                                <ul className="user-chat-conversation-list">
                                    {
                                        relevantMessages.map((chat, key) =>
                                            <React.Fragment key={key}>
                                                <li className="user-chat-conversation-list-item right">
                                                    <div className="user-chat-message user-chat-message-formatting">
                                                        {chat.message_text}
                                                    </div>
                                                </li>
                                                <li className="user-chat-conversation-list-item"> 
                                                    <div className="user-chat-message">
                                                        <ReactMarkdown 
                                                            remarkPlugins={[gfm]} 
                                                            components={{code: CodeBlock}}>
                                                                {chat.answer_text}
                                                        </ReactMarkdown>
                                                    </div>
                                                </li>
                                            </React.Fragment>
                                        )
                                    }
                                </ul>
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
        activeDialogueId: state.Chat.activeDialogueId,
        chatWindow: state.Chat.chatWindow,
    }
};

const mapDispatchToProps = {
    fetchMessages,
    addMessage,
    deleteMessage,
    getUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));