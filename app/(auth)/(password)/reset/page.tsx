"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { handleSubmit, register, formState, setError, watch } = useForm();
  const { errors } = formState;
  const password = watch("password");

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // TODO: Implement password reset API call
      // await resetPassword({ token, password: data.password });
    } catch (err: any) {
      setError("root", { message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            Reset Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors?.password && (
                  <p className="text-red-400 text-sm">
                    {errors?.password?.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors?.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {errors?.confirmPassword?.message as string}
                  </p>
                )}
              </div>
            </div>

            {errors?.root && (
              <p className="text-red-400 text-sm text-center">
                {errors?.root?.message as string}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !token}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          {/* Back to login link */}
          <Link
            href="/signin"
            className="text-zinc-600 hover:text-zinc-700 text-sm font-medium"
          >
            Back to Signin
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
