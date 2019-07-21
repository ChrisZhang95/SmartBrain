import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

class App extends Component{
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onSubmit = () => {
    const Clarifai = require('clarifai');

      // Instantiate a new Clarifai app by passing in your API key.
      const app = new Clarifai.App({apiKey: '745d38fd78044a28a4238f385a797106'});

      // Predict the contents of an image by passing in a URL.
      app.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg')
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
                params={{
              		particles: {
                    number: {
                      value: 50
                    },
              			line_linked: {
              				shadow: {
              					enable: true,
              					color: "#3CA9D1",
              					blur: 5
              				}
              			}
              		}
              	}}
                style={{
                  width: '100%',
                }}
              />
        <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          {/*
          <FaceRecognition />*/}
      </div>
    );
  }

}

export default App;
