import { PageHeader } from "@/components/page-header";
import { RequestForm } from "@/components/request-form";
import { getWorkspace } from "@/lib/workspace";
import { CreateProjectForm } from "@/components/create-project-form";

export const metadata = {
  title: "Yeni talep",
};

export default async function RequestsPage() {
  const { project, assignees, connected } = await getWorkspace();
  if (!project) return <CreateProjectForm />;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Yeni görev talebi"
        description="Yeni görevin bilgilerini girin."
      />
      <RequestForm
        projectId={project.id}
        assignees={assignees}
        connected={connected}
      />
    </div>
  );
}
