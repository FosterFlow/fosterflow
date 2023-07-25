import React, { useState, useEffect, useCallback } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import SimpleBar from "simplebar-react";
import UserChat from "../UserChat/";
import NewUserChat from "../NewUserChat";
import { fetchDialogues, fetchMessages, getAuthorizedUser, setActiveDialogue, setActiveNewChat, showChatWindow } from "../../../redux/actions";
//i18n
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

const Chats = (props) => {
    console.log("Chats, props", JSON.stringify(props));
    const id = Number(props.router.params.id) || 0;
    const [searchChat, setSearchChat] = useState("");
    const [recentChatList, setRecentChatList] = useState([]);
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    useEffect(() => {
        props.getAuthorizedUser();
    }, []);

    useEffect(() => {
        if (props.authorizedUser === null){
            return;
        }

        if (props.authorizedUser.is_email_confirmed === false){
            return;
        }

        props.fetchDialogues();
    }, [props.authorizedUser]);

    useEffect(() => {
        const dialogues = props.dialogues; 
        if (dialogues && dialogues.length === 0) {
            return;
        }

        setRecentChatList(dialogues);
        
        const activeDialogueId = props.activeDialogueId;
        if (id === 0 && activeDialogueId > 0) {
            //added new dialogue
            props.router.navigate(`/chats/${activeDialogueId}`);
        }
    }, [props.dialogues]);

    useEffect(() => {
        if (id === 0) {
            props.setActiveDialogue(0);
            props.showChatWindow(false);
            props.setActiveNewChat(true);
            return;
        }

        if (props.activeDialogueId === id){
            return;
        }
        
        //Opened specific chat by id in url
        props.showChatWindow(true);
        props.setActiveDialogue(id);
        props.setActiveNewChat(false);

        //TODO: we have to check if we already have actual messages into state
        props.fetchMessages(id);
    }, [id]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchChat(search);
        const filteredDialogues = props.dialogues.filter(
            dialogue => dialogue.latest_message && dialogue.latest_message.toString().toLowerCase().includes(search)
        );
        setRecentChatList(filteredDialogues);
    }, [props.dialogues]);


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
                <div>
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
                </div>

                <div className="chat-message-list-wrapper">
                    <div className="chat-message-list">
                        <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                            {
                                recentChatList.map((dialogue, key) =>
                                    <li 
                                        key={key} 
                                        id={"conversation"+ dialogue.id} 
                                        className={`px-2 pt-2 ${props.activeDialogueId === dialogue.id ? 'active' : ''}`}
                                    >
                                        <Link to={`/chats/${dialogue.id}`} onClick={chatHandleLinkClick}>
                                        {dialogue.latest_message 
                                            ? <h5 className="text-truncate font-size-15 mb-1">{dialogue.latest_message}</h5> 
                                            : <h5 className="text-truncate font-size-15 mb-1">{dialogue.name} </h5>
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
                </div>
                <SideBarMenuMobile />
            </div>
            {id ? <UserChat/> : <NewUserChat />}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    dialogues: state.Chat.dialogues,
    activeDialogueId: state.Chat.activeDialogueId,
    chatWindow: state.Chat.chatWindow,
    newChat: state.Chat.newChat,
    //TODO: cause redundun re-render
    authorizedUser: state.User.authorizedUser
});

const mapDispatchToProps = {
    getAuthorizedUser,
    fetchDialogues,
    fetchMessages,
    setActiveDialogue,
    setActiveNewChat,
    showChatWindow
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chats));
