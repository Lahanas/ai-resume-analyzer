import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {

  const {auth, kv, fs} = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);


  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }
    loadResumes();
  }, []);

  const handleDelete = async (resume: Resume) => {
    await fs.delete(resume.resumePath);
    await fs.delete(resume.imagePath);
    await kv.delete(`resume:${resume.id}`);
    setResumes((prev) => prev.filter((r) => r.id !== resume.id));
  }

  const averageScore = resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + r.feedback.overallScore, 0) / resumes.length)
      : 0;
  const bestScore = resumes.length > 0
      ? Math.max(...resumes.map((r) => r.feedback.overallScore))
      : 0;

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications & Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
            <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan.gif" className="w-[200px]" />
          </div>
      )}

    {!loadingResumes && resumes.length > 0 && (
        <div className="flex flex-row gap-4 flex-wrap justify-center">
          <div className="bg-white rounded-2xl shadow-md px-8 py-4 flex flex-col items-center">
            <p className="text-3xl font-bold">{resumes.length}</p>
            <p className="text-sm text-gray-500">Resumes Analyzed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md px-8 py-4 flex flex-col items-center">
            <p className="text-3xl font-bold">{averageScore}</p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md px-8 py-4 flex flex-col items-center">
            <p className="text-3xl font-bold">{bestScore}</p>
            <p className="text-sm text-gray-500">Best Score</p>
          </div>
        </div>
    )}

    {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete}/>
          ))}
        </div>
    )}

      {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
