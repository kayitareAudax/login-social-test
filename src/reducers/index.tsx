import { combineReducers } from 'redux'

import authorization from './authorizationReducer'

const rootReducer = combineReducers({
    authorization,
})

export default rootReducer
