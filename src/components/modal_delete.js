import React from 'react';

import '../styles/modal_delete.css';

function MODAL_DELETE_STEP(props) {
    return (
        <div className="modal_delete" ref={props.refer_modal_delete}>
            <div className="modal_content">
                <p>Deletar {props.why_delete}</p>
                <form>
                    <div className="buttons">
                        <button className="button_cancel_delete" onClick={props.close_modal}>Cancelar</button>
                        <button className="button_delete" onClick={props.delete_obj}>Deletar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MODAL_DELETE_STEP;