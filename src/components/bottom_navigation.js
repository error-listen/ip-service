import React from 'react';

import { Link } from 'react-router-dom';

import '../styles/bottom_navigation.css';

function BOTTOM_NAVIGATION() {
    return (
        <div className="bottom_navigation">
            <Link to="/">
                <img src="https://img.icons8.com/fluent-systems-filled/48/000000/home.png" />
            </Link>
            <Link to="/calendar">
                <img src="https://img.icons8.com/material-rounded/48/000000/calendar--v1.png" />
            </Link>
        </div>
    );
}

export default BOTTOM_NAVIGATION;