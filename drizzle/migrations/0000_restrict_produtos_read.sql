DROP POLICY IF EXISTS "produtos_leitura" ON public.produtos;
CREATE POLICY "produtos_leitura" ON public.produtos FOR SELECT TO authenticated USING (ativo = true);