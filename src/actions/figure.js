// import axios from 'axios'
import {
    ADD_FIGURE,
    DELETE_FIGURE,
    SELECT_FIGURE,
    SET_FIGURES
} from './types'


const deleteFigureActionCreator = (figure) => ({
    type: DELETE_FIGURE,
    payload: figure
})

const addFigureActionCreator = (figure) => ({
    type: ADD_FIGURE,
    payload: figure
})

const setFiguresActionCreator = (figures) => ({
    type: SET_FIGURES,
    payload: figures
})


/* Actions */
export const deleteFigure = (figure) => dispatch => {
    dispatch(deleteFigureActionCreator(figure))
}

export const addFigure = (figure) => dispatch => {
    dispatch(addFigureActionCreator(figure))
}

export const setFigures = (figures) => dispatch => {
    dispatch(setFiguresActionCreator(figures))
}
