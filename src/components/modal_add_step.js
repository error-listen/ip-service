import React from 'react';

import '../styles/modal_add_step.css';

function MODAL_ADD_STEP(props) {
    return (
        <div className="modal_add_step" ref={props.refer_modal_add_step}>
            <div className="modal_content">
                <p>Adicionar etapa</p>
                <form>
                    <input type="text" placeholder="Etapa" onChange={props.step_name_input} value={props.step_name_value}/>
                    <div className="buttons">
                        <button className="button_cancel_add" onClick={props.close_modal}>Cancelar</button>
                        <button className="button_add_step" onClick={props.add_step}>Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MODAL_ADD_STEP;