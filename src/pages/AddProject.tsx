import React from 'react';
import '../index.css';

const SdsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">SDS Page</h1>
            <p className="text-lg text-gray-600">Welcome to our beautiful page</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative group">
                  <img
                    src="/placeholder-image.jpg"
                    alt="SDS Image"
                    className="w-full h-[400px] object-cover rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">About This Page</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This is a beautifully designed page with modern styling and responsive layout.
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 w-fit transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SdsPage; 

// import '../index.css';
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/hooks/use-toast';
// import { useLanguage } from '@/components/LanguageProvider';
// import { useTheme } from '@/components/ThemeProvider';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import { File, Github, Link, Send } from 'lucide-react';

// // Components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// // Form schema with validation
// const formSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must not exceed 100 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters"),
//   technologies: z.string().min(2, "Please add at least one technology"),
//   category: z.string().min(1, "Please select a category"),
//   liveDemo: z.string().url("Please enter a valid URL").or(z.string().length(0)),
//   github: z.string().url("Please enter a valid URL").or(z.string().length(0)),
//   image: z.instanceof(File).optional(),
//   __honeypot: z.string().length(0, "Bot detected"), // Honeypot field for bot protection
// });

// type FormData = z.infer<typeof formSchema>;

// const SdsPage = () => {
//   const { t, language, dir } = useLanguage();
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
  
//   // React Hook Form with Zod validation
//   const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       technologies: '',
//       category: '',
//       liveDemo: '',
//       github: '',
//       __honeypot: '',
//     }
//   });

//   // File change handler
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file type
//       if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
//         toast({
//           title: t('form.invalidImage'),
//           description: t('form.imageTypesAllowed'),
//           variant: "destructive",
//         });
//         return;
//       }
      
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           title: t('form.imageTooLarge'),
//           description: t('form.imageMaxSize'),
//           variant: "destructive",
//         });
//         return;
//       }
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };
  
//   // Form submission handler
//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsSubmitting(true);
      
//       // In a real implementation, we would:
//       // 1. Validate the honeypot (if __honeypot is filled, it's a bot - silently reject)
//       if (data.__honeypot) {
//         // We silently "succeed" for bots but don't actually do anything
//         console.log("Bot submission detected");
//         setTimeout(() => {
//           setIsSubmitting(false);
//           reset();
//           setPreviewImage(null);
//           navigate('/projects');
//         }, 1500);
//         return;
//       }
      
//       // 2. Upload the image to Supabase Storage
//       // 3. Save the project data to Supabase Table
//       // 4. Handle success/error responses
      
//       // Mock successful submission for now
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       toast({
//         title: t('project.addSuccess'),
//         description: t('project.projectAddedSuccessfully'),
//       });
      
//       // Reset form and redirect to projects page
//       reset();
//       setPreviewImage(null);
//       navigate('/projects');
      
//     } catch (error) {
//       console.error("Error submitting project:", error);
//       toast({
//         title: t('error.submitFailed'),
//         description: t('error.pleaseTryAgain'),
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.8,
//         staggerChildren: 0.1
//       }
//     }
//   };
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0, 
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };
  
//   const headerVariants = {
//     hidden: { y: -20, opacity: 0 },
//     visible: {
//       y: 0, 
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };
  
//   const underlineVariants = {
//     hidden: { width: 0 },
//     visible: {
//       width: "100%",
//       transition: {
//         delay: 0.3,
//         duration: 0.6,
//         ease: "easeInOut"
//       }
//     }
//   };

//   // Translate form field labels based on language
//   const getFieldLabel = (key: string) => {
//     const labels: Record<string, Record<string, string>> = {
//       title: {
//         en: 'Project Title',
//         ar: 'عنوان المشروع',
//         fr: 'Titre du projet',
//         es: 'Título del proyecto'
//       },
//       description: {
//         en: 'Project Description',
//         ar: 'وصف المشروع',
//         fr: 'Description du projet',
//         es: 'Descripción del proyecto'
//       },
//       technologies: {
//         en: 'Technologies Used (comma separated)',
//         ar: 'التقنيات المستخدمة (مفصولة بفواصل)',
//         fr: 'Technologies utilisées (séparées par des virgules)',
//         es: 'Tecnologías utilizadas (separadas por comas)'
//       },
//       category: {
//         en: 'Project Category',
//         ar: 'فئة المشروع',
//         fr: 'Catégorie du projet',
//         es: 'Categoría del proyecto'
//       },
//       liveDemo: {
//         en: 'Live Demo Link (optional)',
//         ar: 'رابط العرض المباشر (اختياري)',
//         fr: 'Lien de la démo en direct (facultatif)',
//         es: 'Enlace de la demo en vivo (opcional)'
//       },
//       github: {
//         en: 'GitHub Link (optional)',
//         ar: 'رابط GitHub (اختياري)',
//         fr: 'Lien GitHub (facultatif)',
//         es: 'Enlace de GitHub (opcional)'
//       },
//       image: {
//         en: 'Project Image',
//         ar: 'صورة المشروع',
//         fr: 'Image du projet',
//         es: 'Imagen del proyecto'
//       },
//       submit: {
//         en: 'Submit Project',
//         ar: 'إرسال المشروع',
//         fr: 'Soumettre le projet',
//         es: 'Enviar proyecto'
//       }
//     };
    
