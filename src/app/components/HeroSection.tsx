export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 max-w-3xl">
        Crack Your Interview with Expert Guidance 🚀
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl">
        Connect with top mentors across UPSC, Banking, IT, and more. Schedule sessions, practice mock interviews, and boost your confidence.
      </p>
      <div className="mt-6 flex gap-4">
        <a href="/student/auth/signin" className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
          Get Started as Student
        </a>
        <a href="/expert/auth/signin" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300">
          Join as Expert
        </a>
      </div>
    </section>
  );
}
