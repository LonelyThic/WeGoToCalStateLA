import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Chrome as Home, Calendar, Brain, BookOpen, User, MessagesSquare, MessageCircle, Heart, Menu, X, Sparkles, Bell, Settings, LogOut, ChevronDown, Shield } from 'lucide-react-native';
import { Colors } from '../constant/Colors';
import { responsive, width } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';

export default function WebLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Home', icon: Home, route: '/home_screen/home', active: pathname === '/home_screen/home' || pathname === '/' },
    { name: 'Daily Check-in', icon: Heart, route: '/daily_check_in/daily', active: pathname.includes('/daily_check_in') },
    { name: 'Threads', icon: MessagesSquare, route: '/threads/feed', active: pathname.includes('/threads') }, //Replace Assessments with Threads
    { name: 'Events', icon: Calendar, route: '/home_screen/events', active: pathname === '/home_screen/events' },
    { name: 'Resources', icon: BookOpen, route: '/resources/resource', active: pathname.includes('/resources') },
    { name: 'AI Assistant', icon: MessageCircle, route: '/chat_bot/chatbotui', active: pathname.includes('/chat_bot') },
    { name: 'Profile', icon: User, route: '/profile', active: pathname.includes('/profile') },
  ];

  const navigateToScreen = (route) => {
    router.push(route);
    setSidebarOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUserMenuOpen(false);
      router.replace('/authentication/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Mobile Menu Button */}
          <TouchableOpacity
            style={styles.mobileMenuButton}
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>

          {/* Brand */}
          <TouchableOpacity 
            style={styles.brand}
            onPress={() => router.push('/')}
          >
            <View style={styles.brandIcon}>
              <Sparkles size={24} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.brandText}>WeGoToCalStateLA</Text>
          </TouchableOpacity>

          {/* Desktop Navigation */}
          <View style={styles.desktopNav}>
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.navItem, item.active && styles.navItemActive]}
                  onPress={() => navigateToScreen(item.route)}
                >
                  <IconComponent size={18} color={item.active ? Colors.PRIMARY : '#64748b'} />
                  <Text style={[styles.navText, item.active && styles.navTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* User Menu */}
          <View style={styles.userSection}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#64748b" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => setUserMenuOpen(!userMenuOpen)}
            >
              <View style={styles.avatar}>
                <User size={16} color={Colors.WHITE} />
              </View>
              <Text style={styles.userName}>{user?.username || user?.email || 'Guest'}</Text>
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>

            {/* User Dropdown */}
            {userMenuOpen && (
              <View style={styles.userDropdown}>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => navigateToScreen('/profile')}
                >
                  <User size={16} color="#64748b" />
                  <Text style={styles.dropdownText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Settings size={16} color="#64748b" />
                  <Text style={styles.dropdownText}>Settings</Text>
                </TouchableOpacity>
                <View style={styles.dropdownDivider} />
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <LogOut size={16} color="#ef4444" />
                  <Text style={[styles.dropdownText, { color: '#ef4444' }]}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarBrand}>
                <Sparkles size={24} color={Colors.PRIMARY} />
                <Text style={styles.sidebarBrandText}>WeGoToCalStateLA</Text>
              </View>
              <TouchableOpacity 
                style={styles.sidebarClose}
                onPress={() => setSidebarOpen(false)}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sidebarNav}>
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.sidebarNavItem, item.active && styles.sidebarNavItemActive]}
                    onPress={() => navigateToScreen(item.route)}
                  >
                    <IconComponent 
                      size={20} 
                      color={item.active ? Colors.PRIMARY : '#64748b'} 
                    />
                    <Text style={[
                      styles.sidebarNavText,
                      item.active && styles.sidebarNavTextActive
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sidebarFooter}>
              <View style={styles.emergencyCard}>
                <Shield size={16} color="#ef4444" />
                <Text style={styles.emergencyText}>Emergency: 988</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {children}
      </View>

      {/* Overlay for closing menus */}
      {userMenuOpen && (
        <TouchableOpacity 
          style={styles.globalOverlay}
          onPress={() => setUserMenuOpen(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 16,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  mobileMenuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    display: responsive({ xs: 'flex', lg: 'none' }),
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  desktopNav: {
    flexDirection: 'row',
    gap: 4,
    display: responsive({ xs: 'none', lg: 'flex' }),
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: Colors.PRIMARY + '10',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  navTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    display: responsive({ xs: 'none', sm: 'flex' }),
  },
  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 180,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: responsive({ xs: '85%', sm: 320 }),
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarBrandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  sidebarClose: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  sidebarNav: {
    flex: 1,
    paddingVertical: 16,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  sidebarNavItemActive: {
    backgroundColor: Colors.PRIMARY + '10',
    borderLeftWidth: 3,
    borderLeftColor: Colors.PRIMARY,
  },
  sidebarNavText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  sidebarNavTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  emergencyText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  globalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});