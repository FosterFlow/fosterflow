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
import NewAgentChat from "../NewAgentChat";
import config from '../../../config';
import {
    getAgents, 
    // setActiveAgent,
    setActiveNewChat,
    showChatWindow 
} from "../../../redux/actions";
import { useTranslation } from 'react-i18next';
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';

const Agents = (props) => {
    const id = Number(props.router.params.id) || 0;
    const [searchAgent, setSearchAgent] = useState("");
    const [recentAgentsList, setRecentAgentsList] = useState([]);
    const supportEmail =  config.SUPPORT_EMAIL;
    const { t } = useTranslation();
    const {
        router,

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

        activeAgentId,
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
        
        if (id === 0 && activeAgentId > 0) {
            router.navigate(`/agents/${activeAgentId}`);
        }
    }, [agents]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchAgent(search);
        const filteredAgents = agents.filter(
            agent=> {
                const agentFullName = agent.first_name + " " + agent.last_name  
                return agentFullName.toString().toLowerCase().includes(search)
            }
        );
        setRecentAgentsList(filteredAgents);
    }, [agents]);


    const agentHandleLinkClick = useCallback(() => {
        //TODO: do we need to make check that param is not already the same?
        // if (agentWindow){
        //     return;
        // }
        // showAgentWindow(true);
    });

    return (
        <React.Fragment>
            <div className="agents-leftsidebar me-lg-1">
                <div className="px-2 pt-2">
                    <div className="search-box agents-search-box">
                        <InputGroup className="mb-3 rounded-3">
                            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </span>
                            <Input 
                                type="text" 
                                value={searchAgent} 
                                onChange={handleSearchChange} 
                                className="form-control bg-light" 
                                placeholder={t('Find agent')}
                                disabled={getAgentsLoading} 
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="agents-list-wrapper">
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
                    <ul className="list-unstyled agents-list" id="agents-list">
                        {
                            recentAgentsList.map((agent, key) =>
                                <li 
                                    key={key} 
                                    id={"conversation" + agent.user_id} 
                                    className={`px-2 pt-2 ${activeAgentId === agent.user_id ? 'active' : ''}`}
                                    >
                                        <Link to={`/agents/${agent.user_id}`} onClick={agentHandleLinkClick}>
                                            <h5 className="text-truncate font-size-15 mb-1">
                                                {agent.avatar &&   
                                                    <img src={agent.avatar} alt="" className="profile-user rounded-circle" />
                                                }
                                                {agent.first_name ?
                                                    agent.first_name :
                                                    t('No name')
                                                }
                                                &nbsp;
                                                {agent.last_name ?
                                                    agent.last_name :
                                                    t('No surname')
                                                }
                                            </h5> 
                                            <p className="agents-user-message text-truncate mb-0">
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
            <NewAgentChat />
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
    // setActiveAgent,
    setActiveNewChat,
    showChatWindow
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Agents));
