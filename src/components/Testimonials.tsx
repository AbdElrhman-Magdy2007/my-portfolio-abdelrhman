
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent } from '@/components/ui/card';
// import { Quote } from 'lucide-react';
// import testimonialsData from '../data/testimonials.json';

// const Testimonials = () => {
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5 }
//     }
//   };

//   return (
//     <section id="testimonials" className="py-20 relative">
//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-accent/5 to-background/0 z-0"></div>
      
//       <div className="container px-4 mx-auto relative z-10">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }}
//           variants={containerVariants}
//         >
//           <motion.div variants={itemVariants} className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">Client Testimonials</h2>
//             <p className="text-lg text-gray-300 max-w-2xl mx-auto">
//               Don't just take my word for it. Here's what my clients have to say about working with me.
//             </p>
//             <div className="h-1 w-24 bg-secondary mx-auto mt-6"></div>
//           </motion.div>

//           <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonialsData.map((testimonial) => (
//               <motion.div
//                 key={testimonial.id}
//                 variants={itemVariants}
//                 whileHover={{ 
//                   y: -5,
//                   transition: { type: "spring", stiffness: 200 }
//                 }}
//               >
//                 <Card className="glass-card h-full">
//                   <CardContent className="p-6 flex flex-col h-full">
//                     <div className="mb-4 text-primary">
//                       <Quote size={32} />
//                     </div>
//                     <p className="text-gray-300 mb-6 flex-grow italic">"{testimonial.quote}"</p>
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 mr-4">
//                         <img 
//                           src={testimonial.avatar} 
//                           alt={testimonial.author}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-bold">{testimonial.author}</p>
//                         <p className="text-gray-400 text-sm">{testimonial.position}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
