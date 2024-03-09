import React from 'react';
import { 
    Alert 
} from "reactstrap";
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import { useTranslation } from 'react-i18next';
import config from '../../../config';

function SendingMessageError(props) {
    const {
        sendMessageErrors,
    } = props;
    const { t } = useTranslation();
    const supportEmail =  config.SUPPORT_EMAIL;

    return (
        <React.Fragment>
            {/* TODO: add an ability to re-send failed messages */}
                { sendMessageErrors && (
                    <Alert color="danger">
                        {t("The message wasn't delivered to the server. Errors details")}:
                            {sendMessageErrors.details && 
                                (<ul className='ps-4'>
                                    {sendMessageErrors.details.map((error, index) => (
                                        <li key={index} className="p-0">
                                            {error}
                                        </li>
                                    ))}
                                </ul>)
                            }
                            {sendMessageErrors.details === undefined && 
                                (<pre>
                                    {JSON.stringify(sendMessageErrors)}
                                </pre>)
                            }
                            <hr/>
                            {t("If you do not know what to do with the error, write to us by mail")}: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
                    </Alert>
                )}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        sendMessageErrors: state.Message.sendMessageErrors,
    }
};

export default withRouter(connect(mapStateToProps, null)(SendingMessageError));