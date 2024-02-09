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
import ScrollToBottom from 'react-scroll-to-bottom';
import config from '../../../config';
import SendingMessages from "./sendingMessages";
import SendingMessageError from "./sendingMessageError";
import { 
    fetchMessages,
    setActiveAgent,
    setSkipFetchMessages
} from "../../../redux/actions";


function ChatBody(props) {
    console.log ('Chats ChatBody component rendering');
    const chatWindowRef = useRef();
    const {
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors, 
        activeChatId,
        authorizedUser,
        userAgent,
        addChatRequestMessage,
        fetchMessages,
        skipMessagesFetching,
        setSkipFetchMessages
    } = props;
    const { t } = useTranslation();
    //TODO: review if it's neccesary to store all messages into store
    const relevantMessages = messages.filter(message => message.chat_id === activeChatId);
    const debounceHandleWindowResize = _.debounce(handleWindowResize, 100);
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
        if (chatWindowRef.current === null){
            return;
        }

        if (rerender || messageMaxWidth === 0) {
            const width = chatWindowRef.current.clientWidth - 32;
            setMessageMaxWidth(width);
        }
    }

    useEffect(() => {
        // Add resize event listener on window
        window.addEventListener('resize', debounceHandleWindowResize);
    
        // Call messageMaxMidthUpdate initially
        messageMaxMidthUpdate();
    
        // Return cleanup function
        return () => {
            window.removeEventListener('resize', debounceHandleWindowResize);
        };
    }, []);

    function isChatDisabled(){
        return activeChatId === 0 ||
        authorizedUser === null ||
        authorizedUser.is_email_confirmed === false ||
        addChatRequestMessage !== undefined;
    }

    useEffect(() => {
        if (isChatDisabled()) { 
            return; 
        }

        if (skipMessagesFetching) {
          setSkipFetchMessages(false);
          return;
        }

        fetchMessages(activeChatId);
    }, [activeChatId, authorizedUser]);

    return (
        <React.Fragment>
            <ScrollToBottom 
                initialScrollBehavior="auto" 
                className="user-chat-conversation"
            >
                <div
                        
                        ref={chatWindowRef}
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
                                                            style={{maxWidth: `1200px`}}
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
                                <SendingMessages/>
                            </ul>
                            <SendingMessageError/>
                    </div>
                </ScrollToBottom>

        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const {
        activeChatId,
        activeChat,
        chatWindow,
    } = state.Chat;

    const {
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors,
        addChatRequestMessage,
        skipMessagesFetching
    } = state.Message;

    return {
        messages,
        fetchMessagesLoading,
        fetchMessagesErrors,
        activeChatId,
        activeChat,
        chatWindow,
        addChatRequestMessage,
        skipMessagesFetching,
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent,
    }
};

const mapDispatchToProps = {
    fetchMessages,
    setActiveAgent,
    setSkipFetchMessages
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatBody));