import { useEffect, useState } from "react";
import { MenuContext } from "./MenuContext";
import api from "@/api/axiosClient";

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    
      const loadMenu = async ()=>{

    try {
      let data = await api.get("/menu")
      if(Array.isArray(data) && data?.length === 0){
        const sedData = await api.post("/menu/seed");
        data = sedData
      }
      setMenuItems(Array.isArray(data)? data :[])
    }catch(err){
      console.error("Failed to fetch menu: ",err)
    }finally {
      setLoading(false)
    }

  }
  
    loadMenu()
  },[])


  const addMenuItem = async (newItem) => {
    const {data: created } = await api.post("/menu", {
      ...newItem,
      price: Number(newItem?.price),
      taxRate: Number(newItem.taxRate || 5)
    })
    setMenuItems((prev) => [created, ...prev]);
  };

  const updateMenuItem = async (id, updatedFields) => {
    const { data: updated } = await api.put(`/menu/${id}`, {
      ...updatedFields,
      price: Number(updatedFields.price),
      taxRate: Number(updatedFields.taxRate || 5),
    });
    setMenuItems((prev) =>
      prev.map((item) => (item._id === id ? updated : item))
    );
  };

 const toggleAvailability = async (id) => {
    const { data: updated } = await api.patch(`/menu/${id}/availability`);
    setMenuItems((prev) =>
      prev.map((item) => (item._id === id ? updated : item))
    );
  };

 const deleteMenuItem = async (id) => {
    await api.delete(`/menu/${id}`);
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
  };
  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        loading,
        updateMenuItem,
        toggleAvailability,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}