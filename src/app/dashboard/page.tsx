"use client";
import AssetDashboard from "@components/Dashboard/Asset/AssetDashboard";
import CardsView from "@components/Dashboard/CardsView/CardsView";
import TransactionDashboard from "@components/Dashboard/Transaction/TransactionDashboard";
import ChatBox from "../../components/chatBot/ChatBox";
import React, { useMemo } from "react";
const HomePage: React.FC = () => {
  return (
    <div className="">
      <CardsView />
      <AssetDashboard />
      <ChatBox/>
      <TransactionDashboard />
    </div>
  );
};

export default HomePage;