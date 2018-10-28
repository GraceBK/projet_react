/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import _ from 'lodash';

//import logo from './logo.svg';
import './App.css';

import Resto from './components/Resto';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            add: false,
            update: false,
            showSuccess: false,
            message: '',
            postRestaurant: {
                nom: null,
                cuisine: null
            },
            putRestaurant: {
                id: '',
                nom: '',
                cuisine: ''
            },
            id: '',
            nameResto: '',
            cuisineType: '',
            currentPage: 1,
            totalPage: 0,
            nbRestoPerPage: 5,
            query: '',
            restoList: [],
            restoFound: []
        };

        this.handleChangeSelectTag = this.handleChangeSelectTag.bind(this);
        this.postResto = this.postResto.bind(this);
        this.handleUpdateResto = this.handleUpdateResto.bind(this);
    }

    onClickAdd() {
        let add_ = this.state.add;
        this.setState({
            add: !add_,
            update: false
        });
    }

    onClickUpdate(resource) {
        this.state.putRestaurant.id = resource.id;
        this.state.putRestaurant.nom = resource.name;
        this.state.putRestaurant.cuisine = resource.cuisine;
        this.setState({
            update: true,
            add: false
        });
    }

    handleChangeSelectTag(event) {
        console.log("Resto per page : "+event.target.value);
        this.setState({ nbRestoPerPage: event.target.value });
        //this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
        this.getDataFromServerParam(this.state.currentPage, event.target.value);
    }

    handleChangeSearch(event) {
        const query = event.target.value;
        this.setState({
            query
        }, () => {
            if (!this.state.query.length) {
                //console.log("=======>  "+query);
                this.setState(prevState => ({
                    restoList: prevState.restoList,
                    totalPage: Math.ceil(prevState.totalPage / prevState.nbRestoPerPage)
                }));
            } else {
                //console.log("+++++++> "+query);
                this.searchRestaurants();
            }
        });
    }

    searchRestaurants = _.debounce (
        function () {
            fetch('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.nbRestoPerPage + "&name=" + this.state.query)
                .then(response => {
                    response.json().then(res => {
                        this.setState(prevState => ({
                            restoList: res.data,
                            totalPage: res.count ? Math.ceil(res.count / prevState.nbRestoPerPage) : prevState.totalPage
                        }));
                        //console.log(res.data.length+" ***********> "+JSON.stringify(res.data));
                    })
                })
                .catch(err => {
                    console.log("Erreur dans le get : " + err)
                });
        }, 300
    );

    searchResto(restoName) {
        console.log("--- SEARCH DATA ---");
        fetch('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.nbRestoPerPage + "&name=" + restoName)
            .then(response => {
                response.json().then(res => {

                });   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                data.data.forEach((el) => {
                    newResto.push({"name" : el.name, "cuisine": el.cuisine});
                });
                this.setState({
                    restoList: newResto,
                    totalPage: data.count
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }

    updateFormId(event) {
        console.log("CUISINE "+event.target.value);
        this.state.putRestaurant.id = event.target.value;
    }

    updateFormCuisine(event) {
        console.log("CUISINE "+event.target.value);
        this.setState({
            cuisineType: event.target.value
        })
    }

    updateFormCuisine_ = (event) => {
        console.log("CUISINE "+event.target.value);
        const cuisine = event.target.value;
        this.setState(prevState => ({
            putRestaurant: {
                ...prevState.putRestaurant,
                cuisine
            }
        }));
    }

    updateFormName(event) {
        console.log("NAME "+event.target.value);
        this.setState({
            nameResto: event.target.value
        })
    }

    updateFormName_ = (event) => {
        console.log("NAME "+event.target.value);
        const nom = event.target.value;
        this.setState(prevState => ({
            putRestaurant: {
                ...prevState.putRestaurant,
                nom
            }
        }));
    }

    postResto(event) {
        event.preventDefault();
        if (!this.state.nameResto || !this.state.cuisineType) {
            console.log("Vide");
            return;
        }
        let form = {
            nom: this.state.nameResto,
            cuisine: this.state.cuisineType
        };

        console.log("Successful "/* + this.state.nameResto + " -- " + this.state.cuisineType + " ** "*/ + JSON.stringify(form));
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
                    console.log("Successful " + JSON.stringify(data));
                });
            })
            .catch(err => {
                console.log("Erreur dans le POST : " + err);
            });
        this.setState({
            nameResto: '',
            cuisineType: '',
            add: false,
            message: 'Ce restaurant a été ajouté',
            showSuccess: true
        });
        this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
        setTimeout(
            function () {
                this.setState({
                    showSuccess: false
                });
            }.bind(this), 3000
        );
    }

    handleUpdateResto(event) {
        event.preventDefault();
        if (!this.state.putRestaurant.nom || !this.state.putRestaurant.cuisine) {
            console.log("Vide");
            return;
        }
        let form = new FormData(document.getElementById('formulaireModificationform'));

        console.log("Successful "/* + this.state.nameResto + " -- " + this.state.cuisineType + " ** "*/ + form);
        fetch('http://localhost:8080/api/restaurants/' + this.state.putRestaurant.id, {
            method: "PUT",
            body: form
        })
            .then(responseJSON => {
                console.log("azertyu")
                this.setState({
                    message: 'Ce restaurant a été modifié',
                    showSuccess: true,
                    update: false
                });
                setTimeout(function () {
                    this.setState({
                        showSuccess: false
                    });
                }.bind(this), 3000);
                this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
                /*responseJSON.json().then(data => {
                    console.log("Successful " + JSON.stringify(data));
                });*/
            })
            .catch(err => {
                console.log("Erreur dans le POST : " + err);
            });
    }

    deleteResto(id) {
        console.log("DELETE");
        fetch('http://localhost:8080/api/restaurants/'+id, { method: "DELETE" })
            .then(responseJSON => {
                this.setState({
                    message: 'Ce restaurant a été supprimé',
                    showSuccess: true
                });
                setTimeout(function () {
                    this.setState({
                        showSuccess: false
                    });
                }.bind(this), 3000);
                /*responseJSON.json().then(data => {
                    console.log("Successful " + JSON.stringify(data));
                });*/
                this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
            })
            .catch(err => {
                console.log("Erreur dans le DELETE : " + err);
            });
        /*this.setState({
            message: 'Ce restaurant a été supprimé',
            showSuccess: true
        });*/
        /*this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);*/
        /*setTimeout(
            function () {
                this.setState({
                    showSuccess: false
                });
            }.bind(this), 3000
        );*/
    }

    getDataFromServerParam(numPage, nbPerPage) {
        console.log("--- GETTING DATA ---");
        fetch('http://localhost:8080/api/restaurants?page=' + numPage + '&pagesize=' + nbPerPage)
            .then(response => {
                return response.json();   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                data.data.forEach((el) => {
                    newResto.push({"id" : el._id, "name" : el.name, "cuisine": el.cuisine});
                });
                this.setState({
                    restoList: newResto,
                    totalPage: data.count,
                    currentPage: numPage,
                    nbRestoPerPage: nbPerPage
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }

    paginationEvent(element) {
        let cnumber = parseInt(element.target.innerHTML) - 1;
        /*this.setState({
            currentPage: cnumber
        });*/
        this.state.currentPage = cnumber;

        this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);

        if (element.target.id === 'thirdButton' || element.target.id === 'firstButton') {
            if (this.state.currentPage === 0 || this.state.currentPage === Math.ceil(this.state.totalPage / this.state.nbRestoPerPage)) {
                console.log("EXIST");
                return;
            }
            console.log("changing");
            document.querySelector('#firstButton').innerHTML = cnumber;
            document.querySelector('#secondButton').innerHTML = cnumber + 1;
            document.querySelector('#thirdButton').innerHTML = cnumber + 2;
        }
    }

    componentDidMount() {
        console.log("Component will mount");
        // this runs right before the <App> is rendered
        // on va chercher des donnees sur le Web avec fetch, comme on a fait avec VueJS
        this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
    }

    render() {
        console.log("RENDER");
        let listAvecComponent = this.state.restoList.map((el, index) => {
            //console.log("------------------ "+el.id);
            return <Resto
                id={el.id}
                name={el.name}
                cuisine={el.cuisine}
                key={index}
                updateResto={this.onClickUpdate.bind(this, el)}
                removeResto={this.deleteResto.bind(this)}
            />
        });

        return (
            <div> {/*className="App"*/}
                {/*
                <nav className="navbar navbar-light bg-light">
                  <img src={logo} width="70" height="70" alt=""/>
              </nav>
                */}
              <div className="container">
                  <br/>
                  <h2>Table des restaurants</h2>
                  <button type="button" className="btn btn-dark mb-3" onClick={this.onClickAdd.bind(this)}><i className="fa fa-plus"></i></button>

                  <div className={this.state.showSuccess ? 'alert alert-success' : 'd-none'} role="alert">
                      <h6 className="alert-heading">Opération réussie</h6>
                      <p>{this.state.message}</p>
                  </div>

                  <div className="row">
                      <div className={this.state.add || this.state.update ? 'col-lg-8' : 'col-lg'}>
                          <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                  <label className="input-group-text" htmlFor="elementPageDropDown">Elements par page</label>
                              </div>
                              <select className="custom-select" id="elementPageDropDown" value={this.state.nbRestoPerPage}
                                      onChange={this.handleChangeSelectTag}>
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="15">15</option>
                              </select>
                          </div>
                          <div className="input-group mb-3">
                              <input
                                  type="text"
                                  value={this.state.query}
                                  onChange={this.handleChangeSearch.bind(this)}
                                  className="form-control" placeholder="Chercher par nom"/>
                          </div>
                          Nombre de Resto : {this.state.restoList.length} | Page {this.state.currentPage} / {Math.ceil(this.state.totalPage / this.state.nbRestoPerPage)}
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
                              </tbody>
                          </table>
                          <br/>
                          <div className="navigation">
                              <div className="btn-toolbar">
                                  <div className="btn-group mr-2">
                                      <button type="button" className="btn btn-dark" id="firstButton" onClick={this.paginationEvent.bind(this)}>1</button>
                                      <button type="button" className="btn btn-dark" id="secondButton" onClick={this.paginationEvent.bind(this)}>2</button>
                                      <button type="button" className="btn btn-dark" id="thirdButton" onClick={this.paginationEvent.bind(this)}>3</button>
                                      <button className="btn btn-light">...</button>
                                      <button type="button" className="btn btn-dark" id="lastPageButton" onClick={this.paginationEvent.bind(this)}>{Math.ceil(this.state.totalPage / this.state.nbRestoPerPage)}</button>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Formulaire de modification */}
                      <div className={this.state.update ? 'col-lg-4' : 'd-none'} id="formulaireInsertion">
                          <div className="card">
                              <div className="card-body">
                                  <form id="formulaireModificationform">
                                      {/*value={this.state.inputAddCuisine}*/}
                                      <div className="form-group">
                                          <label htmlFor="idInput">Id :</label>
                                          <input className="form-control" id="idInput" type="text" name="_id"
                                                 value={this.state.putRestaurant.id} onChange={this.updateFormId.bind(this)} placeholder="Id du restaurant à modifier" readOnly={true}/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="restaurantInput">Nom</label>
                                          <input className="form-control" id="restaurantInput" type="text" name="nom"
                                                 required value={this.state.putRestaurant.nom} onChange={this.updateFormName_} placeholder="Michel's restaurant"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="cuisineInput">Cuisine</label>
                                          <input className="form-control" id="cuisineInput" type="text" name="cuisine"
                                                 required value={this.state.putRestaurant.cuisine} onChange={this.updateFormCuisine_} placeholder="Michel's cuisine"/>
                                      </div>
                                      <button className="btn btn-dark" onClick={this.handleUpdateResto.bind(this)}>Modifier ce restaurant</button>
                                  </form>
                              </div>
                          </div>
                      </div>


                      {/* Formulaire d'ajout */}
                      <div className={this.state.add ? 'col-lg-4' : 'd-none'} id="formulaireInsertion">
                          <div className="card">
                              <div className="card-body">
                                  <form id="formulaireInsertionform" onSubmit={this.postResto}>
                                      <div className="form-group">
                                          <label htmlFor="restaurantInput">Nom</label>{/*ref={(inputNameResto) => this.state.newResto.nameResto = inputNameResto} */}
                                          <input className="form-control" id="restaurantInputI" type="text"
                                                 required value={this.state.nameResto} onChange={this.updateFormName.bind(this)} placeholder="Michel's restaurant"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="cuisineInput">Cuisine</label>{/*ref={(inputCuisineType) => this.state.newResto.cuisineType = inputCuisineType}*/}
                                          <input className="form-control" id="cuisineInputI" type="text"
                                                 required value={this.state.cuisineType} onChange={this.updateFormCuisine.bind(this)} placeholder="Michel's cuisine"/>
                                      </div>
                                      <button className="btn btn-dark" type="submit">Créer restaurant</button>
                                  </form>
                              </div>
                          </div>
                      </div>


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
