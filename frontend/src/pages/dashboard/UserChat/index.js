import React, { useRef } from 'react';
import { connect } from "react-redux";
import SimpleBar from "simplebar-react";
import withRouter from "../../../components/withRouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

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
    const ref = useRef();
    const { messages, activeDialogueId } = props;
    const relevantMessages = messages.filter(message => message.dialog_id === activeDialogueId);

    return (
        <React.Fragment>
            <div className={`user-chat ${props.userSidebar ? "w-70" : "w-100"} ${props.chatWindow ? 'user-chat-show' : ''}`}>
                <div className="user-chat-content-wrapper">
                    <UserHead />
                    <SimpleBar
                        ref={ref}
                        className="chat-conversation p-3 p-lg-3"
                        id="messages">
                            <ul className="list-unstyled mb-0">
                                {
                                    relevantMessages.map((chat, key) =>
                                        <React.Fragment key={key}>
                                            <li className="right">
                                                <div className="conversation-list">
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                <pre>
                                                                    {chat.message_text}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="conversation-list">
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                <ReactMarkdown components={{code: CodeBlock}} className="mb-0">
                                                                    {chat.answer_text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </React.Fragment>
                                    )
                                }
                            </ul>
                        </SimpleBar>
                    </div>
                <ChatInput/>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        messages: state.Chat.messages,
        userSidebar: state.Layout.userSidebar,
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
