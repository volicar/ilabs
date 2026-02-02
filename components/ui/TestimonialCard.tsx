import { Star, Users } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
}

export default function TestimonialCard({ name, text, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="text-yellow-400" size={20} fill="currentColor" />
        ))}
      </div>
      <p className="text-slate-600 mb-6 text-sm sm:text-base italic">"{text}"</p>
      <div className="flex items-center space-x-3">
        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-400 rounded-full flex items-center justify-center">
          <Users className="text-white" size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{name}</h4>
          <p className="text-xs sm:text-sm text-slate-500">Paciente</p>
        </div>
      </div>
    </div>
  );
}
