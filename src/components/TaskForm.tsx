'use client';

import { useRef, useState } from 'react';
import { createTask } from '@/app/actions/tasks';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  async function action(formData: FormData) {
    setIsPending(true);
    try {
      await createTask(formData);
      formRef.current?.reset();
    } catch (e) {
      console.error(e);
      alert('Falha ao criar tarefa!');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Criar Nova Tarefa</h2>
      <form ref={formRef} action={action} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="O que precisa ser feito?"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder="Adicione contexto ou detalhes..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-zinc-300 mb-1">
            Anexo
          </label>
          <input
            type="file"
            name="file"
            id="file"
            className="block w-full text-sm text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-500/10 file:text-indigo-400
              hover:file:bg-indigo-500/20 file:transition-all cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isPending ? 'Criando Tarefa...' : 'Adicionar Tarefa'}
        </button>
      </form>
    </div>
  );
}
