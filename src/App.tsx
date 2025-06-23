import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./lib/supabaseClient"; // Importamos nuestro cliente
import type { Session } from "@supabase/supabase-js";

// Definimos el tipo para una Nota para que TypeScript nos ayude
type Note = {
  id: number;
  created_at: string;
  title: string | null;
  user_id: string | null;
};

// El componente ahora espera recibir la sesión como prop
export default function App({ session }: { session: Session }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  useEffect(() => {
    // Función para obtener las notas
    const fetchNotes = async () => {
      // Ahora la política RLS filtrará automáticamente las notas por el usuario autenticado
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false }); // Ordenamos las más nuevas primero

      if (error) {
        console.error("Error fetching notes:", error);
      } else if (data) {
        setNotes(data);
      }
    };

    fetchNotes();
  }, [session]); // Volvemos a cargar las notas si la sesión cambia

  const handleAddNote = async () => {
    if (newNoteTitle.trim() === "") return; // Evitamos notas vacías

    const { error } = await supabase
      .from("notes")
      // Ahora incluimos el user_id al insertar
      .insert({ title: newNoteTitle, user_id: session.user.id });

    if (error) {
      console.error("Error adding note:", error);
    } else {
      // Refrescamos la lista de notas para ver la nueva
      const { data } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setNotes(data);
      setNewNoteTitle(""); // Limpiamos el input
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="App">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Mis Notas Seguras</h1>
        <div>
          <span>{session.user.email}</span>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="card">
        <input
          type="text"
          placeholder="Escribe una nueva nota..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <button onClick={handleAddNote}>Añadir Nota</button>
      </div>

      <div className="notes-list">
        <h2>Notas Existentes:</h2>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li key={note.id}>{note.title}</li>
            ))}
          </ul>
        ) : (
          <p>No hay notas. ¡Añade una!</p>
        )}
      </div>
    </div>
  );
}
