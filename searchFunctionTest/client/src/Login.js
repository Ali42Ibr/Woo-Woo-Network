import React, { Component} from 'react';


export default class App extends Component {

    state = {
        response: '',
        post: '',
        responseToPost: '',
        array: [],
        search: '',
      };

      handleLogout = async e => {
          const response = await fetch('/api/logout', {
              method: 'POST',
          })
      }

      handleLogIn = async e => {

    
        e.preventDefault();
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        
        this.setState({ responseToPost: body });
    
        console.log(body);
    
    
      };     

    render(){
        return <>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleLogIn}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={this.handleLogout}>Logout</button>
        </>
    }


}