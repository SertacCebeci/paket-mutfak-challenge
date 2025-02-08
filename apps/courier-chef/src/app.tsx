import { KanbanBoard, TopNavigation } from '@paket/features';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 ">
      <TopNavigation />
      <main className="p-8">
        <KanbanBoard />
      </main>
    </div>
  );
};
