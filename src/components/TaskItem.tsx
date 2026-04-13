'use client';

import { useState, useRef, useEffect } from 'react';
import { deleteTask, updateTask } from '@/app/actions/tasks';
import { Trash2, Edit2, Check, X, Paperclip, FileDown, Loader2 } from 'lucide-react';

export default function TaskItem({ 
  task, 
  signedUrl 
}: { 
  task: any, 
  signedUrl: string | null 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (task.created_at) {
      setFormattedDate(new Date(task.created_at).toLocaleString());
    }
  }, [task.created_at]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (e) {
      console.error(e);
      alert('Falha ao excluir tarefa');
      setIsDeleting(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    try {
      await updateTask(task.id, formData);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Falha ao atualizar tarefa');
    }
  }

  return (
    <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-5 hover:bg-zinc-800/80 transition-all group">
      {isEditing ? (
        <form ref={formRef} action={handleUpdate} className="space-y-3">
          <input
            type="text"
            name="title"
            defaultValue={task.title}
            required
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
          />
          <textarea
            name="description"
            defaultValue={task.description}
            rows={2}
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
          ></textarea>
          <div className="flex gap-2 justify-end">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4"/> Cancelar
            </button>
            <button 
              type="submit"
              className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
            >
              <Check className="w-4 h-4"/> Salvar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            )}
            
            <div className="mt-3 text-xs text-zinc-600 font-mono">
              Criado em {formattedDate}
            </div>
          </div>
          
          <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-center">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-500/30"
              title="Editar Tarefa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30 disabled:opacity-50"
              title="Excluir Tarefa"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Attachment area */}
      {!isEditing && task.file_path && signedUrl && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-400">
            <Paperclip className="w-4 h-4" />
            Anexo
            <span className="text-xs font-normal text-zinc-600 truncate max-w-[200px]">({task.file_name})</span>
          </div>
          
          <div className="rounded-lg overflow-hidden bg-zinc-950 border border-white/10 group/media relative">
            {task.file_type?.startsWith('image/') ? (
              <img 
                src={signedUrl} 
                alt={task.file_name} 
                className="max-h-64 object-contain w-full"
                loading="lazy"
              />
            ) : task.file_type?.startsWith('video/') ? (
              <video 
                src={signedUrl} 
                controls 
                className="max-h-64 w-full"
                preload="metadata"
              />
            ) : (
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-zinc-300 font-mono truncate mr-4">{task.file_name}</span>
                <a 
                  href={signedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  <FileDown className="w-4 h-4" /> Baixar
                </a>
              </div>
            )}
            
            {/* Download overlay for images */}
            {task.file_type?.startsWith('image/') && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                 <a 
                  href={signedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium shadow-xl hover:scale-105 transition-transform"
                >
                  <FileDown className="w-4 h-4" /> Abrir Imagem Completa
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