//     return labels[key][language] || labels[key]['en'];
//   };

//   // Category translations
//   const getCategoryLabel = (key: string) => {
//     const categories: Record<string, Record<string, string>> = {
//       ecommerce: {
//         en: 'E-Commerce',
//         ar: 'التجارة الإلكترونية',
//         fr: 'Commerce électronique',
//         es: 'Comercio electrónico'
//       },
//       saas: {
//         en: 'SaaS',
//         ar: 'برمجيات كخدمة',
//         fr: 'SaaS',
//         es: 'SaaS'
//       },
//       webapp: {
//         en: 'Web App',
//         ar: 'تطبيق ويب',
//         fr: 'Application web',
//         es: 'Aplicación web'
//       },
//       mobile: {
//         en: 'Mobile App',
//         ar: 'تطبيق جوال',
//         fr: 'Application mobile',
//         es: 'Aplicación móvil'
//       },
//       other: {
//         en: 'Other',
//         ar: 'أخرى',
//         fr: 'Autre',
//         es: 'Otro'
//       }
//     };
    
//     return categories[key][language] || categories[key]['en'];
//   };

//   // Page title translation
//   const pageTitle = {
//     en: 'Add a New Project',
//     ar: 'إضافة مشروع جديد',
//     fr: 'Ajouter un nouveau projet',
//     es: 'Añadir un nuevo proyecto'
//   }[language] || 'Add a New Project';
  
//   // Page subtitle translation
//   const pageSubtitle = {
//     en: 'Share your creations with the world!',
//     ar: 'شارك إبداعاتك مع العالم!',
//     fr: 'Partagez vos créations avec le monde !',
//     es: '¡Comparte tus creaciones con el mundo!'
//   }[language] || 'Share your creations with the world!';

//   return (
//     <div className="min-h-screen bg-background text-foreground" dir={dir}>
//       <Header />
      
//       <main className="container mx-auto px-4 py-16 mt-20">
//         {/* Hero section */}
//         <motion.div 
//           className="text-center mb-10"
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           <motion.h1 
//             className="text-4xl md:text-5xl font-bold mb-4" 
//             variants={headerVariants}
//           >
//             {pageTitle}
//           </motion.h1>
          
//           <motion.div 
//             className="w-24 h-1 mx-auto bg-gradient-to-r from-primary to-secondary mb-6" 
//             variants={underlineVariants}
//           />
          
//           <motion.p 
//             className="text-lg text-muted-foreground max-w-2xl mx-auto" 
//             variants={itemVariants}
//           >
//             {pageSubtitle}
//           </motion.p>
//         </motion.div>
      
//         {/* Project submission form */}
//         <motion.div 
//           className="max-w-2xl mx-auto"
//           initial="hidden"
//           animate="visible" 
//           variants={containerVariants}
//         >
//           <Card className="shadow-lg backdrop-blur-md border border-border">
//             <CardHeader>
//               <CardTitle>{t('project.newProject')}</CardTitle>
//               <CardDescription>{t('project.fillDetails')}</CardDescription>
//             </CardHeader>
            
//             <CardContent>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Honeypot field - hidden from users but visible to bots */}
//                 <input 
//                   type="text" 
//                   {...register('__honeypot')} 
//                   className="hidden" 
//                   tabIndex={-1} 
//                   autoComplete="off" 
//                 />
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="title" className="flex items-center gap-1">
//                     {getFieldLabel('title')} <span className="text-destructive">*</span>
//                   </Label>
//                   <Input 
//                     id="title" 
//                     {...register('title')} 
//                     className={errors.title ? 'border-destructive' : ''}
//                   />
//                   {errors.title && (
//                     <p className="text-sm text-destructive">{errors.title.message}</p>
//                   )}
//                 </motion.div>
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="description" className="flex items-center gap-1">
//                     <File className="h-4 w-4" /> {getFieldLabel('description')} <span className="text-destructive">*</span>
//                   </Label>
//                   <Textarea 
//                     id="description" 
//                     {...register('description')} 
//                     rows={5} 
//                     className={errors.description ? 'border-destructive' : ''}
//                   />
//                   {errors.description && (
//                     <p className="text-sm text-destructive">{errors.description.message}</p>
//                   )}
//                 </motion.div>
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="technologies" className="flex items-center gap-1">
//                     {getFieldLabel('technologies')} <span className="text-destructive">*</span>
//                   </Label>
//                   <Input 
//                     id="technologies" 
//                     {...register('technologies')} 
//                     placeholder="React, Next.js, TypeScript, etc."
//                     className={errors.technologies ? 'border-destructive' : ''}
//                   />
//                   {errors.technologies && (
//                     <p className="text-sm text-destructive">{errors.technologies.message}</p>
//                   )}
//                 </motion.div>

