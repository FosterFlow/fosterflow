import React, { useRef, useEffect, useState } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import _ from 'lodash';
import UserHead from "./UserHead";
import ChatInput from "./ChatInput";
import { 
    fetchMessages,
    addMessage,
    deleteMessage,
    startWsConnection
} from "../../../redux/chat/actions";
import { getUser } from "../../../redux/user/actions";

// Here's the custom component to render the code blocks
function CodeBlock({node, inline, className, children, ...props}) {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter 
        style={materialDark} 
        customStyle={{
            fontSize: "0.875rem",
        }} 
        language={match[1]} 
        {...props}
    >
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
    const { messages, activeChatId } = props;
    const relevantMessages = messages.filter(message => message.chat_id === activeChatId);
    const debouncedHandleChatScroll = _.debounce(handleChatScroll, 300);
    const debounceHandleWindowResize = _.debounce(handleWindowResize, 300);
    const [messageMaxWidth, setMessageMaxWidth] = useState(0);

    function handleChatScroll() {
        const { scrollHeight, scrollTop, clientHeight } = chatWindowRef.current;
        userWasAtBottomRef.current = (scrollHeight - scrollTop) === clientHeight;
    };

    function handleWindowResize () {
        messageMaxMidthUpdate(true);
    }

    /**
     * Hack, didn't find working CSS solution
     * Need to specidy maximum width for the messages, because of possible long code blocks
     * 
     * param rerender {boolean}
     */
    function messageMaxMidthUpdate (rerender) {
        if (rerender || (messageMaxWidth === 0 && chatWindowRef.current)) {
            const width = chatWindowRef.current.clientWidth - 32;
            setMessageMaxWidth(width);
        }
    }

    // Add useEffect to auto scroll to bottom when messages update
    useEffect(() => {
        if (Array.isArray(messages) && messages.length > 0){
            const { scrollHeight } = chatWindowRef.current;
            if (userWasAtBottomRef.current){
                chatWindowRef.current.scrollTop = scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        window.addEventListener('resize', debounceHandleWindowResize);
        messageMaxMidthUpdate ();
        return () => {
          window.removeEventListener('resize', debounceHandleWindowResize);
        };

        const token = localStorage.getItem('access'); // Assuming you store the token in local storage
        props.startWsConnection(props.activeChatId, token);
    }, []);

    return (
        <React.Fragment>
            <div className={`user-chat ${props.chatWindow ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div
                        ref={chatWindowRef}
                        onScroll={debouncedHandleChatScroll} 
                        className="user-chat-conversation"
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
                                                    <div 
                                                        className="user-chat-message" 
                                                        style={{maxWidth: `${messageMaxWidth}px`}}
                                                        >
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
        activeChatId: state.Chat.activeChatId,
        chatWindow: state.Chat.chatWindow,
    }
};

const mapDispatchToProps = {
    fetchMessages,
    addMessage,
    deleteMessage,
    getUser,
    startWsConnection
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));