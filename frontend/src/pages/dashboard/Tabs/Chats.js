import React from 'react';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import ChatsList from "../Chats/ChatsList";
import Chat from "../Chats/";
import NewChat from "../Chats/NewChat";

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