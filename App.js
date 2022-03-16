import * as React from 'react';
import { Text, View, StyleSheet, Image, FlatList, Dimensions, Button } from 'react-native';
import { createAppContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const TabNavigator = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

class TabOne extends React.Component {
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
  async componentDidMount() {
    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
          const base64data = reader.result;   
          resolve(base64data);
        }
      });
    }

    let json = await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()
    const vals = {};
    json = json.slice(0, 50)
    // cache list of b64 images
    await Promise.all(json.map(async function a(element) {
      if (!(element.url in vals)) {
        vals[element.url] = await getBase64FromUrl(element.url)
      }
    }));
    this.setState({
      items: {"json":json, "vals": vals},
      DataisLoaded: true,
    });
  }

  renderTabOne() {
    let { DataisLoaded, items } = this.state;
    if (!DataisLoaded) return <Text style={{left: 60, top: 60}}>Loading...</Text>;
    let images = items["json"]
    let vals = items["vals"]

    const screen = Dimensions.get("screen");

    const style = StyleSheet.create({
      photo_container: {
        width: 0.6 * screen.width,
        height: 0.8 * screen.width,
        margin: 0.05 * screen.width,
        borderRadius: 10,
        elevation: 10,
        top: 80,
        shadowColor: '#000',
        backgroundColor : "#FFFFFF"
      },
      photo_name: {
        transform: [{rotate: '45deg'}],
        width: 0.7 * screen.width,
        height: 'auto',
        fontSize: 8,
        top: 0.25 * screen.width,
        position: 'relative',
        elevation: 30
      },
      photo_image: {
        borderRadius: 10,
        borderWidth: 2,
        top: -12,
        borderColor: 'black',
        height: 0.6 * screen.width,
        width: 0.6 * screen.width,
        position: 'relative',
      },
    });

    const shuffleOrder = (start, arr) => {
      if (start == arr.length) {
        return arr;
      } else {
        const rand = Math.floor(Math.random() * (arr.length - start) ) + start;
        const temp = arr[rand];
        arr[rand] = arr[start]
        arr[start] = temp;
        return shuffleOrder(start + 1, arr)
      }
    }
    const shufflePhotos = () => {
      this.setState({
        "json": shuffleOrder(0, images), "vals": vals, "tab": tab
      })
    }

    const renderPhoto = ({ item }) => {
      if (item.url in vals) {
        return (
      <View style={[style.photo_container, style.shadowProp]}>
        <Text style={style.photo_name}>{item.title}</Text>
        <Image
          source={{ uri: vals[item.url] }}
          style={style.photo_image}></Image>
      </View>
    );
        } else {
          return (
            <View style={[style.photo_container, style.shadowProp]}>
              <Text style={style.photo_name}>{item.title}</Text>
              <Image
                source={{ uri: item.url }}
                style={style.photo_image}></Image>
            </View>
          );
        }};

    return (
      <View className="App" style={{display: "flex"}}>
        <Text style={{left: 60, top: 60}}>Tab 1</Text>
        <FlatList horizontal={true} data={images} renderItem={renderPhoto}/>
        <View style={{position: "relative", top:50}}><Button onPress={shufflePhotos} title='Shuffle Photos'></Button></View>
      </View>
    );
  }
}