import pool from '@/lib/db';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Cloud } from 'lucide-react';
import type { RowDataPacket } from 'mysql2';

export const revalidate = 0; // Disable SSR caching, always fetch fresh tasks
export const dynamic = 'force-dynamic';

export default async function Home() {
  let tasks: RowDataPacket[] = [];
  try {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM tasks ORDER BY created_at DESC');
    tasks = rows;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    // Don't crash, just let it be empty or handle gracefully
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 md:gap-12 relative z-10">
        <header className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 backdrop-blur-xl">
            <Cloud className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Gerenciador de Tarefas em Nuvem
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Um checklist minimalista, sem estado, alimentado por Server Actions, pronto para contêineres e totalmente apoiado na nuvem.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8 items-start">
          <aside className="sticky top-8">
            <TaskForm />
          </aside>
          
          <div className="flex flex-col gap-4 min-h-[500px]">
             {/* Note: In a real environment, we'd only render TaskList if the DB query succeeded. */}
            <TaskList tasks={tasks} />
          </div>
        </section>
      </div>
    </main>
  );
}
