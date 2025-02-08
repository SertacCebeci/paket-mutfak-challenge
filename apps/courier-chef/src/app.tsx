import { KanbanBoard, TopNavigation } from '@paket/features';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-600 ">
      <TopNavigation />
      <main className="p-8">
        <KanbanBoard />
      </main>
    </div>
  );
};
