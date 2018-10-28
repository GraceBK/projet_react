import React, { Component } from 'react';
import Input from "./Input";
import Button from "./Button";

class FormAdd extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            newResto: {
                nameResto: '',
                cuisineType: ''
            }
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    getValidationState() {
        const length = this.state.nameResto.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleClearForm(event) {
        // Logique pour reset le form
        event.preventDefault();
        this.setState({
            newResto: {
                nameResto: '',
                cuisineType: ''
            }
        })
    }

    handleFormSubmit(event) {
        // Logique pour soumettre le form
        event.preventDefault();
        let form = this.state.newResto;

        fetch('http://localhost:8080/api/restaurants/', {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(responseJSON => {
                responseJSON.json().then(data => {
                    console.log("Successful " + data);
                })
            })
            .catch(err => {
                console.log("Erreur dans le POST : " + err);
            });
    }

    handleChange(event) {
        this.setState({ nameResto: event.target.value });
    }

    render() {
        return (
            <form id="formulaireInsertionform"
                  onSubmit={this.handleFormSubmit}>
                <Input
                    type={'text'}
                    name={'Nom'}
                    value={this.state.newResto.nameResto}
                    placeholder={'Nom du resto'}
                />
                <Input
                    type={'text'}
                    name={'Cuisine'}
                    value={this.state.newResto.cuisineType}
                    placeholder={'Type de cuisine'}
                />
                <Button

                />
                <button className="btn btn-dark" type="submit">Créer restaurant</button>
            </form>
        );
    }
}
export default FormAdd;