import { Users, Calendar, Video } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Marketplace",
    description: "Find mentors in UPSC, Banking, IT, and many more fields."
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book your mock interview sessions in just a few clicks."
  },
  {
    icon: Video,
    title: "Video Interviews",
    description: "Practice in a real interview setting using our built-in platform."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
            >
              <f.icon className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
