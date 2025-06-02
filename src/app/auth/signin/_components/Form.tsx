'use client';

import { useState, useRef, useCallback, useReducer, memo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { InputTypes, Pages } from '@/constants/enums';
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
  const formFields = getFormFields().map(field => ({
    ...field,
    type: field.type as InputTypes
  }));

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
      color: '#F87171',
      backgroundColor: 'hsl(217 33% 17.5% / 0.2)',
      border: '1px solid hsl(3 81% 67% / 0.5)',
      borderRadius: '0.5rem',
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 500,
      boxShadow: '0 4px 12px hsl(215 91% 70% / 0.2)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    success: {
      color: '#34D399',
      backgroundColor: 'hsl(217 33% 17.5% / 0.2)',
      border: '1px solid hsl(160 64% 43% / 0.5)',
      borderRadius: '0.5rem',
      padding: '12px 16px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 500,
      boxShadow: '0 4px 12px hsl(215 91% 70% / 0.2)',
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

  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

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
              label={field.name === 'email' ? 'Email' : 'Password'}
              placeholder={field.name === 'email' ? 'Enter your email' : 'Enter your password'}
              error={errors[field.name]?.[0]}
              disabled={isLoading}
              onValidationChange={handleValidationChange}
              className={clsx(
                'w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700',
                'text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-blue-400',
                'transition-all duration-200 hover:shadow-md hover:shadow-blue-400/20'
              )}
            />
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
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin h-5 w-5" />
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </Button>
      </motion.div>
    </form>
  );
});

export default LoginForm;
