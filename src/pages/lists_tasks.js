import React, { useRef, useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging"

import { Link } from 'react-router-dom';

import MODAL_ADD_LIST from '../components/modal_add_list';
import MODAL_DELETE from '../components/modal_delete';
import MODAL_LOADING from '../components/modal_loading';

import LONG_PRESS from '../components/long_press';

import api from '../services/api';

import '../styles/lists_tasks.css';

const firebaseConfig = {
    apiKey: 'AIzaSyAlDtvO48-uf1gvQQZuxR73Ok2W21EjfTg',
    authDomain: 'ip-service-b26fa.firebaseapp.com',
    projectId: 'ip-service-b26fa',
    storageBucket: 'ip-service-b26fa.appspot.com',
    messagingSenderId: '18150881262',
    appId: '1:18150881262:web:48e709dd5a51023d9440ff',
    measurementId: 'G-L643WZGJGB'
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();
messaging.getToken({ vapidKey: 'BAMuyI4ysE5mCFNr0RWAfqOoK5jP8FyaqOcW3VqMJ0wnJX1KKW-qo9xYj6uCIGuS7iF2FHko_PuB7DEZ9Xrai6Q' }).then(async (currentToken) => {
    if (currentToken) {
        await api.post('token', {
            token: currentToken
        });
    } else {
        console.log('No registration token available. Request permission to generate one.');
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
});

messaging.onMessage((payload) => {
    toast.dark(`${payload.data.technician.toUpperCase()} finalizou etapa ${payload.data.step_name.toUpperCase()} do serviço ${payload.data.service_name.toUpperCase()} do cliente ${payload.data.client_name.toUpperCase()}`, {
        position: "top-center",
        autoClose: false
    });
});

function LISTS_TASKS() {

    const [tasks_lists, set_tasks_lists] = useState([]);
    const [client_name, set_client_name] = useState('');
    const [service_name, set_service_name] = useState('');
    const [place, set_place] = useState('');
    const [selected_list, set_selected_list] = useState('');
    const [loading, set_loading] = useState(false);

    const modal_add_list_ref = useRef(null);
    const modal_delete_ref = useRef(null);

    useEffect(() => {
        async function get_tasks_lists() {

            set_loading(true);

            const response = await api.get('/task_list');

            set_tasks_lists(response.data.lists_tasks);

            set_loading(false);
        }

        get_tasks_lists();
    }, []);

    function open_modal(modal) {
        modal.current.style.display = 'block';
    }

    function handle_close_modal(modal, e) {
        e.preventDefault();
        modal.current.style.display = 'none';
        set_client_name('');
        set_service_name('');
        set_place('');
    }

    async function add_tasks_list(e) {
        set_loading(true);

        e.preventDefault();

        const response = await api.post('/task_list', {
            client_name,
            service_name,
            place
        });

        set_tasks_lists([...tasks_lists, response.data.create_list_task]);

        set_loading(false);
    }

    async function delete_tasks_list(e) {
        set_loading(true);

        e.preventDefault();

        const response = await api.delete(`/task_list/${selected_list}`);

        set_tasks_lists(tasks_lists.filter(tasks_list => {
            return tasks_list._id !== response.data.list_task._id;
        }));

        set_loading(false);
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
        <div className="lists_tasks_container">
            {is_loading()}
            <ToastContainer />
            <MODAL_ADD_LIST
                refer_modal_add_list={modal_add_list_ref}
                client_name_input={e => set_client_name(e.target.value)}
                service_name_input={e => set_service_name(e.target.value)}
                place_input={e => set_place(e.target.value)}
                client_name_value={client_name}
                service_name_value={service_name}
                place_value={place.toLocaleUpperCase()}
                add_list={(e) => { add_tasks_list(e); handle_close_modal(modal_add_list_ref, e) }}
                close_modal={(e) => handle_close_modal(modal_add_list_ref, e)}
            />
            <MODAL_DELETE
                refer_modal_delete={modal_delete_ref}
                why_delete={'lista'}
                delete_obj={(e) => { delete_tasks_list(e); handle_close_modal(modal_delete_ref, e) }}
                close_modal={(e) => handle_close_modal(modal_delete_ref, e)}
            />
            <header>
                <h2>Listas de Tarefas</h2>
                <button className="button_add_list" onClick={() => open_modal(modal_add_list_ref)}>+</button>
                <p className="add_list_text">Adicionar Lista</p>
            </header>
            <main>
                {tasks_lists.length > 0 ?
                    <div className="lists">
                        {tasks_lists.map(tasks_list => {
                            return (
                                <LONG_PRESS
                                    key={tasks_list._id}
                                    time={1000}
                                    onLongPress={() => { open_modal(modal_delete_ref); set_selected_list(tasks_list._id); }}
                                >
                                    <Link className="list" to={`/list_tasks/${tasks_list._id}`} style={{ backgroundColor: tasks_list.color }}>
                                        <div className="list_header">
                                            <h4>{tasks_list.service_name}</h4>
                                            <h5>{tasks_list.client_name}</h5>
                                            <hr />
                                        </div>
                                        <div className="tasks">
                                            {tasks_list.steps.slice(0, 5).map(step => {
                                                return (
                                                    <div className="task" key={step.id}>
                                                        {step.done ? <div className="checkbox done"></div> : <div className="checkbox"></div>}
                                                        {step.done ? <hr style={{ position: 'absolute', width: 130, left: 10, border: 'none', borderBottom: '1px solid #FFF' }} /> : null}
                                                        <p className="task_name">{step.step_name}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Link>
                                </LONG_PRESS>
                            );
                        })}
                    </div>
                    :
                    <div className="no_lists">
                        <h3>Nenhuma lista</h3>
                        <p>Toque no botão para criar uma lista</p>
                    </div>}
            </main>
        </div>
    )
}

export default LISTS_TASKS;