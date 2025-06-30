'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, PenTool, Stamp, Check, AlertCircle } from 'lucide-react';
import { UserProfile, dbManager } from '@/lib/indexedDB';
import { toast } from 'sonner';
import WaveBackground from '@/components/ui/wave-background';

interface UploadPanelProps {
  user: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
}

export default function UploadPanel({ user, onUserUpdate }: UploadPanelProps) {
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSignatureFile(file);
    }
  };

  const handleStampUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setStampFile(file);
    }
  };

  const handleSave = async () => {
    if (!signatureFile && !stampFile) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const updatedUser = { ...user };

      if (signatureFile) {
        updatedUser.signatureImage = signatureFile;
      }

      if (stampFile) {
        updatedUser.stampImage = stampFile;
      }

      await dbManager.saveUserProfile(updatedUser);
      onUserUpdate(updatedUser);

      toast.success('Signature and stamp uploaded successfully!');
      
      // Reset form
      setSignatureFile(null);
      setStampFile(null);
      if (signatureInputRef.current) signatureInputRef.current.value = '';
      if (stampInputRef.current) stampInputRef.current.value = '';

    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <WaveBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Upload Signatures & Stamps</h2>
          <p className="text-slate-600">
            Upload your personal signature and official stamp images for document endorsement
          </p>
        </div>

        {!user.isAuthenticated && (
          <Card className="backdrop-blur-sm bg-orange-50/80 border-orange-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="text-orange-800">
                  You're in demo mode. Uploaded images won't be processed for background removal. 
                  Sign in for full functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Signature Upload */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-sky-600" />
                <span>Digital Signature</span>
              </CardTitle>
              <CardDescription>
                Upload your handwritten signature image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-sky-200 rounded-lg p-6 text-center hover:border-sky-400 transition-colors">
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                  id="signature-upload"
                />
                <label htmlFor="signature-upload" className="cursor-pointer space-y-2">
                  {signatureFile ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(signatureFile)}
                          alt="Signature preview"
                          className="max-h-32 mx-auto rounded"
                        />
                        <Check className="h-6 w-6 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                      </div>
                      <p className="font-medium text-slate-700">{signatureFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(signatureFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <PenTool className="h-12 w-12 text-slate-400 mx-auto" />
                      <p className="text-slate-600">Upload Signature</p>
                      <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              {user.signatureImage && (
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-2">✓ Current signature uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stamp Upload */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stamp className="h-5 w-5 text-orange-600" />
                <span>Official Stamp</span>
              </CardTitle>
              <CardDescription>
                Upload your official stamp or seal image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  ref={stampInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStampUpload}
                  className="hidden"
                  id="stamp-upload"
                />
                <label htmlFor="stamp-upload" className="cursor-pointer space-y-2">
                  {stampFile ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(stampFile)}
                          alt="Stamp preview"
                          className="max-h-32 mx-auto rounded"
                        />
                        <Check className="h-6 w-6 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                      </div>
                      <p className="font-medium text-slate-700">{stampFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(stampFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Stamp className="h-12 w-12 text-slate-400 mx-auto" />
                      <p className="text-slate-600">Upload Stamp</p>
                      <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              {user.stampImage && (
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-2">✓ Current stamp uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Processing Info */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Background Removal Processing</CardTitle>
            <CardDescription>
              How your uploaded images will be processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">✨ For Authenticated Users</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Automatic background removal</li>
                  <li>• Edge enhancement and cleanup</li>
                  <li>• Optimized for endorsement</li>
                  <li>• Cloud processing and storage</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">📝 Demo Mode</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Images stored locally</li>
                  <li>• Basic processing only</li>
                  <li>• Full features with subscription</li>
                  <li>• Upgrade for advanced tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={(!signatureFile && !stampFile) || isUploading}
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold shadow-lg"
          >
            {isUploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Save Signatures
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}