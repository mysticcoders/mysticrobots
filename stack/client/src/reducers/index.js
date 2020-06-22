import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import boards from '../ducks/boards'
import challenges from '../ducks/challenges'
import scores from '../ducks/scores'

export default (history) => combineReducers({
  router: connectRouter(history),
  boards,
  challenges,
  scores,
})
