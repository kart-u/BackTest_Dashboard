// src/components/Navbar.jsx
"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";


export default function Navbar() {
  return (
    <header className="w-full border-b shadow-sm bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">BackTest</div>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className={navigationMenuTriggerStyle()}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/strategy" className={navigationMenuTriggerStyle()}>Change Strategy</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </header>
  );
}
