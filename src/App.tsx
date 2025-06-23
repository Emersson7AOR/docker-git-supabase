import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./lib/supabaseClient"; // Importamos nuestro cliente

// Definimos el tipo para una Nota para que TypeScript nos ayude
type Note = {
  id: number;
  created_at: string;
  title: string | null;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  useEffect(() => {
    // Función para obtener las notas
    const fetchNotes = async () => {
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
  }, []); // El array vacío hace que se ejecute solo una vez al montar el componente

  const handleAddNote = async () => {
    if (newNoteTitle.trim() === "") return; // Evitamos notas vacías

    const { error } = await supabase
      .from("notes")
      .insert({ title: newNoteTitle });

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

  return (
    <div className="App">
      <h1>Notas de Supabase</h1>

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

export default App;
