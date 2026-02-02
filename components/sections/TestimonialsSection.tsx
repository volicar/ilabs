import { testimonials } from '@/lib/config';
import TestimonialCard from '@/components/ui/TestimonialCard';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 mt-4 mb-4">
            O que nossos pacientes dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              text={testimonial.text}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
