import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constant/Colors";
import Corners from "../constant/Corners";


export default function Index() {
  
  const router = useRouter(); {/* This is a hook that allows us to navigate to different pages */}

  return (
    <View
      style={{
        flex: 1,
        padding: 25,
        height: "100%",
        backgroundColor: Colors.SECONDARY,

      }}
    >
      <Image source={require('./../assets/images/CSULA.png')} 
      style={{
        width: '100%',
        height: '50%',
        padding: 25,
        alignSelf: 'center'}}
      />
      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "50%",
          borderTopLeftRadius: Corners.DEFAULT,
          borderTopRightRadius: Corners.DEFAULT,
          borderBottomLeftRadius: Corners.DEFAULT,
          borderBottomRightRadius: Corners.DEFAULT,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          WeGoToCalStateLA
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: Colors.WHITE,
          }}
        >
          Welcome to the WeGoToCalStateLA application where you will be able to
          learn new and creative ways to manage your money and improve your
          well-being.
        </Text>

        {/* This is a button that will navigate to the signup page */}
        <TouchableOpacity style={styles.button}
        onPress={()=>router.push('/authentication/signup')}>
          <Text style={[styles.buttonText, {color: Colors.WHITE}]}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{
          backgroundColor: Colors.PRIMARY,
          borderWidth: 1,
          borderColor: Colors.WHITE,
          }]}
          onPress={()=>router.push('/authentication/login')}>
          <Text style={[styles.buttonText,{color: Colors.WHITE}]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.BLACK,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  }
});