import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constant/Colors";

export default function Profile() {
  const router = useRouter();
  const { name = "User_Name" } = useLocalSearchParams();

  useEffect(() => {
    console.log("Profile screen loaded");
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Navigation Tabs */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
          <Text style={[styles.navText, styles.activeTab]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/home_screen/home")} style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.navItem}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <Text style={styles.username}>{name}</Text>
      <View style={styles.profileImageContainer}>
        {/* <Image
          source={require("../assets/images/profile.jpg")} // Replace with actual image
          style={styles.profileImage}
        /> */}
      </View>

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <Ionicons name="wallet-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.progressLabel}>Financial</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: "70%", backgroundColor: "#3B5BDB" }]} />
          </View>
          <Text style={styles.progressValue}>7</Text>
        </View>

        <View style={styles.progressItem}>
          <Ionicons name="briefcase-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.progressLabel}>Work</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: "40%", backgroundColor: "#9B51E0" }]} />
          </View>
          <Text style={styles.progressValue}>4</Text>
        </View>

        <View style={styles.progressItem}>
          <Ionicons name="heart-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.progressLabel}>Physical</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: "50%", backgroundColor: "#F4A261" }]} />
          </View>
          <Text style={styles.progressValue}>5</Text>
        </View>
      </View>

      {/* PH-9 Test Button */}
      <TouchableOpacity style={styles.testButton} onPress={() => alert("PH-9 Test Coming Soon!")}>
        <Text style={styles.testButtonText}>Take PH-9 Test</Text>
      </TouchableOpacity>

      {/* Bottom Navigation - Updated Buttons */}
      <View style={styles.bottomNav}>
        <View style={styles.circleButtonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/resources")}>
            <Ionicons name="book-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Resources</Text>
        </View>

        <View style={styles.circleButtonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/family-support")}>
            <Ionicons name="people-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Family Support</Text>
        </View>

        <View style={styles.circleButtonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/forum")}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Forum</Text>
        </View>

        <View style={styles.circleButtonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/career-counseling")}>
            <Ionicons name="briefcase-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Career</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY,
    paddingTop: 40,
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 15,
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  navItem: {
    paddingVertical: 10,
  },
  navText: {
    fontSize: 18,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  activeTab: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.BLACK,
    marginTop: 80,
  },
  profileImageContainer: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  progressContainer: {
    marginTop: 30,
    width: "90%",
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  progressBarBackground: {
    flex: 3,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  testButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 60,
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  circleButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.BLACK,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    marginBottom: 5,
  },
  buttonText: {
    marginTop: 5,
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
