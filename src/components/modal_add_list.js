import React from 'react';

import '../styles/modal_add_list.css';

function MODAL_ADD_LIST(props) {
    return (
        <div className="modal_add_list" ref={props.refer_modal_add_list}>
            <div className="modal_content">
                <p>Adicionar lista</p>
                <form>
                    <input type="text" placeholder="Cliente" onChange={props.client_name_input} value={props.client_name_value} />
                    <input type="text" placeholder="Serviço" onChange={props.service_name_input} value={props.service_name_value}/>
                    <input type="text" placeholder="Local"  onChange={props.place_input} value={props.place_value}/>
                    <div className="buttons">
                        <button className="button_cancel_add" onClick={props.close_modal}>Cancelar</button>
                        <button className="button_add_list" onClick={props.add_list}>Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MODAL_ADD_LIST;