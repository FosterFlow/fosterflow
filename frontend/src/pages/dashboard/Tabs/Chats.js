import React, { useState, useEffect, useCallback } from 'react';
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
import UserChat from "../UserChat/";
import NewUserChat from "../UserChat/NewUserChat";
import config from '../../../config';
import { 
    fetchChats,
    setActiveChat,
    setActiveNewChat,
    showChatWindow 
} from "../../../redux/actions";
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';
import { isMobileDevice } from '../../../helpers/mobileDevices';

const Chats = (props) => {
    const id = Number(props.router.params.id) || 0;
    const location = useLocation();
    const isNewChat = location.pathname === '/chats/new_chat';
    const [searchChat, setSearchChat] = useState("");
    const [recentChatList, setRecentChatList] = useState([]);
    const supportEmail =  config.SUPPORT_EMAIL;
    const { t } = useTranslation();
    const {
        router,

        fetchChats,
        setActiveChat,
        setActiveNewChat,
        showChatWindow,

        chats,
        fetchChatsLoading,
        fetchChatsErrors,

        activeChatId,
        chatWindow,
        newChat,

        authorizedUser,
        userAgents
    } = props;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false ||
            userAgents.length === 0
            ){
            return;
        }

        fetchChats(userAgents[0]);
    }, [authorizedUser, userAgents]);

    useEffect(() => {
        if (chats && chats.length === 0) {
            return;
        }

        setRecentChatList(chats);
        
        if (id === 0 && activeChatId > 0) {
            //added new chats
            router.navigate(`/chats/${activeChatId}`);
        }
    }, [chats]);

    useEffect(() => {
        if (isNewChat) {
            setActiveChat(0);
            showChatWindow(false);
            setActiveNewChat(true);
            return;
        }
        
        if (isMobileDevice()){
            if (id === 0) {
                setActiveChat(0);
                showChatWindow(false);
                setActiveNewChat(false);
                return;
            }
        }
        
        if (id === 0) {
            setActiveChat(0);
            showChatWindow(false);
            setActiveNewChat(true);
            return;
        }

        if (activeChatId === id){
            return;
        }
        
        //Opened specific chat by id in url
        showChatWindow(true);
        setActiveChat(id);
        setActiveNewChat(false);
    }, [id, isNewChat]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchChat(search);
        const filteredChats = chats.filter(
            chat => chat.latest_message && chat.latest_message.toString().toLowerCase().includes(search)
        );
        setRecentChatList(filteredChats);
    }, [chats]);


    const newChatHandleLinkClick = useCallback(() => {
        //TODO: do we need to make check that param is not already the same?
        if (newChat){
            return;
        }

        setActiveNewChat(true);
    });

    const chatHandleLinkClick = useCallback(() => {
        //TODO: do we need to make check that param is not already the same?
        if (chatWindow){
            return;
        }
        showChatWindow(true);
    });

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">
                <div className="px-2 pt-2">
                    <Link to="/chats/new_chat" className="btn btn-primary w-100 text-start new-chat-button" onClick={newChatHandleLinkClick}>{t('New Chat')}</Link>
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
                <div className="chats-list-wrapper">
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
                            recentChatList.map((chat, key) =>
                                <li 
                                    key={key} 
                                    id={"conversation"+ chat.id} 
                                    className={`px-2 pt-2 ${activeChatId === chat.id ? 'active' : ''}`}
                                    >
                                        <Link to={`/chats/${chat.id}`} onClick={chatHandleLinkClick}>
                                        {chat.latest_message 
                                            ? <h5 className="text-truncate font-size-15 mb-1">{chat.latest_message}</h5> 
                                            : <h5 className="text-truncate font-size-15 mb-1">{chat.name} </h5>
                                        }
                                            <p className="chat-user-message text-truncate mb-0">
                                                {t('Click to open chat')}
                                            </p>
                                        </Link>
                                </li>
                                )
                            }
                        </ul>
                </div>
                <SideBarMenuMobile />
            </div>
            {id ? <UserChat/> : <NewUserChat />}
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields. Prevent redundunt re-render 
const mapStateToProps = state => {
    const {
        chats,
        activeChatId,
        chatWindow,
        newChat,
        fetchChatsLoading,
        fetchChatsErrors
    } = state.Chat;
    return {
        chats,
        activeChatId,
        chatWindow,
        newChat,
        fetchChatsLoading,
        fetchChatsErrors,
        //TODO: cause redundun re-render
        authorizedUser: state.User.authorizedUser,
        userAgents: state.Agents.userAgents,
    };
};

const mapDispatchToProps = {
    fetchChats,
    setActiveChat,
    setActiveNewChat,
    showChatWindow
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chats));