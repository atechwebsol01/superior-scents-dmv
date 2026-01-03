import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// Validation Schema
const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // DEMO MODE: Simulate sign up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sign up data:', data);
      
      // In demo mode, just redirect to login
      onSuccess?.();
    } catch (err) {
      setError('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Password Field */}
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Create a password"
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Confirm Password Field */}
      <Input
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isLoading}
        className="py-3"
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
