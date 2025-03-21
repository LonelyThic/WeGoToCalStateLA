import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function Setup() {
    const router = useRouter();

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [selectedResource, setSelectedResource] = useState('Financial Wellness');
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const handleSavePreferences = async () => {
        try {
            /*
            
                Save to db here or async storage

            */
            Alert.alert("Success", "Preferences saved successfully!");
            router.push('/home_screen/home');
        } catch (error) {
            Alert.alert("Error", "Failed to save preferences. Try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Account Setup</Text>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Allow Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    thumbColor={notificationsEnabled ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingColumn}>
                <Text style={styles.settingText}>Preferred Resources</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedResource}
                        onValueChange={(itemValue) => setSelectedResource(itemValue)}
                        style={styles.picker}
                        mode={Platform.OS === "ios" ? "dialog" : "dropdown"} // Ensures iOS compatibility
                    >
                        <Picker.Item label="Mental Health" value="Mental Health" />
                        <Picker.Item label="Financial Tips" value="Financial Tips" />
                        <Picker.Item label="Career Advice" value="Career Advice" />
                        <Picker.Item label="Physical Well-Being" value="Physical Well-Being" />
                    </Picker>
                </View>
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Dark Mode</Text>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    thumbColor={darkModeEnabled ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSavePreferences}>
                <Text style={styles.buttonText}>Save and Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
        backgroundColor: Colors.CREAM,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GRAY,
    },
    settingColumn: {
        marginTop: 20,
        width: "100%",
        marginBottom: 20,
    },
    settingText: {
        fontSize: 18,
        marginBottom: 5,
    },
    pickerContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        overflow: "hidden",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    picker: {
        width: "100%",
        height: 50,
        color: Colors.BLACK,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        marginTop: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: "bold",
    },
});