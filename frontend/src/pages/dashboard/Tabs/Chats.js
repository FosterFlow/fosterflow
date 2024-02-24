import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatsList from "../Chat/ChatsList";
import Chat from "../Chat";
import NewChat from "../Chat/NewChat";

const Chats = (props) => {
    console.log ('Tabs Chats rendering');
    const id = Number(props.router.params.id) || 0;

    return (
        <React.Fragment>
            <ChatsList/>
            {id ? <Chat/> : <NewChat />}
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {};
};

export default withRouter(connect(mapStateToProps, null)(Chats));