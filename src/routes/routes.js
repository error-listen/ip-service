import { BrowserRouter as Router, Route } from 'react-router-dom';

import LISTS_TASKS from '../pages/lists_tasks';
import LIST_TASKS from '../pages/list_tasks';
import FINISH_STEP from '../pages/finish_step';
import CALENDAR from '../pages/calendar';

function ROUTES() {

    return (
        <Router>
            <Route exact path="/" component={LISTS_TASKS} />
            <Route path="/list_tasks/:list_tasks_id" component={LIST_TASKS} />
            <Route path="/finish_step/:list_tasks_id/:step_id" component={FINISH_STEP} />
            <Route path="/calendar" component={CALENDAR} />
        </Router>
    )
}

export default ROUTES