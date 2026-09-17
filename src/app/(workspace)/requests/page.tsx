import { PageHeader } from "@/components/page-header";
import { RequestForm } from "@/components/request-form";

export const metadata = {
  title: "Yeni talep",
};

export default function RequestsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Yeni görev talebi"
        description="Yeni görevin bilgilerini girin."
      />
      <RequestForm />
    </div>
  );
}
