import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//import Pagination from 'react-js-pagination';
// import Pagination from './components/Pagination';
import Resto from './components/Resto';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            add: false,
            update: false,
            showSuccess: false,
            message: '',
            id: '',
            nameResto: '',
            cuisineType: '',
            currentPage: 1,
            totalPage: 0,
            nbRestoPerPage: 5,
            resto: []
        };

        this.handleChangeSelectTag = this.handleChangeSelectTag.bind(this);
        this.handleAddResto = this.handleAddResto.bind(this);
        this.handleUpdateResto = this.handleUpdateResto.bind(this);
    }

    onClickAdd() {
        let add_ = this.state.add;
        this.setState({
            add: !add_,
            update: false
        });
    }

    onClickUpdate() {
        console.log("UPDATE");
        /*let update_ = this.state.update;
        this.setState({ update: !update_ });*/
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

    searchResto(restoId) {
        console.log("--- SEARCH DATA ---");
        fetch('http://localhost:8080/api/restaurants/' + restoId)
            .then(response => {
                return response.json();   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                data.data.forEach((el) => {
                    newResto.push({"name" : el.name, "cuisine": el.cuisine});
                });
                this.setState({
                    resto: newResto,
                    totalPage: data.count
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }
    onPageChange(pageNumber) {
        console.log("PAGE n° : "+pageNumber);
        this.setState({ currentPage: pageNumber })
    }

    updateFormId(event) {
        console.log("CUISINE "+event.target.value);
        this.setState({
            id: event.target.value
        })
    }

    getId(index) {
        console.log("-%-"+this);
    }

    updateFormCuisine(event) {
        console.log("CUISINE "+event.target.value);
        this.setState({
            cuisineType: event.target.value
        })
    }

    updateFormName(event) {
        console.log("NAME "+event.target.value);
        this.setState({
            nameResto: event.target.value
        })
    }

    handleAddResto(event) {
        console.log("ADD");
        if (!this.state.nameResto || !this.state.cuisineType) {
            console.log("Vide");
            return;
        }
        event.preventDefault();
        let form = {
            name: this.state.nameResto,
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
        console.log("ADD");
        if (!this.state.nameResto || !this.state.cuisineType) {
            console.log("Vide");
            return;
        }
        event.preventDefault();
        let form = {
            name: this.state.nameResto,
            cuisine: this.state.cuisineType
        };

        console.log("Successful "/* + this.state.nameResto + " -- " + this.state.cuisineType + " ** "*/ + JSON.stringify(form));
        fetch('http://localhost:8080/api/restaurants/', {
            method: "PUT",
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
    }

    removeResto(id) {
        console.log("DELETE");
        fetch('http://localhost:8080/api/restaurants/'+id, { method: "DELETE" })
            .then((responseJSON) => {
                let oldResto = this.state.resto;
                this.setState({
                    resto: oldResto,
                    totalPage: this.state.totalPage
                });
                return responseJSON.json();
            })
            .catch(err => {
                console.log("Erreur dans le DELETE : " + err);
            });
        this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
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
                    resto: newResto,
                    totalPage: data.count,
                    currentPage: numPage,
                    nbRestoPerPage: nbPerPage
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }

    getDataFromServer3() {
        console.log("--- GETTING DATA ---");
        fetch('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.nbRestoPerPage)
            .then(response => {
                return response.json();   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                data.data.forEach((el) => {
                    newResto.push({"id" : el._id, "name" : el.name, "cuisine": el.cuisine});
                });
                this.setState({
                    resto: newResto,
                    totalPage: data.count
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
    }

    getDataFromServer2() {
        console.log("--- GETTING DATA ---");
        fetch('http://localhost:8080/api/restaurants?page=' + this.state.currentPage)
            .then(response => {
                return response.json();   // transforme le json texte en objet js
            })
            .then(data => {   // data c'est le texte json de response ci-dessus
                let newResto = [];
                data.data.forEach((el) => {
                    newResto.push({"name" : el.name, "cuisine": el.cuisine});
                });
                this.setState({
                    resto: newResto,
                    totalPage: data.count
                });
            })
            .catch(err => {
                console.log("Erreur dans le GET : " + err);
            });
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
                    resto: newResto,
                    totalPage: data.count
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
        //this.getDataFromServer();
        //this.getDataFromServer2();
        //this.getDataFromServer3();
        this.getDataFromServerParam(this.state.currentPage, this.state.nbRestoPerPage);
    }

    render() {
        console.log("RENDER taille "+this.state.totalPage);
        let listAvecComponent = this.state.resto.map((el, index) => {
            //console.log("------------------ "+el.id);
            let getId = this.getId.bind(index);
            return <Resto
                id={el.id}
                name={el.name}
                cuisine={el.cuisine}
                key={index}
                updateResto={this.onClickUpdate.bind(this)}
                removeResto={this.removeResto.bind(this)}
            />
        });

        let nameResto = this.state.resto.map((el) => {
            return el.name
        });

        // Logique d'affichage du numero de page
        const pageNums = [];
        for (let i = 1; i <= Math.ceil(this.state.totalPage / this.state.nbRestoPerPage); i++) {
            pageNums.push(i);
        }
        /*let laPagination = pageNums.map((num) => {
            return <Pagination
                activePage={this.state.currentPage}
                itemsCountPerPage={10}
                totalItemsCount={this.state.totalPage}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
            />
        });*/

        return (
            <div> {/*className="App"*/}
              <nav className="navbar navbar-light bg-light">
                  <img src={logo} width="70" height="70" alt=""/>
              </nav>
              <div className="container">
                  <br/>
                  <h2>Table des restaurants</h2>
                  <button type="button" className="btn btn-dark mb-3" onClick={this.onClickAdd.bind(this)}><i className="fa fa-plus"></i></button>

                  <div className={this.state.showSuccess ? 'alert alert-success' : 'd-none'} role="alert">
                      <h6 className="alert-heading">Opération réussie</h6>
                      <p>{this.state.message}</p>
                  </div>

                  <div className="row">
                      <div className="col-lg-8" className={this.state.add || this.state.update ? 'col-lg-8' : 'col-lg'}>
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
                                  ref={(input) => this.input = input}
                                  className="form-control" placeholder="Chercher par nom"/>
                          </div>
                          Nombre de Resto : {this.state.resto.length} | Page {this.state.currentPage} / {Math.ceil(this.state.totalPage / this.state.nbRestoPerPage)}
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
                              {/*laPagination*/}
                              {/*<Pagination items={this.state.resto} onChangePage={this.onPageChange}/>*/}
                              <div className="btn-toolbar">
                                  <div className="btn-group mr-2">
                                      <button type="button" className="btn btn-dark">1</button>
                                      <button type="button" className="btn btn-dark">2</button>
                                      <button type="button" className="btn btn-dark">3</button>
                                      <button className="btn btn-light">...</button>
                                      <button type="button" className="btn btn-dark">{Math.ceil(this.state.totalPage / this.state.nbRestoPerPage)}</button>
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
                                                 value={this.state.id} onChange={this.updateFormId.bind(this)} placeholder="Id du restaurant à modifier" readOnly={true}/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="restaurantInput">Nom</label>
                                          <input className="form-control" id="restaurantInput" type="text" name="nom"
                                                 required value={this.state.nameResto} onChange={this.updateFormName.bind(this)} placeholder="Michel's restaurant"/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="cuisineInput">Cuisine</label>
                                          <input className="form-control" id="cuisineInput" type="text" name="cuisine"
                                                 required value={this.state.cuisineType} onChange={this.updateFormCuisine.bind(this)} placeholder="Michel's cuisine"/>
                                      </div>
                                      <button className="btn btn-dark" type="submit">Modifier ce restaurant</button>
                                  </form>
                              </div>
                          </div>
                      </div>


                      {/* Formulaire d'ajout */}
                      <div className={this.state.add ? 'col-lg-4' : 'd-none'} id="formulaireInsertion">
                          <div className="card">
                              <div className="card-body">
                                  <form id="formulaireInsertionform" onSubmit={this.handleAddResto}>
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
