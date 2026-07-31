import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import AuthGuard from "@/components/core/Auth/AuthGuard";
import { CallProvider } from "@/components/core/Dashboard/Call/CallProvider";
import { NotificationCenterProvider } from "@/components/core/Dashboard/Notification/NotificationCenterProvider";
import { ShortlistProvider } from "@/components/core/Dashboard/Shortlist/ShortlistProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeRegistry>
            <AuthGuard>
              <CallProvider>
                <NotificationCenterProvider>
                  <ShortlistProvider>{children}</ShortlistProvider>
                </NotificationCenterProvider>
              </CallProvider>
            </AuthGuard>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
