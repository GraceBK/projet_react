import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Resto from './components/Resto';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resto: [],
        }
    }

    getDataFromServer() {
        console.log("--- GETTING DATA ---");
        fetch('http://localhost:8080/api/restaurants')
            .then(response => {
                return response.json();   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                //let obj = {};
                //console.log("-----> "+JSON.stringify(data, null, 2));
                data.data.forEach((el) => {
                    //obj["name"] = el.name;
                    //obj["cuisine"] = el.cuisine;
                    newResto.push({"name" : el.name, "cuisine": el.cuisine});
                    //newResto.push(el.name);
                });

                this.setState({
                    resto: newResto
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }

    componentDidMount() {
        console.log("Component will mount");
        // this runs right before the <App> is rendered
        // on va chercher des donnees sur le Web avec fetch, comme
        // on a fait avec VueJS
        this.getDataFromServer();
    }

    render() {
        console.log("RENDER"/*+this.state.resto*/);
        let listAvecComponent = this.state.resto.map((el, index) => {
            return <Resto
                name={el.name}
                cuisine={el.cuisine}
                key={index}
            />
        });

        return (
            <div> {/*className="App"*/}
              <nav className="navbar navbar-light bg-light">
                  <img src={logo} width="70" height="70" alt=""/>
              </nav>
              <div className="container">
                  <br/>
                  {/*              <h2>Table des restaurants</h2>
                  <button type="button" className="btn btn-dark mb-3"><i className="fa fa-plus"></i></button>

                  <div className="alert alert-success" role="alert">
                      <h6 className="alert-heading">Opération réussie</h6>
                  </div>
    */}
                  <div className="row">
                      <div className="input-group mb-3">
                          <div className="input-group-prepend">
                              <label className="input-group-text" htmlFor="elementPageDropDown">Elements par page</label>
                          </div>
                          <select v-model="displayNumber" className="custom-select" id="elementPageDropDown">
                              <option value="5">5</option>
                              <option value="10">10</option>
                              <option value="15">15</option>
                          </select>
                      </div>
                      <div className="input-group mb-3">
                          <input className="form-control" placeholder="Chercher par nom"/>
                      </div>
                      Nombre de Resto : {this.state.resto.length}
                      <table className="table table-bordered">
                          <thead className="thead-dark">
                          <tr>
                              <th>Nom</th>
                              <th>Cuisine</th>
                              <th>Action</th>
                          </tr>
                          </thead>
                          <tbody>
                          {listAvecComponent}
                          {/*<tr>
                              <td>azertyuiop</td>
                              <td>azertyuiop</td>
                              <td>
                                  <button className="btn btn-dark"><i className="fa fa-edit"></i></button>
                                  <button className="btn btn-dark"><i className="fa fa-trash"></i></button>
                              </td>
                          </tr>*/}
                          </tbody>
                      </table>
                      <br/>
                      <div className="navigation">
                          <button type="button" className="btn btn-dark">1</button>
                          <button type="button" className="btn btn-dark">2</button>
                          <button type="button" className="btn btn-dark">3</button>
                          ..........
                          <button type="button" className="btn btn-dark">max</button>
                      </div>




                      {/* Formulaire de modification */}
                      {/*<div className="col-lg-4" id="formulaireInsertion">
                          <div className="card">
                              <div className="card-body">
                                  <form id="formulaireModificationform">
                                      <div className="form-group">
                                          <label htmlFor="idInput">Id :</label>
                                          <input className="form-control" id="idInput" type="text" name="_id"
                                                 placeholder="Id du restaurant à modifier" readOnly={true}/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="restaurantInput">Nom</label>
                                          <input className="form-control" id="restaurantInput" type="text" name="nom"
                                                 required placeholder="Michel's restaurant"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="cuisineInput">Cuisine</label>
                                          <input className="form-control" id="cuisineInput" type="text" name="cuisine"
                                                 required placeholder="Michel's cuisine"/>
                                      </div>
                                      <button className="btn btn-dark">Modifier ce restaurant</button>
                                  </form>
                              </div>
                          </div>
                      </div>*/}


                      {/* Formulaire d'ajout */}
                      {/*<div className="col-lg-4" id="formulaireInsertion">
                          <div className="card">
                              <div className="card-body">
                                  <form id="formulaireInsertionform">
                                      <div className="form-group">
                                          <label htmlFor="restaurantInput">Nom</label>
                                          <input className="form-control" id="restaurantInputI" type="text" name="nom"
                                                 required placeholder="Michel's restaurant"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="cuisineInput">Cuisine</label>
                                          <input className="form-control" id="cuisineInputI" type="text" name="cuisine"
                                                 required placeholder="Michel's cuisine"/>
                                      </div>
                                      <button className="btn btn-dark">Créer restaurant
                                      </button>
                                  </form>
                              </div>
                          </div>
                      </div>*/}


                  </div>
              </div>
            {/* <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
                <div className="container">
                    Coucou
                </div>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header> */}
          </div>
        );
    }
}

export default App;
