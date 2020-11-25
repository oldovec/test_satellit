import React from 'react'
import PropTypes from 'prop-types'
import './Ellipse.scss'

const Ellipse = ({
    onDragStart,
}) => {
    return (
        <div
            onDragStart={ e => onDragStart(e, 'ellipse') }
            draggable
            className="ellipse"
        >
        </div>
    )
}
Ellipse.propTypes = {
    selected: PropTypes.bool,
}

export default Ellipse
