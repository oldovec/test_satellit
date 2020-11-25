import { 
    ADD_FIGURE, DELETE_FIGURE, SET_FIGURES, 
} from "../actions/types"

const initialState = {
    figures: [
    
    ]
}

export default (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        case DELETE_FIGURE: 
            return {
                ...state,
                figures: state.figures.filter(figure => figure !== payload)
            }
        case ADD_FIGURE:
            return {
                ...state,
                figures: [...state.figures, payload]
            }
        case SET_FIGURES:
            return {
                ...state,
                figures: payload
            }

        default:
            return {
                ...state
            }
    }
}



