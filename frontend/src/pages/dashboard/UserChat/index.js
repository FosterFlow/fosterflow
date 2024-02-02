//TODO: it renders 8 times, figure it out
import React, { useRef, useEffect, useState } from 'react';
import { 
    Spinner,
    Alert 
} from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import UserHead from "./UserHead";
import ChatInput from "./ChatInput";
import config from '../../../config';
import { 
    fetchMessages
} from "../../../redux/chat/actions";

function UserChat(props) {
    const chatWindowRef = useRef();
    const userWasAtBottomRef = useRef(true);
    const {
        sendMessageErrors,
        sendingMessagesQueue, 
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors, 
        activeChatId, 
        authorizedUser,
        userAgent,
        addChatRequestMessage,
        fetchMessages,
        chatWindow
    } = props;
    const { t } = useTranslation();
    //TODO: review if it's neccesary to store all messages into store
    const relevantMessages = messages.filter(message => message.chat_id === activeChatId);
    const relevantSendingMessages = sendingMessagesQueue.filter(message => message.chat_id === activeChatId);
    const debouncedHandleChatScroll = _.debounce(handleChatScroll, 300);
    const debounceHandleWindowResize = _.debounce(handleWindowResize, 300);
    const [messageMaxWidth, setMessageMaxWidth] = useState(0);
    const supportEmail =  config.SUPPORT_EMAIL;

    function CodeBlock({node, inline, className, children, ...props}) {
        const [copyStatus, setCopyStatus] = useState(t('Copy')); // 'Copy', 'Copied'
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        
        const copyCodeToClipboard = (event) => {
          event.preventDefault();
          setCopyStatus(t('Copied to buffer') + '!');
          navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
            .then(() => {
                // Clipboard successfully set
                setTimeout(() => setCopyStatus(t('Copy')), 2000);
            }, (error) => {
                // Clipboard write failed
                setCopyStatus(t('Error') + ': ' + error);
                setTimeout(() => setCopyStatus(t('Copy')), 3000);
            });
        };
        
        return !inline && !!language ? (
          <div className="code-block">
            <div className="code-block-head">
                <div className="code-block-head-language">
                    {language}
                </div>
                <div className="code-block-head-copy-to-clipboard">
                    {copyStatus === t('Copy') ? (
                        <a href="#" onClick={copyCodeToClipboard}>{copyStatus}</a>
                    ) : (
                        <span>{copyStatus}</span>
                    )}
                </div>
            </div>
            
            <SyntaxHighlighter 
                style={materialDark} 
                customStyle={{
                    fontSize: "0.875rem",
                }} 
                language={language} 
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
    }
    
    function TableWrapper({node, ...props}) {
        return (
          <div style={{overflowY: 'auto'}}>
            <table {...props} />
          </div>
        );
      }

    function handleChatScroll() {
        if (chatWindowRef.current !== null &&
            userWasAtBottomRef.current !== null){
                const { scrollHeight, scrollTop, clientHeight } = chatWindowRef.current;
        
                // Determine if the user is at the bottom of the chat window
                // The sum of scrollTop and clientHeight should be equal to scrollHeight when at the bottom
                // Using Math.abs to account for fractional differences in measurements
                userWasAtBottomRef.current = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;
        }
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
    //TODO: handles for every chunk of the message. We can add debounce method here or optimize it another way
    useEffect(() => {
        if (Array.isArray(messages) && messages.length > 0){
            
            if (userWasAtBottomRef.current){
                const scrollHeight = chatWindowRef.current.scrollHeight;
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
    }, []);

    useEffect(() => {
        if (activeChatId === 0 ||
            authorizedUser === null ||
            authorizedUser.is_email_confirmed === false ||
            addChatRequestMessage !== undefined
        ) { 
            return; 
        }

        fetchMessages(activeChatId);
    }, [authorizedUser, activeChatId]);

    return (
        <React.Fragment>
            <div className={`user-chat ${chatWindow ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div
                        ref={chatWindowRef}
                        onScroll={debouncedHandleChatScroll} 
                        className="user-chat-conversation"
                        id="messages">
                            {  fetchMessagesLoading &&
                                <div className="d-flex justify-content-center">
                                    <Spinner size="sm"/>
                                </div>
                            }
                            { fetchMessagesErrors && (
                                <Alert color="danger">
                                    {t('Errors details')}:
                                    <ul>
                                        {fetchMessagesErrors.details.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                    <hr/>
                                    {t("If you do not know what to do with the error, write to us by mail")}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                                </Alert>
                            )}
                            <ul className="user-chat-conversation-list">
                                {
                                    relevantMessages.map((message, key) =>
                                        <React.Fragment key={key}>
                                            {
                                                userAgent.id === message.owner_agent_id ? (
                                                    <li className="user-chat-conversation-list-item right">
                                                        <div className="user-chat-message user-chat-message-formatting">
                                                            {message.message_text}
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <li className="user-chat-conversation-list-item"> 
                                                        <div 
                                                            className="user-chat-message" 
                                                            style={{maxWidth: `${messageMaxWidth}px`}}
                                                        >
                                                            <ReactMarkdown 
                                                                remarkPlugins={[gfm]}
                                                                components={{
                                                                    code: CodeBlock,
                                                                    table: TableWrapper 
                                                                    }}>
                                                                {message.message_text}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        </React.Fragment>
                                    )
                                }
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
                            </ul>
                            {/* TODO: add an ability to re-send failed messages */}
                            { sendMessageErrors && (
                                <Alert color="danger">
                                    {t("The message wasn't delivered to the server. Errors details")}:
                                    {sendMessageErrors.details && 
                                        (<ul className='ps-4'>
                                            {sendMessageErrors.details.map((error, index) => (
                                                <li key={index} className="p-0">
                                                {error}
                                                </li>
                                            ))}
                                        </ul>)
                                    }
                                    {sendMessageErrors.details === undefined && 
                                        (<pre>
                                            {JSON.stringify(sendMessageErrors)}
                                        </pre>)
                                    }
                                    <hr/>
                                    {t("If you do not know what to do with the error, write to us by mail")}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                                </Alert>
                            )}
                    </div>
                </div>
                <ChatInput/>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const {
        sendMessageErrors,
        sendingMessagesQueue,
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors,
        activeChatId,
        chatWindow,
        addChatRequestMessage
    } = state.Chat;

    return {
        sendMessageErrors,
        sendingMessagesQueue,
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors,
        activeChatId,
        chatWindow,
        addChatRequestMessage,
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent
    }
};

const mapDispatchToProps = {
    fetchMessages
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));