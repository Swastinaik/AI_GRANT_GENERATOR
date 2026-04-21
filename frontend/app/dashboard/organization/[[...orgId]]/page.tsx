import { Suspense } from "react";
import { cookies } from "next/headers";
import OrganizationForm from "../components/organization-form";
import { OrganizationSkeleton } from "../components/organization-skeleton";

async function getOrganizationData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Artificial suspense delay

  try {
    const res = await fetch(`${baseUrl}/api/organization`, {
      headers: {
        Cookie: cookieStore.toString()
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 400) {
        return null;
      }
      throw new Error(`Failed to fetch org: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.organization || null;
  } catch (error) {
    console.error("Organization fetch error:", error);
    return null;
  }
}

async function OrganizationLoader({ orgIdParam }: { orgIdParam: string | null }) {
  // If orgId is specifically "none" or absent (new), we might skip fetching, but user explicitly wants us to fetch and see if present later?
  // User Prompt: "if orgId is None -> then show the form to create orgData... if orgId present fetch the data"
  // Let's rely on the URL path. If orgId is "new" or absent, skip fetching.

  let orgData = null;

  if (orgIdParam && orgIdParam !== "new") {
    // Attempt to fetch existing data
    orgData = await getOrganizationData();
  }

  return <OrganizationForm initialData={orgData} />;
}

export default async function OrganizationDynamicPage({ params }: { params: Promise<{ orgId?: string[] }> }) {
  const resolvedParams = await params;
  const orgIdValue = resolvedParams.orgId?.[0] || null;

  return (
    <Suspense fallback={<OrganizationSkeleton />}>
      <OrganizationLoader orgIdParam={orgIdValue} />
    </Suspense>
  );
}
