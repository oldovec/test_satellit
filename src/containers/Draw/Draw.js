import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Ellipse from '../../components/Ellipse/Ellipse';
import Rect from '../../components/Rect/Rect';
import { 
    deleteFigure,
    addFigure,
    setFigures
} from '../../actions/figure'
import { TYPE_RECT, TYPE_ELLIPSE } from '../../actions/types';
import './Draw.scss'

const Draw = ({
    width,
    height,
    figures,
    deleteFigure,
    addFigure,
    setFigures
}) => {

    const figureWidth = 80;
    const figureHeight = 50;
    const canvasRef = useRef(null)
    const ellipseRef = useRef(null)
    const rectRef = useRef(null)

    const [mouse, setMouse] = useState({})

    const [selected, setSelected] = useState(false)

    const isCursorInCanvas = (x, y) => {
        return x >= canvasRef.current.offsetLeft && x <= canvasRef.current.offsetLeft + canvasRef.current.width
            && y >= canvasRef.current.offsetTop && y <= canvasRef.current.offsetTop + canvasRef.current.height
    }

    const onMouseMoveContent = (e) => {
        if (mouse.out && selected && !isCursorInCanvas(e.pageX, e.pageY)) {
            switch (selected.type) {
                case 'ellipse':
                    ellipseRef.current.style.top = `${e.pageY - figureHeight / 2}px`
                    ellipseRef.current.style.left = `${e.pageX - figureWidth / 2}px`
                    break
                case 'rect':
                    rectRef.current.style.top = `${e.pageY - figureHeight / 2}px`
                    rectRef.current.style.left = `${e.pageX - figureWidth / 2}px`
                    break
            }
        } else {
            setMouse(prevMouse => ({
                ...prevMouse,
                out: false
            }))
        }
    }

    
    const onMouseUpContent = e => {
        if (selected && mouse.down) {
            setSelected(false)
            setMouse(prevMouse => ({
                ...prevMouse,
                down: false
            }))
        }
    }


    const onDragStart = (e, type) => {
        e.dataTransfer.setData("type", type);
    }

    const onMouseMove = e => {
        e.stopPropagation()

        const x = e.pageX - canvasRef.current.offsetLeft
        const y = e.pageY - canvasRef.current.offsetTop
        setMouse(prevMouse => ({
            ...prevMouse,
            x,
            y,
            out: false
        }))

        if (selected && mouse.down) {
            setFigures(figures.map(figure => {
                if (figure === selected) {
                    figure.x = mouse.x - figureWidth / 2
                    figure.y = mouse.y - figureHeight / 2
                }
                return figure
            }))
        }
    }

    const onMouseDown = e => {
        e.stopPropagation()
        let isCursorOnAnyFigure = false
        setMouse(prevMouse => ({ ...prevMouse, down: true }))
        figures.forEach(figure => {
            if (isCursorInFigure(mouse.x, mouse.y, figure)) {
                setSelected(figure)
                addFigure(figure)
                isCursorOnAnyFigure = true;
            }
        })

        if (!isCursorOnAnyFigure) {
            setSelected(false)
        }

    }

    const onMouseUp = e => {
        e.stopPropagation()
        setMouse(prevMouse => ({ ...prevMouse, down: false }))
    }

    const isCursorInFigure = (x, y, figure) => {
        return x > figure.x && x < figure.x + figureWidth
            && y > figure.y && y < figure.y + figureHeight
    }

    const onDragOver = e => {
        e.preventDefault()
        const x = e.pageX - canvasRef.current.offsetLeft
        const y = e.pageY - canvasRef.current.offsetTop
        setMouse(prevMouse => ({
            ...prevMouse,
            x,
            y,
        }))
    }

    const onMouseOver = e => {
        e.stopPropagation()
        if (selected && mouse.down) {
            addFigure(selected)
            setMouse(prevMouse => ({
                ...prevMouse,
                out: false
            }))
        }
    }

    const onDrop = e => {
        let type = e.dataTransfer.getData("type");
        const draggedFigure = {
            x: mouse.x - figureWidth / 2,
            y: mouse.y - figureHeight / 2,
            type
        }
        addFigure(draggedFigure)
        setSelected(draggedFigure)
    }

    const onMouseOut = e => {
        if (mouse.down && selected) {
            deleteFigure(selected)
            setMouse(prevMouse => ({
                ...prevMouse,
                out: true
            }))
        }
    }

    const drawFigure = (figure, context) => {
        context.lineWidth = 1;
        if (figure === selected) {
            context.lineWidth = 4
        }
        context.strokeStyle = '#000'

        switch (figure.type) {
            case TYPE_RECT:
                context.fillStyle = '#0F0'
                context.fillRect(figure.x, figure.y, figureWidth, figureHeight)
                context.strokeRect(figure.x, figure.y, figureWidth, figureHeight)
                context.stroke()
                break
            case TYPE_ELLIPSE:
                context.fillStyle = '#00F'
                context.ellipse(
                    figure.x + figureWidth / 2,
                    figure.y + figureHeight / 2,
                    figureWidth / 2,
                    figureHeight / 2,
                    0,
                    0,
                    2 * Math.PI
                )
                context.fill()
                context.stroke();
                context.beginPath();
                break
        }

    }
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, width, height)
        ctx.beginPath();
        figures.forEach(figure => {
            drawFigure(figure, ctx)
        })

        document.onkeydown = e => {
            if (e.key === 'Delete' && selected) {
                deleteFigure(selected)
                setSelected(false)
            }
        }
    }, [selected, figures, mouse])
    return (
        <div
            className="content"
            onMouseUp={ onMouseUpContent }
            onMouseMove={ onMouseMoveContent }
        >
            <div
                ref={ ellipseRef }
                className={ `ellipse drag-out ${mouse.out && selected.type === 'ellipse' ? 'active' : ''}` }
            />
            <div
                ref={ rectRef }
                className={ `rect drag-out ${mouse.out && selected.type === 'rect' ? 'active' : ''}` }
            />
            <div className="table">
                <div className="table__header">
                    <div className="table__header-item">
                        Figures
            </div>
                    <div className="table__header-item">
                        Canvas
            </div>
                </div>
                <div className="table__body">
                    <div className="table__body-item figures">
                        <div className="figures__figure">
                            <Ellipse onDragStart={ onDragStart } />
                        </div>
                        <div className="figures__figure">
                            <Rect onDragStart={ onDragStart } />
                        </div>

                    </div>
                    <div
                        className="table__body-item">
                        <canvas
                            width={`${width}px`}
                            height={`${height}px`}
                            onMouseMove={ onMouseMove }
                            onMouseDown={ onMouseDown }
                            onMouseUp={ onMouseUp }
                            onMouseOut={ onMouseOut }
                            onMouseOver={ onMouseOver }
                            onDragOver={ onDragOver }
                            onDrop={ onDrop }
                            ref={ canvasRef }
                            className="canvas"
                        ></canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}

Draw.propTypes = {
    figures: PropTypes.array.isRequired,
    deleteFigure: PropTypes.func.isRequired,
    addFigure: PropTypes.func.isRequired,
    setFigures: PropTypes.func.isRequired,
    
}

const mapStateToProps = state => ({
    figures: state.figure.figures,
})

export default connect(mapStateToProps, { deleteFigure, addFigure, setFigures })(Draw)
