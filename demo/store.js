import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const initialState = {
  isAuth: false
}

export const actionTypes = {
  SUCCESS_LOGIN: 'SUCCESS_LOGIN'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUCCESS_LOGIN:
      return Object.assign({}, state, {
        isAuth: true
      })
    default:
      return state
  }
}

// ACTIONS
// export const serverRenderClock = isServer => dispatch => {
//   return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() })
// }

export const doLogin = dispatch => {
  return setTimeout(() => {
    dispatch({ type: actionTypes.SUCCESS_LOGIN })
  }, 1000)
}

// export const incrementCount = () => dispatch => {
//   return dispatch({ type: actionTypes.INCREMENT })
// }

export function initializeStore (initialState = initialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}
