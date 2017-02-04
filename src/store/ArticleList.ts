import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { APIs } from '../Utils';
import { actionCreators as listActionCreators } from './ArticleList';

interface SectionState<ContentType> {
    requesting: boolean,
    content: ContentType[],
    error: ErrorType
}

export interface ArticleListState {
    tags: SectionState<string>,
    categories: SectionState<string>,
    articleList: SectionState<ArticleBrief>
    searching: boolean,
    filter: ArticleFilter,
    lastUpdated: Date
}

export interface ArticleBrief {
    id: number,
    username: number,
    submitTime: Date,
    lastEditedTime: Date,
    category: string,
    tags: string[]
    title: string
}

export interface ArticleFilter {
    categories: string[],
    titleText: string,
    tags: string[]
}


export enum ErrorType {
    None,
    Others
}

interface ErrorTags { type: "ERROR_TAGS", errorInfo: ErrorType }
interface ErrorCategories { type: "ERROR_CATEGORIES", errorInfo: ErrorType }
interface ErrorArticleList { type: "ERROR_ARTICLE_LIST", errorInfo: ErrorType }
interface RequestTags { type: "REQUEST_TAGS" }
interface ReceiveTags { type: "RECEIVE_TAGS", tags: string[] }
interface RequestCategories { type: "REQUEST_CATEGORIES" }
interface ReceiveCategories { type: "RECEIVE_CATEGORIES", categories: string[] }
interface RequestAllArticle{type: "REQUEST_ALL_ARTICLES" }
interface ReceiveArticleList { type: "RECEIVE_ARTICLE_LIST", articleList: ArticleBrief[]}
interface RequestSearch { type: "REQUEST_SEARCH", filter: ArticleFilter }
interface ChangeFilter { type: "CHANGE_FILTER", filter: ArticleFilter}

type KnownAction = ChangeFilter| RequestSearch|  ErrorTags | ErrorCategories | ErrorArticleList | RequestTags | ReceiveTags | RequestCategories|ReceiveCategories|RequestAllArticle|ReceiveArticleList;

export const actionCreators = {
    requestAllTags: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "REQUEST_TAGS" });
        let url = APIs.tags;
        fetch(url).then(res => res.json().then(res => {
            dispatch({ type: "RECEIVE_TAGS", tags: res as string[] });
        })).catch(res => dispatch({ type: "ERROR_TAGS", errorInfo: ErrorType.Others }))
    },
    requestArticleList: (filter?: ArticleFilter): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let url = APIs.articles;
        if (filter) {
            url += "?";
            filter.categories.map(item => {
                url += `Categories=${item}&`;
            });
            filter.tags.map(item=>{
                url += `Tag=${item}&`;
            });
            url+= `titleText=${filter.titleText}`;
            dispatch({type: "REQUEST_SEARCH", filter: filter});
        }else{
            dispatch({type: "REQUEST_ALL_ARTICLES"});
        }
        fetch(url).then(res => res.json().then(res => {
            dispatch({ type: "RECEIVE_ARTICLE_LIST", articleList: res as ArticleBrief[] });
        })).catch(res => dispatch({ type: "ERROR_ARTICLE_LIST", errorInfo: ErrorType.Others }))
    },
    requestAllCategories: ():AppThunkAction<KnownAction> => (dispatch, getState)=>{
        dispatch({type:"REQUEST_CATEGORIES"});
        let url = APIs.categories;
        fetch(url).then(res => {
            if (res.status == 200) {
                res.json().then(json => {
                    dispatch({ type: "RECEIVE_CATEGORIES", categories: json as string[] });
                });
            }
            else {
                dispatch({ type: "ERROR_CATEGORIES", errorInfo: ErrorType.Others });
            }

        }).catch(res=>dispatch({type:"ERROR_CATEGORIES", errorInfo: ErrorType.Others}));
    },
    changeFilter:(filter:ArticleFilter) => ({type:"CHANGE_FILTER", filter: filter})
}

export const initialState : ArticleListState = {
    tags: {
        requesting: false,
        content: [],
        error: ErrorType.None
    },
    categories:{
        requesting: false,
        content: [],
        error: ErrorType.None
    },
    articleList:{
        requesting: false,
        content: [],
        error: ErrorType.None
    },
    filter: {
        categories: [],
        tags:[],
        titleText:""
    },
    searching: false,
    lastUpdated: null
    
};

export const reducer: Reducer<ArticleListState> = (state: ArticleListState, action: KnownAction)=>{
    switch(action.type){
        case "REQUEST_CATEGORIES":
            return {...state, categories: { requesting: true, error: ErrorType.None, content: state.categories.content  }};
        case "REQUEST_TAGS":
            return {...state, tags: { requesting: true, error: ErrorType.None, content: state.tags.content  }};
        case "RECEIVE_CATEGORIES":
            return { ...state, categories: { requesting: false, error: ErrorType.None, content: action.categories  } };
        case "RECEIVE_TAGS":
            return { ...state, tags: { requesting: false, error: ErrorType.None, content: action.tags  } };
        case "REQUEST_ALL_ARTICLES":
            return {...state, articleList:{requesting: true, error: ErrorType.None, content: state.articleList.content}};
        case "RECEIVE_ARTICLE_LIST":
            return {...state, lastUpdated: new Date( Date.now()),  articleList:{requesting: true, error:ErrorType.None, content: action.articleList}};
        case "ERROR_CATEGORIES":
            return { ...state, categories:{requesting: false, error: action.errorInfo, content: state.categories.content}};
        case "ERROR_TAGS":
            return { ...state, tags:{requesting: false, error: action.errorInfo, content: state.tags.content}};
        case "ERROR_ARTICLE_LIST":
            return { ...state, articleList:{requesting: false, error: action.errorInfo, content: state.articleList.content}};
        case "REQUEST_SEARCH":
            return {...state, searching: true, articleList:{requesting: true, error:ErrorType.None, content: state.articleList.content}};
        case "CHANGE_FILTER":
            return {...state, filter: action.filter};
        default:
            const exhausiveCheck: never = action;
    };
    return state || initialState;
};