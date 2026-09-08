import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit2 } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // Removed unused darkModeEnabled state
  const [dataSharing, setDataSharing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile data
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@calstatela.edu',
    studentId: '304598765',
    major: 'Computer Science',
    year: 'Junior',
    joinedDate: 'September 2023',
    alias: null, // Always initially null when page loads, needs storing
  });

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.alias && userData.alias === null) {
      setUserData(prev => ({...prev, alias: String(params.alias) }));
    }
  }, [params.alias]);

  

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile information updated successfully!');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace('/authentication/login');
    }
  };



  const renderWebProfileInfo = () => {
    if (isEditing) {
      return (
        <View style={styles.webEditFormGrid}>
          <View style={styles.webEditFormCard}>
            <View style={styles.webInputGroup}>
              <Text style={styles.webInputLabel}>Name</Text>
              <TextInput
                style={styles.webTextInput}
                value={userData.name}
                onChangeText={(text) => setUserData({...userData, name: text})}
              />
            </View>
            
            <View style={styles.webInputGroup}>
              <Text style={styles.webInputLabel}>Email</Text>
              <TextInput
                style={styles.webTextInput}
                value={userData.email}
                keyboardType="email-address"
                onChangeText={(text) => setUserData({...userData, email: text})}
              />
            </View>
            
            <View style={styles.webInputGroup}>
              <Text style={styles.webInputLabel}>Major</Text>
              <TextInput
                style={styles.webTextInput}
                value={userData.major}
                onChangeText={(text) => setUserData({...userData, major: text})}
              />
            </View>
            
            <View style={styles.webInputGroup}>
              <Text style={styles.webInputLabel}>Year</Text>
              <TextInput
                style={styles.webTextInput}
                value={userData.year}
                onChangeText={(text) => setUserData({...userData, year: text})}
              />
            </View>
            
            <View style={styles.webButtonRow}>
              <TouchableOpacity 
                style={styles.webSaveButton}
                onPress={handleSaveProfile}
              >
                <LinearGradient
                  colors={[Colors.PRIMARY, '#1e40af']}
                  style={styles.webSaveButtonGradient}
                >
                  <Text style={styles.webSaveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.webCancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.webCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.webProfileInfoGrid}>
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Name</Text>
          <Text style={styles.webInfoValue}>{userData.name}</Text>
        </View>
        
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Email</Text>
          <Text style={styles.webInfoValue}>{userData.email}</Text>
        </View>
        
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Student ID</Text>
          <Text style={styles.webInfoValue}>{userData.studentId}</Text>
        </View>
        
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Major</Text>
          <Text style={styles.webInfoValue}>{userData.major}</Text>
        </View>
        
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Year</Text>
          <Text style={styles.webInfoValue}>{userData.year}</Text>
        </View>
        
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Joined</Text>
          <Text style={styles.webInfoValue}>{userData.joinedDate}</Text>
        </View>

        {/* Anonymous*/}
        <View style={styles.webInfoCard}>
          <Text style={styles.webInfoLabel}>Alias</Text>
          {userData.alias ? (
            <Text style={styles.webInfoValue}>{userData.alias}</Text>) : 
            (<TouchableOpacity
            style={styles.webEditButton}
            onPress={() => router.push('/profile/claim_alias')}
            >
              <LinearGradient
                colors={[Colors.DARK_BLUE, '#0696d9']}
                style={styles.webClaimButtonGradient}
              >
                <Text style={styles.webClaimButtonText}>Claim Anonymous Identity</Text>
              </LinearGradient>
            </TouchableOpacity>
            
          )}
          
        </View>
        
        <View style={styles.webEditButtonContainer}>
          <TouchableOpacity 
            style={styles.webEditButton}
            onPress={() => setIsEditing(true)}
          >
            <LinearGradient
              colors={[Colors.SECONDARY, '#d97706']}
              style={styles.webEditButtonGradient}
            >
              <Edit2 size={16} color={Colors.WHITE} />
              <Text style={styles.webEditButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <View style={styles.webProfileImageContainer}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                  style={styles.webProfileImage} 
                />
              </View>
              <View style={styles.webHeaderText}>
                <Text style={styles.webHeaderTitle}>{userData.name}</Text>
                <Text style={styles.webHeaderSubtitle}>Cal State LA Student</Text>
                <Text style={styles.webHeaderEmail}>{userData.email}</Text>
              </View>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Student Information</Text>
            {renderWebProfileInfo()}
          </View>

          {/* Settings */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Preferences</Text>
            <View style={styles.webSettingsContainer}>
              <View style={styles.webSettingsGrid}>
                <View style={styles.webSettingCard}>
                  <View style={styles.webSettingIcon}>
                    <Bell size={24} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.webSettingContent}>
                    <Text style={styles.webSettingTitle}>Notifications</Text>
                    <Text style={styles.webSettingDescription}>Receive wellness reminders and updates</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                    thumbColor={notificationsEnabled ? Colors.PRIMARY : '#9ca3af'}
                    onValueChange={setNotificationsEnabled}
                    value={notificationsEnabled}
                  />
                </View>
                
                <View style={styles.webSettingCard}>
                  <View style={styles.webSettingIcon}>
                    <Shield size={24} color={Colors.PRIMARY} />
                  </View>
                  <View style={styles.webSettingContent}>
                    <Text style={styles.webSettingTitle}>Data Privacy</Text>
                    <Text style={styles.webSettingDescription}>Share anonymous data for research</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                    thumbColor={dataSharing ? Colors.PRIMARY : '#9ca3af'}
                    onValueChange={setDataSharing}
                    value={dataSharing}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Support */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Help & Support</Text>
            <View style={styles.webSupportContainer}>
              <View style={styles.webSupportGrid}>
                <TouchableOpacity style={styles.webSupportCard}>
                  <Text style={styles.webSupportText}>Help Center</Text>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.webSupportCard}>
                  <Text style={styles.webSupportText}>Privacy Policy</Text>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.webSupportCard}>
                  <Text style={styles.webSupportText}>Terms of Service</Text>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.webActionsSection}>
            <TouchableOpacity style={styles.webLogoutButton} onPress={handleLogout}>
              <LinearGradient
                colors={[Colors.ERROR, '#b91c1c']}
                style={styles.webLogoutGradient}
              >
                <LogOut size={18} color={Colors.WHITE} />
                <Text style={styles.webLogoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

  // Mobile Layout
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, '#1e40af']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
              style={styles.profileImage} 
            />
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileRole}>Cal State LA Student</Text>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={24} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Student Information</Text>
          </View>

          {!isEditing ? (
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Student ID</Text>
                <Text style={styles.infoValue}>{userData.studentId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Major</Text>
                <Text style={styles.infoValue}>{userData.major}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>{userData.year}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <LinearGradient
                  colors={[Colors.SECONDARY, '#d97706']}
                  style={styles.editButtonGradient}
                >
                  <Edit2 size={18} color={Colors.WHITE} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={userData.name}
                  onChangeText={(text) => setUserData({...userData, name: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={userData.email}
                  keyboardType="email-address"
                  onChangeText={(text) => setUserData({...userData, email: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Major</Text>
                <TextInput
                  style={styles.textInput}
                  value={userData.major}
                  onChangeText={(text) => setUserData({...userData, major: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.textInput}
                  value={userData.year}
                  onChangeText={(text) => setUserData({...userData, year: text})}
                />
              </View>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <LinearGradient
                  colors={[Colors.PRIMARY, '#1e40af']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={24} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.PRIMARY} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
              thumbColor={notificationsEnabled ? Colors.PRIMARY : '#9ca3af'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={Colors.PRIMARY} />
              <Text style={styles.settingText}>Data Privacy</Text>
            </View>
            <Switch
              trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
              thumbColor={dataSharing ? Colors.PRIMARY : '#9ca3af'}
              onValueChange={setDataSharing}
              value={dataSharing}
            />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={24} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Help Center</Text>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Terms of Service</Text>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.ERROR} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: Colors.WHITE_OPACITY_80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginLeft: 10,
  },
  profileInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  editButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editForm: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.TEXT,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: Colors.TEXT,
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  menuText: {
    fontSize: 16,
    color: Colors.TEXT,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.ERROR,
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
  },
  // Web-specific styles
  webEditForm: {
    backgroundColor: '#f8fafc',
    marginTop: 10,
  },
  webInputGroup: {
    marginBottom: 15,
  },
  webInputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
    fontWeight: '600',
  },
  webTextInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  webSaveButton: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webSaveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  webSaveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  webProfileInfoGrid: {
    gap: 16,
    maxWidth: 800,
    alignSelf: 'center',
  },
  webInfoCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webInfoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 100,
  },
  webInfoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    textAlign: 'right',
  },
  webEditButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  webEditButton: {
    borderRadius: 10,
    overflow: 'hidden',
    width: 200,
  },
  webEditButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  webEditButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  webClaimButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  webClaimButton:{
    borderRadius: 10,
    overflow: 'hidden',
    width: 220,
  },
  webClaimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  webClaimButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Web Layout Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webHeaderSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webHeaderContent: {
    flexDirection: width < 768 ? 'column' : 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: width < 768 ? 24 : 40,
  },
  webProfileImageContainer: {
    alignItems: 'center',
  },
  webProfileImage: {
    width: width < 768 ? 120 : 150,
    height: width < 768 ? 120 : 150,
    borderRadius: width < 768 ? 60 : 75,
    borderWidth: 4,
    borderColor: Colors.PRIMARY + '20',
  },
  webHeaderText: {
    alignItems: width < 768 ? 'center' : 'flex-start',
    flex: 1,
  },
  webHeaderTitle: {
    fontSize: width < 640 ? 28 : width < 1024 ? 36 : 42,
    fontWeight: '900',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: width < 768 ? 'center' : 'left',
  },
  webHeaderSubtitle: {
    fontSize: width < 640 ? 16 : 18,
    color: Colors.SECONDARY,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: width < 768 ? 'center' : 'left',
  },
  webHeaderEmail: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: width < 768 ? 'center' : 'left',
  },
  webSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 50 : 60,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webSectionTitle: {
    fontSize: width < 640 ? 24 : width < 1024 ? 28 : 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: width < 640 ? 24 : width < 1024 ? 32 : 40,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  webEditFormGrid: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  webEditFormCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 20 : 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webButtonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    justifyContent: 'center',
  },
  webCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webCancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  webSettingsContainer: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  webSettingsGrid: {
    gap: 16,
  },
  webSettingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  webSettingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webSettingContent: {
    flex: 1,
  },
  webSettingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  webSettingDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  webSupportContainer: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  webSupportGrid: {
    gap: 12,
  },
  webSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webSupportText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  webActionsSection: {
    paddingVertical: 40,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  webLogoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 200,
  },
  webLogoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  webLogoutText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});