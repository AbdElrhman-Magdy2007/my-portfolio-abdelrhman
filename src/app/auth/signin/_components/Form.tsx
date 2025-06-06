'use client';

import { useState, useRef, useCallback, useReducer, memo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { Pages, InputTypes } from '@/constants/enums';
import useFormFields from '@/hooks/useFormFields';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { Loader } from 'lucide-react';
import FormFields from '@/components/from-fields/from-fieds';

// Interface for form errors
interface FormErrors {
  [key: string]: string[];
}

// Reducer for managing form errors
type FormAction =
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'CLEAR_ERRORS' };

const errorsReducer = (state: FormErrors, action: FormAction): FormErrors => {
  switch (action.type) {
    case 'SET_ERRORS':
      return { ...state, ...action.payload };
    case 'CLEAR_ERRORS':
      return {};
    default:
      return state;
  }
};

const LoginForm = memo(() => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastToastMessage, setLastToastMessage] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [errors, dispatchErrors] = useReducer(errorsReducer, {});
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const params = useParams();

  const { getFormFields } = useFormFields({ slug: Pages.LOGIN });
  const formFields = getFormFields();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formRef.current || !isFormValid) return;

      const formData = new FormData(formRef.current);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });

      const newErrors: FormErrors = {};
      if (!data.email) newErrors.email = ['Email is required'];
      if (!data.password) newErrors.password = ['Password is required'];

      if (Object.keys(newErrors).length > 0) {
        dispatchErrors({ type: 'SET_ERRORS', payload: newErrors });
        toast.error('Please fill in all required fields', {
          style: toastStyles.error,
          duration: 3000,
          className: 'glass-card border-gradient animate-glow toast-error',
        });
        return;
      }

      try {
        setIsLoading(true);
        dispatchErrors({ type: 'CLEAR_ERRORS' });

        const res = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (res?.error) {
          try {
            const parsedError = JSON.parse(res.error);
            const validationErrors = parsedError.validationError || {};

            dispatchErrors({ type: 'SET_ERRORS', payload: validationErrors });
            if (
              parsedError.responseError &&
              parsedError.responseError !== lastToastMessage
            ) {
              toast.error(parsedError.responseError, {
                style: toastStyles.error,
                duration: 3000,
                className: 'glass-card border-gradient animate-glow toast-error',
              });
              setLastToastMessage(parsedError.responseError);
            }
          } catch (parseError) {
            if ('An unexpected error occurred' !== lastToastMessage) {
              toast.error('An unexpected error occurred', {
                style: toastStyles.error,
                duration: 3000,
                className: 'glass-card border-gradient animate-glow toast-error',
              });
              setLastToastMessage('An unexpected error occurred');
            }
          }
        }

        if (res?.ok) {
          if ('Login successful' !== lastToastMessage) {
            toast.success('Login successful', {
              style: toastStyles.success,
              duration: 3000,
              className: 'glass-card border-gradient animate-glow toast-success',
            });
            setLastToastMessage('Login successful');
          }
          router.replace('/');
        }
      } catch (error) {
        if ('An unexpected error occurred' !== lastToastMessage) {
          toast.error('An unexpected error occurred', {
            style: toastStyles.error,
            duration: 3000,
            className: 'glass-card border-gradient animate-glow toast-error',
          });
          setLastToastMessage('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, lastToastMessage, isFormValid]
  );

  const toastStyles = {
    error: {
      color: '#F87171', // red-400
      backgroundColor: 'hsl(217 33% 17.5% / 0.2)', // slate-900/20
      border: '1px solid hsl(3 81% 67% / 0.5)', // red-400/50
      borderRadius: '0.5rem',
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem', // text-sm
      fontWeight: 500,
      boxShadow: '0 4px 12px hsl(215 91% 70% / 0.2)', // shadow-blue-400/20
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    success: {
      color: '#34D399', // green-400
      backgroundColor: 'hsl(217 33% 17.5% / 0.2)', // slate-900/20
      border: '1px solid hsl(160 64% 43% / 0.5)', // green-400/50
      borderRadius: '0.5rem',
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem', // text-sm
      fontWeight: 500,
      boxShadow: '0 4px 12px hsl(215 91% 70% / 0.2)', // shadow-blue-400/20
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative' as const,
      overflow: 'hidden',
    },
  };

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

  const toastVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      x: 50,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  function handleValidationChange(isValid: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form
      className={clsx(
        'space-y-6 w-full max-w-md mx-auto p-6 sm:p-8',
        'glass-card border-gradient animate-glow',
        'transition-all duration-300'
      )}
      onSubmit={onSubmit}
      ref={formRef}
      dir="ltr"
    >
      <div className="relative">
        {formFields.map((field, index) => (
          <motion.div
            key={field.name || index}
            className="space-y-3 relative"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <FormFields
              {...field}
              type={field.type === 'email' ? InputTypes.EMAIL : InputTypes.PASSWORD}
              label={field.name === 'email' ? 'Email' : 'Password'}
              placeholder={field.name === 'email' ? 'Enter your email' : 'Enter your password'}
              pattern={field.type === 'email' ? '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' : '.*'}
              error={errors[field.name]?.[0]}
              disabled={isLoading}
              onValidationChange={handleValidationChange}
              ariaLabel={field.label || field.name}
              className={clsx(
                'w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700',
                'text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-blue-400',
                'transition-all duration-200 hover:shadow-md hover:shadow-blue-400/20'
              )}
            />
            {field.name === 'email' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: (document.activeElement as HTMLInputElement)?.name === 'email' ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`sparkle-field-${i}`}
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
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        custom={formFields.length}
      >
        <Button
          type="submit"
          className={clsx(
            'w-full font-semibold rounded-lg py-2 px-4 transition-all duration-200',
            'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500',
            'text-white border-gradient',
            (isLoading || !isFormValid) && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isLoading || !isFormValid}
          onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
          onClick={(e) => createSparkle(e.clientX, e.clientY)}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Login'
          )}
        </Button>
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
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;