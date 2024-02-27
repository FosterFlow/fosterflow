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
import NewAgentChat from "../Agent/NewAgentChat";
import config from '../../../config';
import {
    getAiAgents, 
    setActiveAgent,
    showNewAgentChat 
} from "../../../redux/actions";
import { useTranslation } from 'react-i18next';
import { isMobileDevice } from '../../../helpers/mobileDevices';

const Agents = (props) => {
    const id = Number(props.router.params.id) || 0;
    const [searchAgent, setSearchAgent] = useState("");
    const [recentAgentsList, setRecentAgentsList] = useState([]);
    const supportEmail =  config.SUPPORT_EMAIL;
    const { t } = useTranslation();
    const {
        router,
        aiAgents,
        activeAgentId,
        setActiveAgent,
        getAiAgents,
        getAgentsLoading,
        getAgentsErrors,
        authorizedUser,
        showNewAgentChat,
    } = props;

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false){
            return;
        }

        getAiAgents();
    }, [authorizedUser]);

    useEffect(() => {
        if (aiAgents && aiAgents.length === 0) {
            return;
        }

        setRecentAgentsList(aiAgents);
        
        if (id === 0 && activeAgentId > 0) {
            router.navigate(`/agents/${activeAgentId}`);
        }
    }, [aiAgents]);

    const handleSearchChange = useCallback((event) => {
        const search = event.target.value.toLowerCase();
        setSearchAgent(search);
        const filteredAgents = aiAgents.filter(
            agent=> {
                const agentName = agent.name  
                return agentName.toString().toLowerCase().includes(search)
            }
        );
        setRecentAgentsList(filteredAgents);
    }, [aiAgents]);

    useEffect(() => {
        if (isMobileDevice()){
            if (id === 0) {
                setActiveAgent(id);
                showNewAgentChat(false);
                return;
            }
        }
        
        if (activeAgentId === id){
            return;
        }
        
        showNewAgentChat(true);
        setActiveAgent(id);
    }, [id]);

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
                                    id={"conversation" + agent.id} 
                                    className={`px-2 pt-2 ${activeAgentId === agent.id ? 'active' : ''}`}
                                    >
                                        <Link to={`/agents/${agent.id}`}>
                                            <h5 className="text-truncate font-size-15 mb-1">
                                                {agent.avatar &&   
                                                    <img src={agent.avatar} alt="" className="profile-user rounded-circle" />
                                                }
                                                {agent.name ?
                                                    agent.name :
                                                    t('No name')
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
            </div>
            <NewAgentChat />
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields. Prevent redundunt re-render 
const mapStateToProps = state => {
    const {
        aiAgents,
        activeAgentId,
        getAgentsLoading,
        getAgentsSucess,
        getAgentsErrors
    } = state.Agents;
    return {
        aiAgents,
        activeAgentId,
        getAgentsLoading,
        getAgentsSucess,
        getAgentsErrors,
        //TODO: cause redundun re-render
        authorizedUser: state.User.authorizedUser
    };
};

const mapDispatchToProps = {
    getAiAgents,
    setActiveAgent,
    showNewAgentChat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Agents));
