import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Users, 
  Briefcase,
  Calendar,
  MessageSquare,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

import FormProgress from '@/components/form/FormProgress';
import FormStep from '@/components/form/FormStep';
import InputField from '@/components/form/InputField';
import SelectField from '@/components/form/SelectField';
import CheckboxField from '@/components/form/CheckboxField';
import FileUploadField from '@/components/form/FileUploadField';
import PrioritySelector from '@/components/form/PrioritySelector';
import SuccessScreen from '@/components/form/SuccessScreen';

const STEPS = [
  { id: 'personal', title: 'Personal Info', subtitle: 'Basic details' },
  { id: 'type', title: 'Submission Type', subtitle: 'Category selection' },
  { id: 'details', title: 'Details', subtitle: 'Additional info' },
  { id: 'review', title: 'Review', subtitle: 'Confirm & submit' }
];

const SUBMISSION_TYPES = [
  { value: 'personal', label: 'Personal', icon: User },
  { value: 'business', label: 'Business', icon: Building2 },
  { value: 'partnership', label: 'Partnership', icon: Users }
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
];

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' }
];

const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  submission_type: '',
  company_name: '',
  company_size: '',
  industry: '',
  message: '',
  attachments: [],
  priority: 'medium',
  newsletter: false,
  terms_accepted: false,
  status: 'draft'
};

