import { Router } from 'express'

import {
  addingComment,
  deletingComment,
  editingComment,
  downloadingAttachedFile,
  removingAttachedFile,
  changingCover,
  changingListOfCard,
  addingCard,
  deletingCard,
  updatingCard,
} from '../controllers/card.controller'

export default Router
