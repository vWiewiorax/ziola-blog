import { Suspense } from "react";
import AdminGuard from "@/components/admin/admin-guard";
import PostEditor from "@/components/admin/post-editor";

export default function EditorPage() {
  return (
    <AdminGuard>
      <Suspense fallback={<p className="text-sm text-neutral-600">Ładowanie edytora...</p>}>
        <PostEditor />
      </Suspense>
    </AdminGuard>
  );
}
