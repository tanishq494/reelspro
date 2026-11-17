"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const Provider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    let cancelled = false;

    const createUser = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
          return;
        }

        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.fullName || user.firstName || email,
            email: email,
            imageUrl: user.imageUrl,
          }),
        });

        if (!response.ok && !cancelled) {
          console.error("Failed to create user record", await response.text());
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to create user record", error);
        }
      }
    };

    createUser();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  return <div>{children}</div>;
};
