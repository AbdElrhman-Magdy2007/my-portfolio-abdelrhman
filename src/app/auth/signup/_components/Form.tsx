'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { InputTypes, Pages, Routes } from '@/constants/enums';
import useFormFields from '@/hooks/useFormFields';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import FormFields from '@/components/from-fields/from-fieds';
import { ValidationError } from '@/app/validations/auth';
import { IFormField } from '@/app/types/app';
import { signup } from '@/app/server/_actions/auth';

// Define state type
interface FormState {
  message: string;
  error: string | Record<string, string[]> | undefined;
  status: number;
  formData: FormData | undefined;
}

const initialState: FormState = {
  message: '',
  error: {},
  status: 0,
  formData: undefined,
};

// Custom toast component
const CustomToast = ({ message, type, id }: { message: string; type: 'success' | 'error'; id: string | number }) => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const createSparkle = (x: number, y: number) => {
    const sparkleId = Date.now();
    const size = Math.random() * 6 + 2; // Vary sparkle size between 2px and 8px
    setSparkles((prev) => [
      ...prev,
      { id: sparkleId, x: x + Math.random() * 10 - 5, y: y + Math.random() * 10 - 5, size },
    ]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== sparkleId)), 800);
  };

  return (
    <motion.div
      className={clsx(
        'glass-card border-gradient max-w-sm w-full p-4 rounded-xl shadow-lg',
        'bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg',
        'text-white text-sm font-medium font-["Inter"]',
        type === 'success' ? 'border-blue-500/60' : 'border-red-500/60',
        'hover:shadow-xl hover:shadow-blue-500/20 transition-shadow duration-300'
      )}
      initial={{ opacity: 0, x: 120, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-6 h-6 text-red-400" />
          </motion.div>
        )}
        <span className="flex-1 leading-relaxed">{message}</span>
        <button
          className={clsx(
            'sparkle-container relative p-1.5 rounded-full',
            'hover:bg-blue-500/20 transition-colors duration-200'
          )}
          onClick={() => toast.dismiss(id)}
          onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
          onClickCapture={(e) => createSparkle(e.clientX, e.clientY)}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            key={`ripple-${id}`}
          />
          <X className="w-5 h-5 text-white relative z-10" />
        </button>
      </div>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="sparkle absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: 'linear-gradient(135deg, hsl(215 91% 70% / 0.9), hsl(271 81% 75% / 0.9))',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
          }}
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={{ scale: 2, opacity: 0, rotate: 360 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};

function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(signup, initialState);
  const [lastToastMessage, setLastToastMessage] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const params = useParams();

  const { getFormFields } = useFormFields({ slug: Pages.Register });

  // Handle notifications and redirection
  useEffect(() => {
    if (
      state.status &&
      state.message &&
      state.message !== lastToastMessage
    ) {
      const isSuccess = state.status === 201;
      toast.custom((t) => (
        <CustomToast message={state.message!} type={isSuccess ? 'success' : 'error'} id={t} />
      ), {
        duration: 3000,
        position: 'top-right',
        style: {
          marginTop: '20px',
          marginRight: '20px',
        },
      });
      setLastToastMessage(state.message);

      if (isSuccess) {
        router.replace(`/${Routes.AUTH}/${Pages.LOGIN}`);
      }
    }
  }, [router, state.message, state.status, lastToastMessage]);

  const createSparkle = (x: number, y: number) => {
    const id = Date.now();
    setSparkles((prev) => [...prev, { id, x: x + Math.random() * 8 - 4, y: y + Math.random() * 8 - 4 }]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 600);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 90,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <form
      action={formAction}
      className={clsx(
        'space-y-6 w-full max-w-md mx-auto p-6 sm:p-8',
        'glass-card border-gradient animate-glow',
        'transition-all duration-300'
      )}
      dir="ltr"
    >
      <div className="relative">
        {getFormFields().map((field: IFormField, index: number) => {
          const fieldValue = state.formData?.get(field.name);
          return (
            <motion.div
              key={field.name}
              className="space-y-3 relative mb-4"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <FormFields
                {...field}
                type={field.type as InputTypes}
                label={
                  field.name === 'email' ? 'Email' :
                  field.name === 'password' ? 'Password' :
                  field.name === 'username' ? 'Username' : field.name
                }
                placeholder={
                  field.name === 'email' ? 'Enter your email' :
                  field.name === 'password' ? 'Enter your password' :
                  field.name === 'username' ? 'Choose a username' : `Enter your ${field.name}`
                }
                error={
                  state.error && typeof state.error === 'object'
                    ? Array.isArray(state.error[field.name])
                      ? (state.error[field.name] as string[]).join(', ')
                      : state.error[field.name] as unknown as string
                    : undefined
                }
                value={fieldValue as string}
                disabled={state.status === 0}
                pattern={field.pattern ?? ""}
                options={field.options}
                className={clsx(
                  'w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700',
                  'text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-blue-400',
                  'transition-all duration-200 hover:shadow-md hover:shadow-blue-400/20'
                )}
                ariaLabel={field.ariaLabel ?? ""}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: typeof window !== 'undefined' && (document.activeElement as HTMLInputElement)?.name === field.name ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`sparkle-field-${field.name}-${i}`}
                    className="sparkle"
                    style={{
                      width: `${Math.random() * 2 + 2}px`,
                      height: `${Math.random() * 2 + 2}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.8, 0],
                      rotate: [0, 180],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: Math.random() * 0.5,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        custom={getFormFields().length}
      >
        <Button
          type="submit"
          className={clsx(
            'w-full font-medium rounded-lg shadow-md py-2 px-4 transition-all duration-200',
            'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500',
            'text-white border-gradient',
            state.status === 0 && 'opacity-50 cursor-not-allowed'
          )}
          disabled={state.status === 0}
          onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
          onClick={(e) => createSparkle(e.clientX, e.clientY)}
          aria-label="Register"
        >
          {state.status === 0 ? (
            <>
              <Loader className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Registering...</span>
            </>
          ) : (
            'Register'
          )}
        </Button>
      </motion.div>
      <motion.div
        className="text-center text-slate-300 text-sm"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        custom={getFormFields().length + 1}
      >
        
        {/* <span className="sparkle-container relative inline-block">
          <Link
            href={`/${Routes.AUTH}/${Pages.LOGIN}`}
            className={clsx(
              'text-purple-400 hover:underline animate-reveal-text delay-200 relative group'
            )}
            onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
            onClick={(e) => createSparkle(e.clientX, e.clientY)}
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-50 transition-opacity duration-600 rounded-full" />
          </Link>
        </span> */}
      </motion.div>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="sparkle absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: 8,
            height: 8,
            background: 'linear-gradient(135deg, hsl(215 91% 70% / 0.8), hsl(271 81% 75% / 0.8))',
          }}
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={{ scale: 2, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </form>
  );
}

export default RegisterForm;