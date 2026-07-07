import React from "react";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { BRAND as C } from "@/constants/brand";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarProps: SidebarProps;
}

export function AppLayout({ children, sidebarProps }: AppLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar {...sidebarProps} />
      <main data-testid="dashboard" style={{ marginLeft: 240, flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
