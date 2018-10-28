import React, { Component } from 'react';

function Button(props) {
    return (
        <button
            className="btn btn-dark"
            onClick={props.action}>
            {props.title}
        </button>
    );
}

export default Button;