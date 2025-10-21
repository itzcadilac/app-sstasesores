import { Tabs, useRouter } from "expo-router";
import { Home, Search, User, LogOut } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  const { isEmpresa, isInstructor, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <LogOut size={24} color={Colors.text} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      {isEmpresa && (
        <Tabs.Screen
          name="buscar"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
      )}
      {!isEmpresa && !isInstructor && (
        <Tabs.Screen
          name="consulta-capacitaciones"
          options={{
            title: "Capacitaciones",
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
