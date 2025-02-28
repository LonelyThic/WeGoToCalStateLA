import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../constant/Colors";
import Corners from "../constant/Corners";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/CSULA.png')} style={styles.logo} />

      <View style={styles.content}>
        <Text style={styles.title}>WeGoToCalStateLA</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/authentication/signup')}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push('/authentication/login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push('/daily_check_in/daily')}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push('/anim_test')}>
          <Text style={styles.buttonText}>Anim</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.SECONDARY,
  },
  logo: {
    width: 320,
    height: 360,
    alignSelf: 'center',
    padding: 25,
  },
  content: {
    padding: 25,
    backgroundColor: Colors.PRIMARY,
    height: "50%",
    borderRadius: Corners.DEFAULT,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.BLACK,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.WHITE,
  },
});