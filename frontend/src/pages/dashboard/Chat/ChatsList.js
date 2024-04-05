import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Input, 
    InputGroup,
    Spinner,
    Alert 
} from "reactstrap";
import { 
    Link, 
    useLocation 
} from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import config from '../../../config';
import { 
    fetchChats,
    setActiveChat,
    getAiAgents
} from "../../../redux/actions";
import { useTranslation } from 'react-i18next';

const ChatsList = (props) => {
    const id = Number(props.router.params.id) || 0;
    const location = useLocation();
    const isNewChat = location.pathname.startsWith('/chats/new_chat');
    const [searchChat, setSearchChat] = useState("");
    const [recentChatList, setRecentChatList] = useState([]);
    const supportEmail =  config.SUPPORT_EMAIL;
    const { t } = useTranslation();
    const chatListRef = useRef(null);
    const {
        fetchChats,
        setActiveChat,

        chats,
        fetchChatsLoading,
        fetchChatsErrors,

        activeChatId,

        authorizedUser,
        userAgent,

        aiAgents,
        getAiAgents
    } = props;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false ||
            userAgent === null
            ){
            return;
        }

        fetchChats(userAgent);
    }, [authorizedUser, userAgent]);

    useEffect(() => {
        if (chats && chats.length === 0) {
            return;
        }

        if (aiAgents && aiAgents.length === 0) {
            getAiAgents();
            return;
        }

        const sortedChats = [...chats].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRecentChatList(sortedChats);
    }, [chats, aiAgents]);

    useEffect(() => {
        if (isNewChat || id === 0) {
            setActiveChat(0);
            return;
        }
        
        if (activeChatId === id){
            return;
        }
        
        setActiveChat(id);
    }, [id, isNewChat]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchChat(search);
        const filteredChats = chats.filter(
            chat => chat.name && chat.name.toString().toLowerCase().includes(search)
        ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRecentChatList(filteredChats);
    }, [chats]);

    useEffect(() => {
        if (chatListRef && chatListRef.current) {
            chatListRef.current.scrollTop = 0;
        }
    }, [recentChatList]);

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">
                <div className="px-2 pt-2">
                    <Link to="/chats/new_chat" className="btn btn-primary w-100 text-start new-chat-button">{t('New Chat')}</Link>
                </div>
                <div className="px-2 pt-2">
                    <div className="search-box chat-search-box">
                        <InputGroup className="mb-3 rounded-3">
                            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </span>
                            <Input 
                                type="text" 
                                value={searchChat} 
                                onChange={handleSearchChange} 
                                className="form-control bg-light" 
                                placeholder={t('Search in chats')}
                                disabled={fetchChatsLoading} 
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="chats-list-wrapper" ref={chatListRef}>
                    {  fetchChatsLoading &&
                        <div className="d-flex justify-content-center">
                            <Spinner size="sm"/>
                        </div>
                    }
                    { fetchChatsErrors && (
                        <Alert color="danger">
                            {t('Errors details')}:
                            <ul>
                                {fetchChatsErrors.details.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                            <hr/>
                            {t("If you do not know what to do with the error, write to us by mail")}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </Alert>
                    )}
                    <ul className="list-unstyled chats-list" id="chat-list">
                        {
                            recentChatList.map((chat, key) => {
                                const agent = aiAgents.find(agent => agent.id === chat.addressee_agent_id);

                                return <li 
                                    key={key} 
                                    id={"conversation"+ chat.id} 
                                    className={`px-2 pt-2 ${activeChatId === chat.id ? 'active' : ''}`}
                                    >
                                        <Link to={`/chats/${chat.id}`}>
                                            {chat.latest_message 
                                                ? <h5 className="text-truncate font-size-15 mb-1">{chat.latest_message}</h5> 
                                                : <h5 className="text-truncate font-size-15 mb-1">{chat.name} </h5>
                                            }
                                            <p>{agent ? agent.name : 'Unknown agent'}</p>
                                        </Link>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields. Prevent redundunt re-render 
const mapStateToProps = state => {
    const {
        chats,
        activeChatId,
        fetchChatsLoading,
        fetchChatsErrors
    } = state.Chat;
    return {
        chats,
        activeChatId,
        fetchChatsLoading,
        fetchChatsErrors,
        //TODO: cause redundun re-render
        authorizedUser: state.User.authorizedUser,
        userAgent: state.Agents.userAgent,
        aiAgents: state.Agents.aiAgents,
    };
};

const mapDispatchToProps = {
    fetchChats,
    setActiveChat,
    getAiAgents
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsList));