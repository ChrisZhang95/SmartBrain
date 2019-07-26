import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

// params for particle background
const param = {
  particles: {
    number: {
      value: 10
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
};
const initialState = {
  input: '',
  imageURL: '',
  box: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: ''
  }
}

class App extends Component{
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: '',
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: '',
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  componentDidMount() {
    fetch('https://rocky-hamlet-86347.herokuapp.com/')
      .then(response => response.json())
      .then(data => console.log(data))
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    this.setState({imageURL: this.state.input});

    // Predict the contents of an image by passing in a URL.
    fetch('https://rocky-hamlet-86347.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://rocky-hamlet-86347.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  calculateFaceLocation = (data) => {
    const box = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: box.left_col * width,
      topRow: box.top_row * height,
      rightCol: width - box.right_col * width,
      bottomRow: height - box.bottom_row * height
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={param} style={{width: '100%',}}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
          { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit}/>
              <FaceRecognition imageURL={this.state.imageURL} box={this.state.box}/>
            </div>
          : (
              this.state.route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
          }

      </div>
    );
  }

}

export default App;