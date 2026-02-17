"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Info, User, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserStore } from "@/store/user";
import { updateProfile } from "@/lib/profileApi";
import { changePassword } from "@/lib/auth/changePassword";
import { useToast } from "@/hooks/use-toast";
import { useProfileDetail } from "@/hooks/useProfileDetail";

export default function AccountSettingsPage() {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();
  const { profile, isLoadingProfile, refetchProfile } = useProfileDetail();
  console.log("profile", profile);

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    address: "",
    profile_image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        contact: profile.contact || "",
        address: profile.address || "",
        // Don't set profile_image initially as it's for file upload
        profile_image: null,
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileForm({ ...profileForm, profile_image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;

    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const formData = new FormData();
      formData.append("first_name", profileForm.first_name);
      formData.append("last_name", profileForm.last_name);
      formData.append("email", profileForm.email);
      formData.append("contact", profileForm.contact);
      formData.append("addresse", profileForm.address);
      if (profileForm.profile_image) {
        formData.append("image", profileForm.profile_image);
      }

      const updatedUser = await updateProfile({
        id: profile.id,
        profile: formData,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
        variant: "success"
      });

      // Update local store and refetch profile to ensure consistency
      setUser(updatedUser);
      refetchProfile();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    try {
      await changePassword({
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });
      toast({
        title: "Success",
        variant: "success",
        description: "Password changed successfully.",
      });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please check your current password requirements.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Edit your personal information and manage account security.
          </p>
        </div>

        <Card className="border border-gray-200 shadow-none bg-transparent">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileForm.first_name}
                      onChange={handleProfileChange}
                      className="py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileForm.last_name}
                      onChange={handleProfileChange}
                      className="py-6"
                    />
                  </div>
                </div>

                {/* Contact and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone Number</Label>
                    <Input
                      id="contact"
                      value={profileForm.contact}
                      onChange={handleProfileChange}
                      className="py-6"
                      placeholder="+251..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      className="py-6"
                      placeholder="Addis Ababa, ..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={loading.profile}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {loading.profile && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Profile
                  </Button>
                </div>

                <div className="border-t border-gray-200 my-8 pt-8">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                  {/* Password */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="py-6 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="py-6 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={loading.password || !passwordForm.newPassword || !passwordForm.confirmPassword}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {loading.password && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4 relative h-fit">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={previewImage || profile?.image || "/placeholder-avatar.png"}
                    alt="User avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {profile?.first_name?.charAt(0)}
                    {profile?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Upload button */}
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer absolute bottom-0 left-[calc(50%-18px)] bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Click camera icon to change
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
