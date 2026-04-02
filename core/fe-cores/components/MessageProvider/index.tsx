"use client";
import { message } from "antd";
import React, { createContext, useContext, ReactNode } from "react";

// Định nghĩa kiểu cho context
type MessageContextType = {
  message: any;
};

// Tạo context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ message: messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook để sử dụng message
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
