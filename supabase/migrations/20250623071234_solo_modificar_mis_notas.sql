-- Permite que cada usuario solo inserte/actualice/borré sus propias notas
CREATE POLICY "Solo modificar mis notas"
  ON notes
  FOR ALL
  USING (user_id = auth.uid());