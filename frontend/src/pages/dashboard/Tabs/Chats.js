import React, { useState, useEffect, useCallback } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import UserChat from "../UserChat/";
import NewUserChat from "../NewUserChat";
import { 
    fetchChats,
    fetchMessages,
    setActiveChat,
    setActiveNewChat,
    showChatWindow 
} from "../../../redux/actions";
//i18n
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

const Chats = (props) => {
    const id = Number(props.router.params.id) || 0;
    const [searchChat, setSearchChat] = useState("");
    const [recentChatList, setRecentChatList] = useState([]);
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    useEffect(() => {
        if (props.authorizedUser === null){
            return;
        }

        if (props.authorizedUser.is_email_confirmed === false){
            return;
        }

        props.fetchChats();
    }, [props.authorizedUser]);

    useEffect(() => {
        const chats = props.chats; 
        if (chats && chats.length === 0) {
            return;
        }

        setRecentChatList(chats.reverse());
        
        const activeChatId = props.activeChatId;
        if (id === 0 && activeChatId > 0) {
            //added new chats
            props.router.navigate(`/chats/${activeChatId}`);
        }
    }, [props.chats]);

    useEffect(() => {
        if (id === 0) {
            props.setActiveChat(0);
            props.showChatWindow(false);
            props.setActiveNewChat(true);
            return;
        }

        if (props.activeChatId === id){
            return;
        }
        
        //Opened specific chat by id in url
        props.showChatWindow(true);
        props.setActiveChat(id);
        props.setActiveNewChat(false);

        //TODO: we have to check if we already have actual messages into state
        props.fetchMessages(id);
    }, [id]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchChat(search);
        const filteredChats = props.chats.filter(
            chat => chat.latest_message && chat.latest_message.toString().toLowerCase().includes(search)
        );
        setRecentChatList(filteredChats);
    }, [props.chats]);


    const newChatHandleLinkClick = useCallback(() => {
        //TODO: do we need to make check that param is not already the same?
        if (props.newChat){
            return;
        }

        props.setActiveNewChat(true);
    });

    const chatHandleLinkClick = useCallback(() => {
        //TODO: do we need to make check that param is not already the same?
        if (props.chatWindow){
            return;
        }
        props.showChatWindow(true);
    });

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">
                <div className="px-2 pt-2">
                    <Link to="/chats" className="btn btn-primary w-100 text-start" onClick={newChatHandleLinkClick}>{t('New Chat')}</Link>
                </div>
                <div className="px-2 pt-2">
                    <div className="search-box chat-search-box">
                        <InputGroup className="mb-3 rounded-3">
                            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </span>
                            <Input type="text" value={searchChat} onChange={handleSearchChange} className="form-control bg-light" placeholder={t('Search in chats')} />
                        </InputGroup>
                    </div>
                </div>
                <div className="chats-list-wrapper">
                        <ul className="list-unstyled chats-list" id="chat-list">
                            {
                                recentChatList.map((chat, key) =>
                                    <li 
                                        key={key} 
                                        id={"conversation"+ chat.id} 
                                        className={`px-2 pt-2 ${props.activeChatId === chat.id ? 'active' : ''}`}
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
const mapStateToProps = (state) => ({
    chats: state.Chat.chats,
    activeChatId: state.Chat.activeChatId,
    chatWindow: state.Chat.chatWindow,
    newChat: state.Chat.newChat,
    //TODO: cause redundun re-render
    authorizedUser: state.User.authorizedUser
});

const mapDispatchToProps = {
    fetchChats,
    fetchMessages,
    setActiveChat,
    setActiveNewChat,
    showChatWindow
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chats));
