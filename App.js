import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

class App extends React.Component {
  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false,
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          DataisLoaded: true,
        });
      });
  }

  render() {
    const { DataisLoaded, items } = this.state;
    if (!DataisLoaded) return <View></View>;

    const style = StyleSheet.create({
      horizontal_scroll: {
        overflow: 'auto',
        whiteSpace: 'nowrap',
      },
      photo_container: {
        display: 'inline-block',
        backgroundColor: 'grey',
        border: '10px',
        borderColor: 'black',
        borderStyle: 'solid',
        padding: '20px',
        borderRadius: '30px',
        width: '50vw',
        height: '100vh',
        margin: '5vh',
        filter: 'drop-shadow(0 -6mm 4mm rgb(160, 0, 210))',
      },
      photo_image: {
        width: '100%',
        maxHeight: '100%',
        position: 'relative',
        top: '0px',
        zIndex: '1',
        elevation: '1'
      },
      photo_name: {
        transform: 'rotate(45deg)',
        width: 'auto',
        height: '1em',
        fontSize: '2.5vw',
        margin: '0',
        top: '25vw',
        position: 'absolute',
        zIndex: '2',
        elevation: '2'
      },
    });

    return (
      <View className="App">
        <Text>Tab 1</Text>
        <View style={style.horizontal_scroll}>
          {items.map((item) => (
            <View style={style.photo_container}>
              <Text style={style.photo_name}>{item.title}</Text>
              <Image
                source={{ uri: 'https://via.placeholder.com/600/92c952' }}
                style={style.photo_image}></Image>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default App;
