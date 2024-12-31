import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import * as Toast from "@radix-ui/react-toast";
import "~/app.css";
import router from "~/routing/router";
import { RouterProvider } from "@tanstack/react-router";
import globalConfig from "../../global-config.json";
import { httpLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import superjson from "superjson";

const serverPort = globalConfig[(process.env.NODE_ENV as "test" | undefined) ?? "development"].server.port;

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `http://localhost:${serverPort}/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <React.StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Toast.Provider swipeDirection="right">
            <RouterProvider router={router} />
            <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
          </Toast.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
