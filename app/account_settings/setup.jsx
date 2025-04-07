import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function Setup() {
    const router = useRouter();

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Define your available resource options
    const resourceOptions = [
        "Mental Health",
        "Financial Tips",
        "Career Advice",
        "Physical Well-Being"
    ];

    // Use an object to track which resources are selected
    const [selectedResources, setSelectedResources] = useState({
        "Mental Health": false,
        "Financial Tips": false,
        "Career Advice": false,
        "Physical Well-Being": false,
    });

    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const toggleResource = (resourceName) => {
        setSelectedResources(prevState => ({
            ...prevState,
            [resourceName]: !prevState[resourceName]
        }));
    };

    const handleSavePreferences = async () => {
        // Convert the selected resources object into an array of resource names
        const selected = resourceOptions.filter(resource => selectedResources[resource]);

        try {
            // Save to your DB or AsyncStorage here if needed
            Alert.alert("Success", `Preferences saved!\nSelected Resources: ${selected.join(', ')}`);
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

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Dark Mode</Text>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    thumbColor={darkModeEnabled ? Colors.PRIMARY : Colors.GRAY}
                />
            </View>

            <View style={styles.settingColumn}>
                <Text style={styles.settingText}>Preferred Resources</Text>
                {resourceOptions.map((resource) => (
                    <View key={resource} style={styles.checkboxRow}>
                        <Checkbox
                            value={selectedResources[resource]}
                            onValueChange={() => toggleResource(resource)}
                            color={selectedResources[resource] ? Colors.PRIMARY : undefined}
                        />
                        <Text style={styles.checkboxLabel}>{resource}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSavePreferences}>
                <Text style={styles.buttonText}>Save</Text>
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
        color: Colors.BLACK,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
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