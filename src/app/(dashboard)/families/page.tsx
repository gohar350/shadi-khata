import { getFamilies } from "@/actions/families";
import { Header } from "@/components/layout/header";
import { FamiliesClient } from "./families-client";

export default async function FamiliesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const families = await getFamilies(params.search);

  return (
    <>
      <Header title="Families" />
      <main className="p-4 lg:p-8 pb-24 lg:pb-8">
        <FamiliesClient families={families} search={params.search} />
      </main>
    </>
  );
}
