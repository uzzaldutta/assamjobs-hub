
import { getMockTestMetadata } from "@/lib/mock-test/actions";
import MockTestEngine from "./MockTestEngine";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { testId: string } }) {
  try {
    const data = await getMockTestMetadata(params.testId);
    return { title: `${data.title} | AssamJobs Hub Mock Test` };
  } catch (e) {
    return { title: "Mock Test | AssamJobs Hub" };
  }
}

export default async function MockTestPage({ params }: { params: { testId: string } }) {
  try {
    const testData = await getMockTestMetadata(params.testId);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MockTestEngine testId={params.testId} initialMetadata={testData} />
      </div>
    );
  } catch (e: any) {
    if (e.message === "Mock test not found") return notFound();
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl max-w-md">
          <h2 className="font-bold text-lg mb-2">Unavailable</h2>
          <p>{e.message || "Failed to load test"}</p>
        </div>
      </div>
    );
  }
}
