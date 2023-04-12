import { Router } from 'express';

import {
    addingMember,
    removingMember,
    getMemberList,
    changingVisibility,
    deletingBoard,
    addingBoard,
    updatingBoard,
    getLists
} from '../controllers/board.controller';

export default Router;