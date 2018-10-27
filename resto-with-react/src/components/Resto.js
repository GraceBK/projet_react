import React, { Component } from 'react';

function Resto(props) {

    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.cuisine}</td>
            <td>
                <button className="btn btn-dark"><i className="fa fa-edit"></i></button>
                <button className="btn btn-dark" onClick={() => props.removeResto(props.id)}><i className="fa fa-trash"></i></button>
            </td>
        </tr>
    );

}

export default Resto;