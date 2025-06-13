import ReactDom from 'react-dom'

export default function Modal(props) {
    const { children, handleCloseModal } = props
    // Takes a div and run it into the given id 
    // (here we run the container into 'portal', defined in index.html)
    return ReactDom.createPortal(
        <div className='modal-container'>
            <button onClick={handleCloseModal} className='modal-underlay' />
            <div className='modal-content'>
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    )
}