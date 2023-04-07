import React, { useRef, useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideDetector(ref, setShowingDropBox) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowingDropBox(false)
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, setShowingDropBox])
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideDetector(props) {
    const wrapperRef = useRef(null)
    useOutsideDetector(wrapperRef, props.setShowingDropBox)

    return <div ref={wrapperRef}>{props.children}</div>
}

export default OutsideDetector
