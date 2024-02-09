/* List of missages that we are receiving from the server by web socket. I use separate component to do not overload common state */
import React, { useState } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

function ReceivingMessages(props) {
    const {
        receivingMessagesQueue,
        activeChatId,
        userAgent,
    } = props;
    const { t } = useTranslation();
    //TODO: review if it's neccesary to store all messages into store
    const relevantMessages = receivingMessagesQueue.filter(message => message.chat_id === activeChatId);

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

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const {
        activeChatId,
        activeChat,
    } = state.Chat;

    const {
        receivingMessagesQueue,
    } = state.Message;

    return {
        receivingMessagesQueue,
        activeChatId,
        activeChat,
        userAgent: state.Agents.userAgent,
    }
};

export default withRouter(connect(mapStateToProps, null)(ReceivingMessages));