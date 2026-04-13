import TaskItem from './TaskItem';
import { getSignedUrl } from '@/lib/storage';

export default async function TaskList({ tasks }: { tasks: any[] }) {
  // We resolve all signed URLs concurrently to avoid waterfalls
  const taskIdsWithSignedUrls = await Promise.all(
    tasks.map(async (task) => {
      let url = null;
      if (task.file_path) {
        try {
          url = await getSignedUrl(task.file_path);
        } catch (e) {
          console.error(`Failed to generate signed URL for task ${task.id}`, e);
        }
      }
      return { ...task, signedUrl: url };
    })
  );

  if (tasks.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-10 text-center shadow-xl">
        <div className="text-zinc-500 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Nenhuma tarefa ainda</h3>
        <p className="text-zinc-400 max-w-sm mx-auto">Comece criando uma nova tarefa. Seus anexos serão armazenados com segurança na nuvem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {taskIdsWithSignedUrls.map((task) => (
        <TaskItem key={task.id} task={task} signedUrl={task.signedUrl} />
      ))}
    </div>
  );
}
