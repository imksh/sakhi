import {create} from "zustand";
import { api } from "../lib/axios";
import { toast } from 'react-hot-toast';

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    isSendingMessage:false,
    allUsers:[],


   getMessage: async (userId) =>{
        set({isMessageLoading:true});
        try {
            const res = await api.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            console.log("Error in getMessages: ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isMessageLoading:false});
        }
   },
   getUsers: async () =>{
        set({isUserLoading:true});
        try {
            const res = await api.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            console.log("Error in getUsers: ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
   },
   getAllUsers: async () =>{
        set({isUserLoading:true});
        try {
            const res = await api.get("/messages/all-users");
            set({allUsers:res.data});
        } catch (error) {
            console.log("Error in getAllUsers: ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
   },

   setSelectedUser: (selectedUser) =>{
        set({selectedUser})
   },

   sendMessage: async (messageData) =>{
        set({isSendingMessage:true});
        const{messages,selectedUser}=get();
        try {
            const res = await api.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages: [...messages,res.data]});
        } catch (error) {
            console.log("Error in getUsers: ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isSendingMessage:false});
        }
   },
   getMsg:async(id1,id2)=>{
    try {
            const msg = await api.get(`/messages/${id1}/${id2}`);
            if(!msg) return null;
            
            return msg.data ;
        } catch (error) {
            console.log("Error in getMsg: ",error);
            toast.error(error.response.data.message);
        }
   }
}))