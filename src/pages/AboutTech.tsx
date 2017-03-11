import * as React from 'react';
import { APIs,errorMessage } from '../Utils';
import { Spin,Alert } from 'antd';
import { actionCreators } from '../store/AboutPage';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { MarkdownDisplay } from '../components/common';


type AboutTechPageProps = typeof actionCreators & { loading: boolean, error: boolean, content: string, loaded: boolean };

class AboutTechPage extends React.Component<AboutTechPageProps, void>{

    componentDidMount() {
        if (this.props.loaded) {
            return;
        }
        this.props.fetchAboutTech();
    }

    constructor(props) {
        super(props);
    }

    render() {
        document.title = "Tech Details - VicBlog";
        return this.props.loading
            ? <div><Spin spinning size="large"> Loading</Spin></div>
            : (this.props.error
                ? <Alert type="error" message={errorMessage.Network} />
                : <MarkdownDisplay content={this.props.content}/>);
    }
}

export default connect(
    s => ({ ...s.aboutPage.aboutTech }),
    actionCreators
)(AboutTechPage);