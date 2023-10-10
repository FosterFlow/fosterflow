import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatInput from "./ChatInput";
import UserHead from "./UserHead";
import { 
    Card, 
    CardBody, 
    CardHeader,
    Form, 
    FormGroup,
    Label 
} from "reactstrap";
import { useTranslation } from 'react-i18next';
import {
    getAgents, 
} from "../../../redux/actions";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function UserChat(props) {
    const { t } = useTranslation();
    const {
        getAgents,
        authorizedUser,
        agents,
        newChat
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
            <div className={`user-chat user-chat-new ${newChat ? 'user-chat-show' : ''}`}>
                <div className="user-chat-wrapper">
                    <UserHead />
                    <div className="user-chat-conversation" id="messages">
                        {/* Styled Selector using Reactstrap */}
                        <Card className="border">
                            <CardHeader>
                                {t('Agents')}
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                            <DropdownToggle caret>
                                                {t('Select an agent to chat with')}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {agents && agents.map((agent, index) => 
                                                <DropdownItem key={index} onClick={() => {/* handle agent select */}}>
                                                    {agent.name}
                                                </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                         </Card>       
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
    getAgents
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));