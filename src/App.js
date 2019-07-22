import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'

class App extends Component{
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageURL: this.state.input});

    // Instantiate a new Clarifai app by passing in your API key.
    const app = new Clarifai.App({apiKey: '745d38fd78044a28a4238f385a797106'});

    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
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
          <FaceRecognition imageURL={this.state.imageURL} box={this.state.box}/>
      </div>
    );
  }

}

export default App;
