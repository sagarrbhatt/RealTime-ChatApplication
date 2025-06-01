import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001": "/"


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/Check");
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth: ", error)
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }

    },

    signUp: async (formdata) => {
        try {
            set({ isSigningUp: true });

            const { fullName, email, password } = formdata;

            const res = await axiosInstance.post("/auth/signup", {
            fullName,
            email,
            password,
            });

            if (res.data) {
            set({ authUser: res.data.user });
            toast.success("Account created successfully!");
            get().connectSocket();
            }
        } catch (error) {
            toast.error("Error in Signing Up");
            console.error("Signup error:", error);

        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  },

    login: async (formdata) => {
            try {
                set({ isLoggingIn: true });

                const { email, password } = formdata;

                const res = await axiosInstance.post("/auth/login", {
                email,
                password,
                });

                if (res.data) {
                set({ authUser: res.data.user });
                toast.success("Account logged in successfully!");
                get().connectSocket();
                // Navigate("/");
                }
            } catch (error) {
                toast.error("Error in Login Up");
                console.error("Login error:", error);
                return false;

            } finally {
                set({ isLoggingIn: false });
            }
        },

    updateProfile: async (formdata) => {
        try {
            set({ isUpdatingProfile: true });

            const res = await axiosInstance.put("/auth/update-profile", formdata);

            if (res.data) {
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Update profile error:", error);
        } finally {
            set({ isUpdatingProfile: false });
        }
        },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({socket: socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },





}))