import React from 'react'
import PropTypes from 'prop-types'
import './Rect.scss'

const Rect = ({
    onDragStart
}) => {
    return (
        <div
            draggable
            onDragStart={ e => onDragStart(e, 'rect') }
            className="rect"
        >
        </div>
    )
}

Rect.propTypes = {
    selected: PropTypes.bool,
}

export default Rect
