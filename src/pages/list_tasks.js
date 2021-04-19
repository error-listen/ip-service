import React, { useRef, useEffect, useState } from 'react';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import SwipeableViews from 'react-swipeable-views';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging"

import { PDFDownloadLink } from '@react-pdf/renderer';

import MyDocument from '../components/pdf_generate';

import MODAL_ADD_STEP from '../components/modal_add_step';
import MODAL_DELETE from '../components/modal_delete';
import MODAL_LIST_INFO from '../components/modal_list_info';
import MODAL_LOADING from '../components/modal_loading';

import LONG_PRESS from '../components/long_press';

import api from '../services/api';

import 'react-circular-progressbar/dist/styles.css';
import '../styles/list_tasks.css';

const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    toast.dark(`${payload.data.technician.toUpperCase()} finalizou etapa ${payload.data.step_name.toUpperCase()} do serviço ${payload.data.service_name.toUpperCase()} do cliente ${payload.data.client_name.toUpperCase()}`, {
        position: "top-center",
        autoClose: false
    });
});

function LIST_TASKS({ history, match }) {

    const [tasks_lists, set_tasks_lists] = useState([]);
    const [first_list, set_first_list] = useState(0);
    const [current_list, set_current_list] = useState(0);
    const [step_name, set_step_name] = useState('');
    const [first_list_obj, set_first_list_obj] = useState({});
    const [selected_step, set_selected_step] = useState();
    const [loading, set_loading] = useState(false);

    const modal_add_step_ref = useRef(null);
    const modal_list_info = useRef(null);
    const modal_delete_ref = useRef(null);

    useEffect(() => {
        let mounted = true
        async function get_tasks_lists() {
            if (mounted) {

                set_loading(true);

                const response = await api.get('/task_list');

                set_loading(false);

                const found_index = response.data.lists_tasks.findIndex(tasks_list => tasks_list._id === match.params.list_tasks_id);

                if (found_index === -1) {
                    history.push('/');
                }

                set_first_list(found_index);
                set_first_list_obj(response.data.lists_tasks[found_index]);
                set_tasks_lists(response.data.lists_tasks);
            }
        }

        get_tasks_lists();

        return function cleanup() {
            mounted = false
        }
    }, [match.params.list_tasks_id, history]);

    function current(e) {
        set_current_list(tasks_lists[e] !== undefined ? tasks_lists[e] : 0);
    }

    async function handle_add_step(e) {

        set_loading(true);

        e.preventDefault();

        const current_id = current_list._id === undefined ? first_list_obj._id : current_list._id;

        const new_array = [...tasks_lists];
        const found_index = tasks_lists.findIndex(tasks_list => tasks_list._id === current_id);

        const response = await api.post(`/step/add/${current_list._id === undefined ? first_list_obj._id : current_list._id}`, {
            step_name
        });

        new_array[found_index] = response.data.list_task;

        set_tasks_lists(new_array);

        set_loading(false);

    }

    async function delete_step(e) {

        set_loading(true);

        e.preventDefault();

        const response = await api.put(`/step/delete/${current_list._id === undefined ? first_list_obj._id : current_list._id}`, {
            step_id: selected_step
        });

        set_tasks_lists(tasks_lists.map(tasks_list => {
            return tasks_list._id === response.data.list_task._id ? response.data.list_task : tasks_list
        }));

        set_loading(false);
    }

    function open_modal(modal) {
        modal.current.style.display = 'block';
    }

    function handle_close_modal(modal, e) {
        e.preventDefault();
        set_step_name('')
        modal.current.style.display = 'none';
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
        <div className="list_tasks_container">
            <span style={{ position: 'absolute', top: 25, right: 28, fontSize: 25 }} onClick={() => open_modal(modal_list_info)}><img src="https://img.icons8.com/cotton/34/000000/info--v1.png" /></span>
            <span style={{ position: 'absolute', top: 25, left: 28, fontSize: 25 }} onClick={() => history.push('/')}><img src="https://img.icons8.com/android/24/000000/back.png" alt="Back" /></span>
            {is_loading()}
            <ToastContainer />
            <MODAL_LIST_INFO close={(e) => handle_close_modal(modal_list_info, e)} refer_modal_list_info={modal_list_info}
                color={current_list.color !== undefined ? current_list.color : first_list_obj.color}
                service_name={current_list.service_name !== undefined ? current_list.service_name : first_list_obj.service_name}
                client_name={current_list.client_name !== undefined ? current_list.client_name : first_list_obj.client_name}
                place={current_list.place !== undefined ? current_list.place : first_list_obj.place} />
            <MODAL_ADD_STEP
                refer_modal_add_step={modal_add_step_ref}
                step_name_input={e => set_step_name(e.target.value)}
                step_name_value={step_name}
                add_step={(e) => { handle_add_step(e); handle_close_modal(modal_add_step_ref, e); }}
                close_modal={(e) => handle_close_modal(modal_add_step_ref, e)}
            />
            <MODAL_DELETE
                refer_modal_delete={modal_delete_ref}
                why_delete={'etapa'}
                delete_obj={(e) => { delete_step(e); handle_close_modal(modal_delete_ref, e) }}
                close_modal={(e) => handle_close_modal(modal_delete_ref, e)}
            />
            <SwipeableViews enableMouseEvents index={first_list} onSwitching={(e) => current(e)}>
                {tasks_lists.map(task_lists => {
                    return (
                        <main key={task_lists._id}>
                            <div className="main_header">
                                <div className="border_progress_bar">
                                    <CircularProgressbar value={task_lists.steps.length > 0 ? (task_lists.steps.filter(step => step.done).length / task_lists.steps.length) * 100 : 0} strokeWidth={10}
                                        styles={buildStyles({
                                            pathColor: `${task_lists.color}`,
                                        })} />
                                </div>
                                <div className="name_service_and_client">
                                    <h2>{task_lists.service_name}</h2>
                                    <p className="client_name">{task_lists.client_name}</p>
                                    <hr />
                                </div>
                            </div>
                            {task_lists.steps.length > 0 ?
                                <div className="tasks">
                                    {task_lists.steps.map(step => {
                                        if (step.done) {
                                            return (
                                                <LONG_PRESS
                                                    key={step.id}
                                                    time={1000}
                                                    onLongPress={() => { open_modal(modal_delete_ref); set_selected_step(step.id); }}
                                                >
                                                    <div>
                                                        <PDFDownloadLink
                                                            document={<MyDocument data={`${step.done_time}`} annotations={`${step.annotations}`} step_name={`${step.step_name}`} technician={`${step.technician}`} files={step.files} signature={step.signature} />}
                                                            fileName={`${step.step_name} - ${task_lists.service_name} - ${task_lists.client_name}.pdf`}>
                                                            <div className="task" key={step.id} >
                                                                {step.done ? <div className="checkbox done"></div> : <div className="checkbox"></div>}
                                                                {step.done ? <hr style={{ position: 'absolute', width: 300, marginTop: 10, right: 30, border: 'none', borderBottom: `1px solid ${task_lists.color}` }} /> : null}
                                                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                                                    <p className="task_name" style={{ color: step.done ? task_lists.color : '#000' }}>{step.step_name}</p>
                                                                    <p style={{ color: 'grey', fontSize: 13 }}>{step.done_time}</p>
                                                                </div>
                                                            </div>
                                                        </PDFDownloadLink>
                                                    </div>
                                                </LONG_PRESS>
                                            )
                                        } else {
                                            return (
                                                <LONG_PRESS
                                                    key={step.id}
                                                    time={1000}
                                                    onLongPress={() => { open_modal(modal_delete_ref); set_selected_step(step.id); }}
                                                    onPress={() => history.push(`/finish_step/${task_lists._id}/${step.id}`)}
                                                >
                                                    <div className="task" key={step.id} >
                                                        <div className="checkbox"></div>
                                                        <p className="task_name" style={{ color: step.done ? task_lists.color : '#000' }}>{step.step_name}</p>
                                                    </div>
                                                </LONG_PRESS>
                                            );
                                        }
                                    })}
                                </div>
                                :
                                <div className="no_tasks">
                                    {loading ? null :
                                        <div>
                                            <h3>Nenhuma tarefa</h3>
                                            <p>Toque no botão para criar uma tarefa</p>
                                        </div>
                                    }
                                </div>}
                        </main>
                    );
                })}
            </SwipeableViews>
            {first_list_obj !== undefined ? <button className="open_modal_add_step" onClick={() => open_modal(modal_add_step_ref)} style={{ backgroundColor: current_list.color !== undefined ? current_list.color : first_list_obj.color }}>+</button> : null}
        </div>
    );
}

export default LIST_TASKS;