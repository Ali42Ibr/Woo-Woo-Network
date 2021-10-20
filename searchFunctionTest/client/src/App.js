import React, { Component, useState } from 'react';


class App extends Component {

  
  state = {
    response: '',
    post: '',
    responseToPost: '',
    array: [],
    search: '',
    cookies: ''
  };
    
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {

    
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });

    const arrays = JSON.parse(this.state.responseToPost).users;

    this.setState({array: arrays});


  };

onChangeTest = e => {
  //return <>{responseToPost}</>;
}

onchange = e => {
  this.setState({ search : e.target.value})
}

render() {

    const {search} = this.state;
    const filteredNames = this.state.array.filter( person => {
      return person.name.toLowerCase().indexOf( search.toLowerCase()) !== -1
    })


    return (

      
      <div className="App">
        <p>{}</p>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>

        

        <input type="text" placeHolder="search" onChange={this.onchange} />
 {       (filteredNames.map((val,key) => {
    return (
          <div className ="user" key={key}>
              <p>{val.name} distance from you: {val.location/1000} km</p>
          </div>
    )}))}

<input type="text" onClick={this.onChangeTest}/>

    
      </div>




    );
  }
}

export default App;