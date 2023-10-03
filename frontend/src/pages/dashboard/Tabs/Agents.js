import React, { useState, useEffect, useCallback } from 'react';
import { 
    Input, 
    InputGroup,
    Spinner,
    Alert 
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import UserChat from "../UserChat/";
import NewUserChat from "../NewUserChat";
import config from '../../../config';
import {
    getAgents, 
    setActiveChat,
    setActiveNewChat,
    showChatWindow 
} from "../../../redux/actions";
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

const Agents = (props) => {
    const id = Number(props.router.params.id) || 0;
    const [searchChat, setSearchChat] = useState("");
    const [recentAgentsList, setRecentAgentsList] = useState([]);
    const supportEmail =  config.SUPPORT_EMAIL;
    const { t } = useTranslation();
    const {
        agent,
        agents,

        getAgentsLoading,
        getAgentsSucess,
        getAgentsErrors,

        getAgents,
        setActiveChat,
        setActiveNewChat,
        showChatWindow,

        chats,
        fetchChatsLoading,
        fetchChatsErrors,

        activeChatId,
        chatWindow,
        newChat,
        authorizedUser
    } = props;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false){
            return;
        }

        getAgents();
    }, [authorizedUser]);

    useEffect(() => {
        if (agents && agents.length === 0) {
            return;
        }

        setRecentAgentsList(agents);
        
        // if (id === 0 && activeChatId > 0) {
        //     //added new chats
        //     router.navigate(`/chats/${activeChatId}`);
        // }
    }, [agents]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchChat(search);
        const filteredAgents = agents.filter(
            agent=> agent.name && agent.name.toString().toLowerCase().includes(search)
        );
        setRecentAgentsList(filteredAgents);
    }, [agents]);


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
                                placeholder={t('Find agent')}
                                disabled={getAgentsLoading} 
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="chats-list-wrapper">
                    {  getAgentsLoading &&
                        <div className="d-flex justify-content-center">
                            <Spinner size="sm"/>
                        </div>
                    }
                    { getAgentsErrors && (
                        <Alert color="danger">
                            {t('Errors details')}:
                            <ul>
                                {getAgentsErrors.details.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                            <hr/>
                            {t("If you do not know what to do with the error, write to us by mail")}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                        </Alert>
                    )}
                    <ul className="list-unstyled chats-list" id="chat-list">
                        {
                            recentAgentsList.map((agent, key) =>
                                <li 
                                    key={key} 
                                    id={"conversation" + agent.id} 
                                    className={`px-2 pt-2 ${activeChatId === agent.id ? 'active' : ''}`}
                                    >
                                        <Link to={`/chats/${agent.id}`} onClick={chatHandleLinkClick}>
                                            <h5 className="text-truncate font-size-15 mb-1">
                                                {agent.avatar &&   
                                                    <img src={agent.avatar} alt="" className="profile-user rounded-circle" />
                                                }
                                                
                                                {agent.first_name} {agent.last_name}
                                            </h5> 
                                            <p className="chat-user-message text-truncate mb-0">
                                                {t("Click to open agent's profile")}
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
        agent,
        agents,

        getAgentsLoading,
        getAgentsSucess,
        getAgentsErrors
    } = state.Agents;
    return {
        agent,
        agents,

        getAgentsLoading,
        getAgentsSucess,
        getAgentsErrors,
        //TODO: cause redundun re-render
        authorizedUser: state.User.authorizedUser,
    };
};

const mapDispatchToProps = {
    getAgents,
    setActiveChat,
    setActiveNewChat,
    showChatWindow
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Agents));
