import * as React from 'react';
import MarkdownEditor from '../common/MarkdownEditor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { UserState, actionCreators as userActions, UserStatus } from '../../store/User';
import { browserHistory } from 'react-router';
import { ArticleFilterState } from '../../store/ArticleListFilter';
import { Link } from 'react-router';
import { Input, Button, Row, Col, Checkbox, notification, Alert, Spin } from 'antd';
import { padding, twoColStyleLeft, twoColStyleRight, simpleFormValidator } from '../../Utils';
import { actionCreators as composeActions, ComposeArticleState, ArticleSubmitStatus, EditorMode } from '../../store/ComposeArticle';
import ArticleEditorSidePanel from '../ArticleEditor/ArticleEditorSidePanel';
import UploadPanel, { UploadedFile } from '../common/UploadPanel';
import fetch from 'isomorphic-fetch';

type ArticleEditorProps = { user: UserState, compose: ComposeArticleState, initialArticle: Article } & typeof userActions & typeof composeActions;


class ArticleEditor extends React.Component<ArticleEditorProps, void>{

    constructor() {
        super();

    }
    componentDidMount() {
        this.props.setMode(this.props.initialArticle ? EditorMode.Patch : EditorMode.New);
        this.props.initiateArticleInfo(this.props.initialArticle);
    }
    
    submitArticle() {
        const payload = {
            title: this.props.compose.title,
            content: this.props.compose.content,
            tags: this.props.compose.selectedTags,
            category: this.props.compose.selectedCategory,
            rate: this.props.compose.rate
        };

        const emptyKeys = simpleFormValidator(payload);

        if (emptyKeys) {
            notification.error({
                message: `${this.props.compose.mode == EditorMode.New ? "Submit" : "Patch"} failed`,
                description: `${emptyKeys.join(",")} ${emptyKeys.length > 1 ? "are" : "is"} required.`
            });
            return;
        }

        notification.info({
            message: this.props.compose.mode == EditorMode.New ? "Submitting" : "Patching",
            description: `The article is being ${this.props.compose.mode == EditorMode.New ? "submitted" : "patched"}. This won't take long.`,
            duration: null
        });
        if (this.props.compose.mode == EditorMode.New) {
            this.props.submitArticle(this.props.user.user.token, payload, (article) => {
                notification.destroy();
                notification.success({
                    message: `Article submitted!`,
                    description: "The article has been submitted successfully. Redirected to the new page!"
                });
                //browserHistory.push(`/articles/${article.id}`);
            }, (errorInfo) => {
                notification.destroy();
                notification.error({
                    message: `Submit failed :(`,
                    description: `Something goes wrong :(`
                });
            });
        } else {
            this.props.patchArticle(this.props.initialArticle.id, this.props.user.user.token, payload, (result) => {
                notification.destroy();
                notification.success({
                    message: "Patch successfully!",
                    description: "The article has been patched successfully. Redirected to the new page!"
                });
                //browserHistory.push(`/articles/${result.id}`);
            }, (errorInfo) => {
                notification.destroy();
                notification.error({
                    message: `Patch failed :(`,
                    description: `Something goes wrong :(`
                });
            })
        }

    }

    handleUploadedFileClick(file: UploadedFile) {

        const picturePostfixes = [".jpg", ".jpeg", ".png", ".gif"];

        const a = picturePostfixes.map(x => file.filename.endsWith(x));

        if (a.indexOf(true)>-1) {
            this.props.changeContent(this.props.compose.content + `![${file.filename}](${file.url})`);
        }else{
            this.props.changeContent(this.props.compose.content + `[${file.filename}](${file.url})`)
        }
    }

    handleRemoveFile(file:UploadedFile){
        
    }


    render() {

        const loading = this.props.compose.submitStatus

        if (this.props.user.status != UserStatus.LoggedIn){
            return <div>
                <Alert message="You are not logged in!" type="error" />
                <a onClick={() => this.props.openLoginModal()}>Click this to login!</a>
            </div>;
        }
         
        return <Row>
           {this.props.compose.submitStatus == ArticleSubmitStatus.Submitting || this.props.compose.patchStatus == ArticleSubmitStatus.Submitting ? <Spin/> :[]}
                <Col style={padding} {...twoColStyleLeft}>
                    <ArticleEditorSidePanel />
                    <UploadPanel token={this.props.user.user.token} onClick={file=>this.handleUploadedFileClick(file)} />
                </Col>
                <Col style={padding} {...twoColStyleRight}>
                    You are currently logged in as {this.props.user.user.username}. Isn't it? <a onClick={this.props.logout}>Log out</a> or <a onClick={this.props.openLoginModal}>relogin</a><br />
                    {this.props.compose.mode == EditorMode.Patch ? `You are now patching Article with title ${this.props.initialArticle.title}.` : ""}
                    <Input placeholder="Title" value={this.props.compose.title} onChange={e => this.props.changeTitle((e.target as any).value)} />
                    <MarkdownEditor minRow={8} placeholder="Input your content here" content={this.props.compose.content} onContentChange={content => this.props.changeContent(content)} />
                    <Button type="primary" icon="upload" loading={this.props.compose.submitStatus == ArticleSubmitStatus.Submitting} onClick={() => this.submitArticle()} children="Submit" />
                </Col>
            </Row> ;
    }
}

export default connect(
    (s: ApplicationState) => ({ user: { ...s.user }, compose: { ...s.composeArticle } }),
    { ...userActions, ...composeActions },
    (state, dispatch, ownProps: any) => ({ ...state, ...dispatch, initialArticle: ownProps.initialArticle })
)(ArticleEditor);