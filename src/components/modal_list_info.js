import React from 'react';

import '../styles/modal_list_info.css';

function MODAL_LIST_INFO(props) {
    return (
        <div className="modal_list_info" onClick={props.close} ref={props.refer_modal_list_info}>
            <div className="modal_content">
                <h3 style={{color: props.color}}>Serviço</h3>
                <p>{props.service_name}</p>
                <h3 style={{color: props.color}}>Cliente</h3>
                <p>{props.client_name}</p>
                <h3 style={{color: props.color}}>Endereço</h3>
                <p>{props.place}</p>
            </div>
        </div>
    );
}

export default MODAL_LIST_INFO;