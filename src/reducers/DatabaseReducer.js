import { FETCH_ALL_POSTS, FETCH_ALL_COMMENTS, FETCH_ALL_FORUMS } from "../actions/constables";

const DatabaseReducer = (
  state = {
    allPosts: [],
    allComments: [],
    allForums: [],
    loading: false
  },
  action
) => {
  switch (action.type) {
    case FETCH_ALL_POSTS:
      return Object.assign({}, state, {
        allPosts: action.payload.all_posts,
        loading: action.payload.loading,
      });

    case FETCH_ALL_COMMENTS:
      return Object.assign({}, state, {
        allComments: action.payload.all_comments,
        loading: action.payload.loading,
      });

    case FETCH_ALL_FORUMS:
      return Object.assign({}, state, {
        allForums: action.payload.all_forums,
        loading: action.payload.loading,
      });

    default:
      return state;
  }
};

export default DatabaseReducer;
