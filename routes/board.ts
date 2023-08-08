import { Router } from 'express'

import {
  addingMember,
  removingMember,
  getMemberList,
  changingVisibility,
  deletingBoard,
  addingBoard,
  updatingBoard,
  getLists,
} from '../controllers/board'

export default Router
