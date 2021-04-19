import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/messaging';

import SignatureCanvas from 'react-signature-canvas';

import MODAL_LOADING from '../components/modal_loading';

import api from '../services/api';

import '../styles/finish_step.css';

const url = 'https://api.cloudinary.com/v1_1/dmdrppew7/image/upload';

const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    toast.dark(`${payload.data.technician.toUpperCase()} finalizou etapa ${payload.data.step_name.toUpperCase()} do serviço ${payload.data.service_name.toUpperCase()} do cliente ${payload.data.client_name.toUpperCase()}`, {
        position: "top-center",
        autoClose: false
    });
});

function FINISH_STEP({ match, history }) {

    const [tasks_list, set_tasks_list] = useState({});
    const [step, set_step] = useState({})
    const [files_name, set_files_name] = useState([]);
    const [file_id, set_file_id] = useState(0);
    const [annotations, set_annotations] = useState('');
    const [files_upload, set_files_upload] = useState([]);
    const [technician, set_technician] = useState('')
    const [signature, set_signature] = useState('');
    const [loading, set_loading] = useState(false);

    const input_file_ref = useRef(null);
    const sig_canvas = useRef(null);

    useEffect(() => {
        let mounted = true

        async function get_tasks_list() {
            if (mounted) {

                set_loading(true);

                const response = await api.get(`/task_list/${match.params.list_tasks_id}`);

                const found_index = response.data.list_task.steps.findIndex(step => step.id === match.params.step_id);

                if (response.data.list_task.steps[found_index].done) {
                    history.push(`/list_tasks/${match.params.list_tasks_id}`);
                }

                set_step(response.data.list_task.steps[found_index]);

                set_tasks_list(response.data.list_task);


                set_loading(false);
            }
        }
        
        get_tasks_list();
        
        return function cleanup() {
            mounted = false
        }
    }, [match.params.list_tasks_id, match.params.step_id, history]);

    async function handle_chose_file(e) {
        set_file_id(file_id + 1)
        set_files_name([...files_name, { id: file_id + 1, file_name: e.target.value.replace(/^.*[\\]/, '') }]);
        set_files_upload([...files_upload, { id: file_id + 1, file: input_file_ref.current.files[0] }]);
    }

    function delete_file_name(id) {
        set_files_name(
            files_name.filter(file => {
                return file.id !== id;
            })
        );
        set_files_upload(
            files_upload.filter(file => {
                return file.id !== id;
            })
        );
    }

    async function finish_step(e) {
        set_loading(true);

        e.preventDefault();

        const formData = new FormData();

        const images = [];

        for (let i = 0; i < files_upload.length; i++) {
            let file = files_upload[i].file;
            formData.append("file", file);
            formData.append("upload_preset", "zmrjkds2");

            const response = await axios.post(url, formData)

            images.push(response.data.secure_url)
        }

        await api.put(`/step/done/${tasks_list._id}`, {
            step_id: step.id,
            service_name: tasks_list.service_name,
            client_name: tasks_list.client_name,
            step_name: step.step_name,
            annotations,
            files: images,
            technician,
            signature
        });

        set_loading(false);

        history.push(`/list_tasks/${tasks_list._id}`);

    }

    const handle_end = () => {
        const data_URL = sig_canvas.current._canvas.toDataURL();
        set_signature(data_URL);
    }

    function is_loading() {
        if (loading) {
            return (
                <MODAL_LOADING />
            )
        } else {
            return null;
        }
    }

    return (
        <div className="finish_step">
            {is_loading()}
            <ToastContainer />
            <h2>Finalizar etapa</h2>
            <p>{step.step_name}</p>
            <form>
                <div className="row">
                    <label>Anotações</label>
                    <textarea onChange={(e) => set_annotations(e.target.value)} value={annotations} />
                </div>
                <div className="files">
                    <label htmlFor="arquivo">Adicionar anexo</label>
                    <input type="file" name="arquivo" id="arquivo" ref={input_file_ref} accept="image/x-png,image/gif,image/jpeg" onChange={(e) => handle_chose_file(e)} />
                </div>
                {files_name.map(file => {
                    return (
                        <div className="file_container" key={file.id}>
                            <p className="file_name">{file.file_name}</p>
                            <span onClick={() => delete_file_name(file.id)}>x</span>
                        </div>
                    )
                })}
                <div className="row">
                    <label>Técnico</label>
                    <input type="text" onChange={(e) => set_technician(e.target.value)} value={technician} />
                </div>
                <p className="signature_text">Assinatura do cliente</p>
                <SignatureCanvas penColor="#000" backgroundColor="#F8F8FF" ref={sig_canvas} onEnd={handle_end}
                    canvasProps={{ width: 320, height: 300, className: 'sig_canvas' }} />
                <div className="button_center">
                    <button className="button_clear_signature" onClick={(e) => { e.preventDefault(); sig_canvas.current.clear() }}>Limpar assinatura</button>
                </div>
                <div className="buttons">
                    <button className="button_cancel_finish_step" onClick={() => history.push(`/list_tasks/${tasks_list._id}`)}>Cancelar</button>
                    <button className="button_finish_step" onClick={(e) => finish_step(e)}>Finalizar</button>
                </div>
            </form>
        </div>
    );
}

export default FINISH_STEP;