export default function SubmissionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Auto-save draft
  useEffect(() => {
    const savedData = localStorage.getItem('submission_draft');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData);
      setCurrentStep(parsed.currentStep || 0);
    }
  }, []);

  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    localStorage.setItem('submission_draft', JSON.stringify({
      formData,
      currentStep
    }));
    await new Promise(r => setTimeout(r, 500));
    setLastSaved(new Date());
    setIsSaving(false);
  }, [formData, currentStep]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.first_name || formData.email) {
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [formData, saveDraft]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (step === 1) {
      if (!formData.submission_type) newErrors.submission_type = 'Please select a submission type';
      if (formData.submission_type === 'business') {
        if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
      }
    }
    
    if (step === 3) {
      if (!formData.terms_accepted) newErrors.terms_accepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    const submitData = {
      ...formData,
      status: 'submitted',
      attachments: formData.attachments.map(f => f.url)
    };
    
    const result = await base44.entities.Submission.create(submitData);
    localStorage.removeItem('submission_draft');
    setSubmissionId(result.id);
    setIsComplete(true);
    setIsSubmitting(false);
  };

  const handleNewSubmission = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsComplete(false);
    setSubmissionId(null);
    setErrors({});
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
          <SuccessScreen 
            submissionId={submissionId} 
            onNewSubmission={handleNewSubmission}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Advanced Form
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Submit Your Request
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Complete the form below to submit your request. All fields marked with * are required.
          </p>
        </motion.div>

        {/* Main form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-10">
              {/* Progress */}
              <FormProgress 
                steps={STEPS} 
                currentStep={currentStep}
                onStepClick={goToStep}
              />

              {/* Form steps */}
              <div className="min-h-[400px]">
                <FormStep direction={direction} stepKey={currentStep}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField
                          label="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={(v) => updateField('first_name', v)}
                          placeholder="John"
                          icon={User}
                          required
                          error={errors.first_name}
                        />
                        <InputField
                          label="Last Name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={(v) => updateField('last_name', v)}
                          placeholder="Doe"
                          icon={User}
                          required
                          error={errors.last_name}
                        />
                      </div>
                      
                      <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(v) => updateField('email', v)}
                        placeholder="john@example.com"
                        icon={Mail}
                        required
                        error={errors.email}
                        helpText="We'll never share your email with anyone else"
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(v) => updateField('phone', v)}
                          placeholder="+1 (555) 000-0000"
                          icon={Phone}
                          error={errors.phone}
                        />
                        <InputField
                          label="Date of Birth"
                          name="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(v) => updateField('date_of_birth', v)}
                          icon={Calendar}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Submission Type */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <SelectField
                        label="Submission Type"
                        name="submission_type"
                        value={formData.submission_type}
                        onChange={(v) => updateField('submission_type', v)}
                        options={SUBMISSION_TYPES}
                        placeholder="Select type..."
                        required
                        error={errors.submission_type}
                      />

                      <AnimatePresence>
                        {(formData.submission_type === 'business' || formData.submission_type === 'partnership') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <InputField
                              label="Company Name"
                              name="company_name"
                              value={formData.company_name}
                              onChange={(v) => updateField('company_name', v)}
                              placeholder="Acme Inc."
                              icon={Building2}
                              required={formData.submission_type === 'business'}
                              error={errors.company_name}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <SelectField
                                label="Company Size"
                                name="company_size"
                                value={formData.company_size}
                                onChange={(v) => updateField('company_size', v)}
                                options={COMPANY_SIZES}
                                placeholder="Select size..."
                                icon={Users}
                              />
                              <SelectField
                                label="Industry"
                                name="industry"
                                value={formData.industry}
                                onChange={(v) => updateField('industry', v)}
                                options={INDUSTRIES}
                                placeholder="Select industry..."
                                icon={Briefcase}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Step 3: Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <InputField
                        label="Message"
                        name="message"
                        type="textarea"
                        value={formData.message}
                        onChange={(v) => updateField('message', v)}
                        placeholder="Tell us more about your request..."
                        icon={MessageSquare}
                        rows={5}
                        helpText="Be as detailed as possible"
                      />

                      <PrioritySelector
                        value={formData.priority}
                        onChange={(v) => updateField('priority', v)}
                        label="Priority Level"
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Attachments
                        </label>
                        <FileUploadField
                          value={formData.attachments}
                          onChange={(v) => updateField('attachments', v)}
                          maxFiles={5}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      {/* Summary */}
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Review Your Submission</h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium text-gray-900">{formData.first_name} {formData.last_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{formData.email}</p>
                          </div>
                          {formData.phone && (
                            <div>
                              <p className="text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{formData.phone}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium text-gray-900 capitalize">{formData.submission_type}</p>
                          </div>
                          {formData.company_name && (
                            <div>
                              <p className="text-gray-500">Company</p>
                              <p className="font-medium text-gray-900">{formData.company_name}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Priority</p>
                            <p className="font-medium text-gray-900 capitalize">{formData.priority}</p>
                          </div>
                        </div>
                        
                        {formData.message && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">Message</p>
                            <p className="text-gray-900 mt-1">{formData.message}</p>
                          </div>
                        )}
                        
                        {formData.attachments.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">Attachments</p>
                            <p className="text-gray-900 mt-1">{formData.attachments.length} file(s)</p>
                          </div>
                        )}
                      </div>

                      {/* Terms & Newsletter */}
                      <div className="space-y-3">
                        <CheckboxField
                          label="Subscribe to newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={(v) => updateField('newsletter', v)}
                          description="Get updates about new features and special offers"
                        />
                        <CheckboxField
                          label="I accept the terms and conditions"
                          name="terms_accepted"
                          checked={formData.terms_accepted}
                          onChange={(v) => updateField('terms_accepted', v)}
                          description="By checking this, you agree to our Terms of Service and Privacy Policy"
                          error={errors.terms_accepted}
                        />
                      </div>
                    </div>
                  )}
                </FormStep>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  {/* Auto-save indicator */}
                  <AnimatePresence>
                    {(isSaving || lastSaved) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            Draft saved
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className={cn(
                        "bg-indigo-600 hover:bg-indigo-700 text-white",
                        "px-8 py-6 rounded-xl text-base font-medium",
                        "shadow-lg shadow-indigo-200 hover:shadow-xl",
                        "transition-all duration-300"
                      )}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={cn(
                        "bg-gradient-to-r from-indigo-600 to-violet-600",
                        "hover:from-indigo-700 hover:to-violet-700",
                        "text-white px-8 py-6 rounded-xl text-base font-medium",
                        "shadow-lg shadow-indigo-200 hover:shadow-xl",
                        "transition-all duration-300",
                        "disabled:opacity-60"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <Sparkles className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-400 mt-8"
        >
          Your data is encrypted and secure. We never share your information.
        </motion.p>
      </div>
    </div>
  );
}