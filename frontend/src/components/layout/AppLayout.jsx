import PageWrapper from "./PageWrapper";
import Sidebar from "./Sidebar";

/**
 * Shared application layout for sidebar pages.
 *
 * The sidebar is position:fixed and spans the full viewport height; only the
 * main content area (right of the sidebar) scrolls vertically. The page body
 * itself never scrolls, so the sidebar stays completely stationary.
 */
export default function AppLayout({ children }) {
  return (
    <PageWrapper className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className="flex-1 pl-56 h-screen overflow-y-auto overflow-x-hidden"
        data-lenis-prevent
      >
        {children}
      </div>
    </PageWrapper>
  );
}