//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="category" className="flex items-center gap-1">
//                     {getFieldLabel('category')} <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     name="category"
//                     control={control}
//                     render={({ field }) => (
//                       <Select 
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
//                           <SelectValue placeholder="Select a category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="ecommerce">{getCategoryLabel('ecommerce')}</SelectItem>
//                           <SelectItem value="saas">{getCategoryLabel('saas')}</SelectItem>
//                           <SelectItem value="webapp">{getCategoryLabel('webapp')}</SelectItem>
//                           <SelectItem value="mobile">{getCategoryLabel('mobile')}</SelectItem>
//                           <SelectItem value="other">{getCategoryLabel('other')}</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.category && (
//                     <p className="text-sm text-destructive">{errors.category.message}</p>
//                   )}
//                 </motion.div>
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="liveDemo" className="flex items-center gap-1">
//                     <Link className="h-4 w-4" /> {getFieldLabel('liveDemo')}
//                   </Label>
//                   <Input 
//                     id="liveDemo" 
//                     {...register('liveDemo')} 
//                     placeholder="https://"
//                     className={errors.liveDemo ? 'border-destructive' : ''}
//                   />
//                   {errors.liveDemo && (
//                     <p className="text-sm text-destructive">{errors.liveDemo.message}</p>
//                   )}
//                 </motion.div>
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="github" className="flex items-center gap-1">
//                     <Github className="h-4 w-4" /> {getFieldLabel('github')}
//                   </Label>
//                   <Input 
//                     id="github" 
//                     {...register('github')} 
//                     placeholder="https://github.com/"
//                     className={errors.github ? 'border-destructive' : ''}
//                   />
//                   {errors.github && (
//                     <p className="text-sm text-destructive">{errors.github.message}</p>
//                   )}
//                 </motion.div>
                
//                 <motion.div className="space-y-2" variants={itemVariants}>
//                   <Label htmlFor="image" className="flex items-center gap-1">
//                     {getFieldLabel('image')} <span className="text-destructive">*</span>
//                   </Label>
//                   <div 
//                     className={`border-2 border-dashed rounded-lg p-6 transition-all text-center cursor-pointer hover:bg-accent/50 ${errors.image ? 'border-destructive' : 'border-muted'}`}
//                     onClick={() => document.getElementById('image')?.click()}
//                   >
//                     <input
//                       id="image"
//                       type="file"
//                       accept="image/jpeg,image/png,image/webp"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
                    
//                     {previewImage ? (
//                       <div className="space-y-4">
//                         <img 
//                           src={previewImage} 
//                           alt="Project preview" 
//                           className="mx-auto max-h-48 rounded-md"
//                         />
//                         <p className="text-sm text-muted-foreground">
//                           {t('form.clickToChange')}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         <div className="flex justify-center">
//                           <svg 
//                             xmlns="http://www.w3.org/2000/svg" 
//                             className="h-10 w-10 text-muted-foreground"
//                             fill="none" 
//                             viewBox="0 0 24 24" 
//                             stroke="currentColor"
//                           >
//                             <path 
//                               strokeLinecap="round" 
//                               strokeLinejoin="round" 
//                               strokeWidth={1.5} 
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-sm font-medium">
//                           {t('form.dragDropImage')}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {t('form.imageRequirements')}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                   {errors.image && (
//                     <p className="text-sm text-destructive">{errors.image.message}</p>
//                   )}
//                 </motion.div>
//               </form>
//             </CardContent>
            
//             <CardFooter>
//               <motion.div 
//                 className="w-full flex flex-col-reverse sm:flex-row gap-3 justify-end"
//                 variants={itemVariants}
//               >
//                 <Button 
//                   variant="outline" 
//                   onClick={() => navigate('/projects')}
//                   disabled={isSubmitting}
//                 >
//                   {t('button.cancel')}
//                 </Button>
                
//                 <Button 
//                   onClick={handleSubmit(onSubmit)} 
//                   disabled={isSubmitting}
//                   className="relative overflow-hidden gap-2"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center gap-2">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       {t('form.submitting')}
//                     </div>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4" />
//                       {getFieldLabel('submit')}
//                     </>
//                   )}
//                 </Button>
//               </motion.div>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default SdsPage;
