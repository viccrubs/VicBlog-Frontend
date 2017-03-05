import * as React from 'react';
import { APIs, padding, twoColStyleLeft, twoColStyleRight } from '../Utils';
import { Spin, Menu, Col, Row } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';


interface AboutPageProps {
    currentPath: string
}

class AboutPage extends React.Component<AboutPageProps, void>{

    constructor(props) {
        super(props);
    }

    render() {
        const currentKey = this.props.currentPath.split('/')[2];
        return <Row type="flex" style={{margin:"16px auto 16px auto"}} gutter={32} >
            <Col lg={6} md={6} sm={24} xs={24}>
                <Menu selectedKeys={[currentKey]} mode="vertical">
                    <Menu.Item key="project"><Link to={"/about/project"}>About this project</Link></Menu.Item>
                    <Menu.Item key="me"><Link to={"/about/me"}>About me</Link></Menu.Item>
                    <Menu.Item key="tech"><Link to={"/about/tech"}>Tech details</Link></Menu.Item>
                </Menu>
            </Col>
            <Col lg={16} md={16} sm={24} xs={24}>
                {this.props.children}
            </Col>
        </Row>

    }
}

export default connect(
    s => ({ currentPath: s.routing.locationBeforeTransitions.pathname }),
    {}
)(AboutPage);