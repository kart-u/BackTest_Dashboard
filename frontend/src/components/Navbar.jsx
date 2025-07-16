// src/components/Navbar.jsx
"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <header className="w-full border-b shadow-sm bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">BackTest</div>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/about" className={navigationMenuTriggerStyle()}>
                  Change Strategy
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </header>
  );
}
