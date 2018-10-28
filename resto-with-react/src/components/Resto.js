import React, { } from 'react';

function Resto(props) {

    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.cuisine}</td>
            <td>
                <div className="btn-toolbar">
                    <div className="btn-group mr-2">
                        <button className="btn btn-dark" onClick={() => props.updateResto(props.id, props.name, props.cuisine)}><i className="fa fa-edit"></i></button>
                    </div>
                    <div className="btn-group mr-2">
                        <button className="btn btn-dark" onClick={() => props.removeResto(props.id)}><i className="fa fa-trash"></i></button>
                    </div>
                </div>
            </td>
        </tr>
    );

}

export default Resto;