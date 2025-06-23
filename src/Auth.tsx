import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import App from "./App"; // Importamos la App de notas
import type { Session } from "@supabase/supabase-js";

export default function AuthContainer() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "400px" }}>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["github"]} // Opcional: añade login con GitHub
            theme="dark"
          />
        </div>
      </div>
    );
  } else {
    // Si hay sesión, muestra la aplicación principal
    // Pasamos la sesión como prop por si la necesitamos dentro
    return <App session={session} />;
  }
}
