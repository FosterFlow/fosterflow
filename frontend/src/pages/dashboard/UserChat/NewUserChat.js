import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatInput from "./ChatInput";
import UserHead from "./UserHead";
import { useTranslation } from 'react-i18next';
import {
    getAgents, 
    setActiveAgent,
} from "../../../redux/actions";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function UserChat(props) {
    const { t } = useTranslation();
    const {
        getAgents,
        authorizedUser,
        agents
    } = props;

    // State to manage dropdown toggle
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    useEffect(() => {
        if (authorizedUser === null ||
            authorizedUser.is_email_confirmed === false){
            return;
        }

        getAgents();
    }, [authorizedUser, getAgents]);

    return (
        <React.Fragment>
            <div className={`user-chat user-chat-new ${props.newChat ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div className="user-chat-conversation" id="messages">
                        {/* Styled Selector using Reactstrap */}
                        <label htmlFor="agentSelector">{t('Select an agent to chat with:')}</label>
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle caret>
                                {t('Choose an Agent')}
                            </DropdownToggle>
                            <DropdownMenu>
                                {agents && agents.map((agent, index) => 
                                    <DropdownItem key={index} onClick={() => {/* handle agent select */}}>
                                        {agent.first_name + " " + agent.last_name}
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
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
        newChat: state.Chat.newChat,
        authorizedUser: state.User.authorizedUser,
        agents: state.Agents.agents,
    }
};

const mapDispatchToProps = {
    getAgents,
    setActiveAgent,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));