import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      title: 'Simple Spreadsheet Application',
      sheet: []
    }
  }

  //MAKE AJAX CALLS HERE

  componentDidMount() {
    console.log('COMPONENT HAS MOUNTED');
    var that = this;
    fetch('http://localhost:3000/api/sheet')
    .then(function(response){
      response.json()
      .then(function(data) {
        that.setState({
          sheet: data
        })
      })
    })
  }
  
  removeRow(id) {
    let sheet = this.state.sheet;
    let row = sheet.find(function(row) {
      return row.id === id
    });
    var request = new Request('http://localhost:3000/api/remove' + id, {
      method: 'DELETE'
    });

    fetch(request)
    .then(function(response) {
      response.json()
      .then(function(data) {
        console.log(data)
      })
    })
  }

  addRow(event) {
    var that = this;
    event.preventDefault();
    let sheet_data = {
      name: this.refs.name.value,
      description: this.refs.description.value,
      price: this.refs.price.value
    };
    var request = new Request('http://localhost:3000/api/new-row', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(sheet_data)
    });
    let sheet = that.state.sheet;
    sheet.push(sheet_data);
    that.setState({
      sheet: sheet
    });

    fetch(request)
    .then(function(response){
      response.json()
      .then(function(data) {
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  render() {
    let title = this.state.title;
    let sheet = this.state.sheet;
    return (
      <div className="App">
        <h1>{title}</h1>
        <form ref="rowForm">
          <input type="text" ref="name" placeholder="name"/>
          <input type="text" ref="description" placeholder="description"/>
          <input type="text" ref="price" placeholder="price"/>
          <button onClick={this.addRow.bind(this)}>Add Row</button>
        </form>
        <ul>
          {sheet.map(row => <li key={row.id}>{row.name} {row.description} {row.price} <button onClick={this.removeRow.bind(this, row.id)}>Remove</button></li>)}
        </ul>
      </div>
    );
  }
}

export default App;
