import React, { useEffect} from 'react';
import { 
    useLocation,
    Link 
} from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatInput from "./ChatInput";
import UserHead from "./UserHead";
import {
    Alert, 
    Card, 
    CardBody, 
    CardHeader,
} from "reactstrap";
import { useTranslation } from 'react-i18next';
import {
    getAgents,
    setActiveAgent 
} from "../../../redux/actions";
import config from '../../../config';

function UserChat(props) {
    const { t } = useTranslation();
    const {
        getAgents,
        authorizedUser,
        agents,
        addChatErrors
    } = props;
    const supportEmail =  config.SUPPORT_EMAIL;
    const location = useLocation();
    const isNewChat = location.pathname.startsWith('/chats/new_chat');
    const agentId = Number(props.router.params.agentId) || 0;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false){
            return;
        }

        getAgents();
    }, [authorizedUser, getAgents]);

    useEffect(() => {
        setActiveAgent(agentId);
    }, [agentId]);

    return (
        <React.Fragment>
            
            <div className={`user-chat user-chat-new ${isNewChat ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div className="user-chat-conversation" id="messages">
                        {/* Styled Selector using Reactstrap */}
                        
                        <Card className="border">
                            <CardHeader>
                                {t('Agents')}
                            </CardHeader>
                            <CardBody>
                                <div className="agent-tiles-container">
                                    {agents && agents.map((agent, index) => (
                                        <Link 
                                            to={`/chats/new_chat/${agent.id}`} 
                                            key={index} 
                                            className={`agent-tile ${agent.id === agentId ? 'active' : ''}`}
                                        >
                                                {agent.name}
                                        </Link>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                         {addChatErrors && (
                            <Alert color="danger">
                                {t("The message wasn't delivered to the server. Errors details")}:
                                {addChatErrors.details && 
                                    (<ul className='ps-4'>
                                        {addChatErrors.details.map((error, index) => (
                                            <li key={index} className="p-0">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>)
                                }
                                {addChatErrors.details === undefined && 
                                    (<pre>
                                        {JSON.stringify(addChatErrors)}
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
    return { 
        messages: state.Chat.messages,
        addChatErrors: state.Chat.addChatErrors,
        authorizedUser: state.User.authorizedUser,
        agents: state.Agents.agents,
    }
};

const mapDispatchToProps = {
    getAgents,
    setActiveAgent
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));