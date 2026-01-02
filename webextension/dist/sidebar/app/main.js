import { ac as clientExports, j as jsxRuntimeExports, R as React, ad as Providers, ae as ThemeProvider, a3 as SidebarProvider, a4 as AppSidebar } from '../../assets/chunk-C05p8MFS.js';

function SidebarApp() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading Forkyy..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Providers, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ThemeProvider,
    {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProvider, { defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}) })
    }
  ) });
}
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = clientExports.createRoot(rootElement);
    root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(SidebarApp, {}));
    console.log("✅ Forkyy Sidebar React app initialized");
  } else {
    console.error("❌ Root element not found");
    document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Error</h1><p>Root element not found</p></div>';
  }
} catch (error) {
  console.error("❌ Failed to initialize Sidebar React app:", error);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui;">
        <h1>Error Loading Sidebar</h1>
        <p>${error instanceof Error ? error.message : "Unknown error"}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
          Check the browser console (F12) for details.
        </p>
      </div>
    `;
  }
}
//# sourceMappingURL=main.js.map
