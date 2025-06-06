"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: React.ComponentProps<typeof NextThemesProvider>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </AuthProvider>
  );
}
