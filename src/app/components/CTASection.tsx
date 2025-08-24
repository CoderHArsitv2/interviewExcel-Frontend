export default function CTASection() {
  return (
    <section className="py-20 bg-blue-600 text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold">
        Ready to Excel in Your Interview?
      </h2>
      <p className="mt-4 text-lg max-w-xl mx-auto">
        Join InterviewExcel today and start learning from the best mentors.
      </p>
      <div className="mt-6 flex gap-4 justify-center">
        <a href="/student/auth/signin" className="px-6 py-3 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-100">
          Get Started as Student
        </a>
        <a href="/expert/auth/signin" className="px-6 py-3 border border-white rounded-xl shadow hover:bg-blue-700">
          Become an Expert
        </a>
      </div>
    </section>
  );
}
