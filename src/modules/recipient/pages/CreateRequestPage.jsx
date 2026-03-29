import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  MapPin,
  AlertCircle,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  Info,
  Shield,
  Check,
} from "lucide-react";
import { useAuth } from "@/modules/auth/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";
import { db } from "@/shared/lib/supabase";
import LocationPicker from "@/shared/components/ui/LocationPicker";
import { HelpIcon } from "@/shared/components/ui/HelpTooltip";
import WorkflowGuideModal from "@/shared/components/ui/WorkflowGuideModal";
import VerificationRequiredModal from "@/modules/profile/components/VerificationRequiredModal";

const CreateRequestPage = () => {
  const { user, profile } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sampleImage, setSampleImage] = useState(null);
  const formTopRef = useRef(null);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [adminSettings, setAdminSettings] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [stepDirection, setStepDirection] = useState(1);

  const editMode = location.state?.editMode || false;
  const requestData = location.state?.requestData || null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      quantity_needed: 1,
      urgency: "medium",
      location: profile?.address || "",
      needed_by: "",
      delivery_mode: "pickup",
      delivery_instructions: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (editMode && requestData) {
      const formData = {
        title: requestData.title || "",
        category: requestData.category || "",
        quantity_needed: requestData.quantity_needed || 1,
        description: requestData.description || "",
        urgency: requestData.urgency || "medium",
        needed_by: requestData.needed_by || "",
        location: requestData.location || "",
        delivery_mode: requestData.delivery_mode || "pickup",
        delivery_instructions: requestData.delivery_instructions || "",
        tags: requestData.tags?.length > 0 ? requestData.tags.join(", ") : "",
      };
      reset(formData);
      if (requestData.sample_image) {
        setSampleImage(requestData.sample_image);
      }
    }
  }, [editMode, requestData, reset]);

  // Load admin settings to check if verification is required
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await db.getSettings();
        setAdminSettings(settings);
      } catch (error) {
        console.error("Error loading admin settings:", error);
        // Default to requiring verification if settings can't be loaded
        setAdminSettings({ requireIdVerification: true });
      }
    };
    loadSettings();
  }, []);

  const categories = [
    "Food",
    "Clothing",
    "Medical Supplies",
    "Educational Materials",
    "Household Items",
    "Electronics",
    "Toys & Games",
    "Books",
    "Furniture",
    "Financial Assistance",
    "Transportation",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const steps = [
    { number: 1, title: "Basic Information", icon: Package },
    { number: 2, title: "Details & Location", icon: MapPin },
    { number: 3, title: "Priority & Review", icon: Calendar },
  ];

  const watchedUrgency = watch("urgency");
  const watchedDeliveryMode = watch("delivery_mode");

  const scrollToFormTop = () => {
    setTimeout(() => {
      if (formTopRef.current) {
        const headerOffset = 80; // Account for sticky header
        const elementPosition = formTopRef.current.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const nextStep = async () => {
    let fieldsToValidate = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "title",
        "description",
        "category",
        "quantity_needed",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["location"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 3) {
      setStepDirection(1);
      setCurrentStep(currentStep + 1);
      scrollToFormTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setStepDirection(-1);
      setCurrentStep(currentStep - 1);
      scrollToFormTop();
    }
  };

  // Check if user is verified (helper function)
  const checkVerificationStatus = () => {
    if (!profile) return { verified: false, reason: "no_profile" };

    // Check if account is active
    if (
      profile.is_active === false ||
      profile.is_active === "false" ||
      profile.is_active === 0
    ) {
      return { verified: false, reason: "account_suspended" };
    }

    // Check admin settings - if verification is not required, allow request creation
    const requireVerification = adminSettings?.requireIdVerification !== false; // Default to true if not set

    if (!requireVerification) {
      return { verified: true, reason: "verification_not_required" };
    }

    // Check if ID is uploaded
    const hasIdUploaded =
      profile.primary_id_type &&
      profile.primary_id_number &&
      profile.primary_id_image_url;

    if (!hasIdUploaded) {
      return {
        verified: false,
        reason: "no_id_uploaded",
        hasIdUploaded: false,
      };
    }

    // Check verification status
    const verificationStatus =
      profile.id_verification_status || profile.verification_status;

    if (verificationStatus === "verified" || profile.is_verified === true) {
      return { verified: true, reason: "verified" };
    }

    // Not verified
    return {
      verified: false,
      reason: verificationStatus || "not_verified",
      verificationStatus: verificationStatus || "pending",
      hasIdUploaded: true,
    };
  };

  const onSubmit = async (data) => {
    if (!profile) {
      error("Please complete your profile first");
      return;
    }

    // Check verification status before allowing request creation
    setCheckingVerification(true);
    const verificationCheck = checkVerificationStatus();
    setCheckingVerification(false);

    if (!verificationCheck.verified) {
      // Handle account suspension
      if (verificationCheck.reason === "account_suspended") {
        error(
          "Your account has been suspended. Please contact the administrator for assistance.",
        );
        navigate("/login");
        return;
      }

      // Show verification modal for other cases
      setShowVerificationModal(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const tags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [];

      const submitData = {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        category: data.category,
        quantity_needed: parseInt(data.quantity_needed),
        urgency: data.urgency,
        location: data.location.trim(),
        needed_by: data.needed_by || null,
        delivery_mode: data.delivery_mode,
        delivery_instructions: data.delivery_instructions?.trim() || null,
        tags: tags.length > 0 ? tags : null,
        sample_image: sampleImage || null,
        requester_id: user.id,
      };

      if (editMode && requestData) {
        await db.updateDonationRequest(requestData.id, submitData);
        success("Request updated successfully!");
      } else {
        await db.createDonationRequest(submitData);
        success("Request created successfully!");
      }

      navigate("/my-requests");
    } catch (err) {
      console.error(
        `Error ${editMode ? "updating" : "creating"} request:`,
        err,
      );
      error(
        err.message ||
          `Failed to ${editMode ? "update" : "create"} request. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check verification status for display
  const verificationCheck = checkVerificationStatus();
  const requireVerification = adminSettings?.requireIdVerification !== false;
  const showVerificationWarning =
    requireVerification && !verificationCheck.verified && !editMode;

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Verification Warning Banner */}
        {showVerificationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 card p-4 border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-orange-600/5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    ID Verification Required
                  </h4>
                  <p className="text-xs text-gray-600/80">
                    You must complete ID verification before creating donation
                    requests. This helps ensure community safety and trust.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/profile#id-verification")}
                  className="text-xs px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-yellow-600 hover:to-yellow-700 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white dark:text-blue-50 border border-blue-500/60 dark:border-blue-400/60 rounded-lg font-medium transition-all inline-flex items-center gap-2 flex-shrink-0 self-center"
                >
                  Complete Verification
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Layout */}
        <div>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
            ref={formTopRef}
          >
            <div className="card p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 rounded-2xl">
              <form
                onSubmit={(e) => {
                  if (currentStep !== 3) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(onSubmit)(e);
                }}
              >
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: stepDirection > 0 ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection > 0 ? -24 : 24 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          <div className="flex items-center gap-2">
                            Request Title *
                            <HelpIcon content="A clear title helps donors find your request. Your request will be matched with donors who have this item." />
                          </div>
                        </label>
                        <input
                          {...register("title", {
                            required: "Title is required",
                            minLength: {
                              value: 5,
                              message: "Title must be at least 5 characters",
                            },
                            maxLength: {
                              value: 100,
                              message: "Title must be less than 100 characters",
                            },
                          })}
                          className="input text-sm px-4 py-3"
                          placeholder="e.g., Winter Clothes for Children"
                        />
                        {errors.title && (
                          <p className="mt-2 text-sm text-danger-600">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          <div className="flex items-center gap-2">
                            Description
                            <HelpIcon content="Detailed descriptions help donors understand what you need. This improves matching and helps your request reach those who can help." />
                          </div>
                        </label>
                        <textarea
                          {...register("description", {
                            maxLength: {
                              value: 1000,
                              message:
                                "Description must be less than 1000 characters",
                            },
                          })}
                          className="input h-32 sm:h-36 resize-none text-sm px-4 py-3"
                          placeholder="Describe what you need and why you need it..."
                        />
                        {errors.description && (
                          <p className="mt-2 text-sm text-danger-600">
                            {errors.description.message}
                          </p>
                        )}
                        <div className="mt-2 text-sm text-blue-500 text-right">
                          {watch("description")?.length || 0}/1000 characters
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            <div className="flex items-center gap-2">
                              Category *
                              <HelpIcon content="Selecting the right category helps our smart matching algorithm connect your request with donors who have this type of item." />
                            </div>
                          </label>
                          <select
                            {...register("category", {
                              required: "Category is required",
                            })}
                            className="input text-sm px-4 py-3"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.category.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Quantity Needed *
                          </label>
                          <input
                            {...register("quantity_needed", {
                              required: "Quantity is required",
                              min: {
                                value: 1,
                                message: "Quantity must be at least 1",
                              },
                              max: {
                                value: 1000,
                                message: "Quantity must be less than 1000",
                              },
                            })}
                            type="number"
                            className="input text-sm px-4 py-3"
                            placeholder="1"
                            min="1"
                          />
                          {errors.quantity_needed && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.quantity_needed.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Tags (optional)
                        </label>
                        <input
                          {...register("tags")}
                          className="input text-sm px-4 py-3"
                          placeholder="urgent, winter, children (separate with commas)"
                        />
                        <p className="mt-2 text-sm text-blue-500">
                          Add tags to help donors find your request more easily
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Details & Location */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: stepDirection > 0 ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection > 0 ? -24 : 24 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Location Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pickup/Delivery Location
                          </h3>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Complete Address *
                          </label>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                {...register("location", {
                                  required: "Location is required",
                                  minLength: {
                                    value: 5,
                                    message:
                                      "Location must be at least 5 characters",
                                  },
                                })}
                                className="input flex-1 text-sm px-4 py-3"
                                placeholder="Enter complete address (street, barangay, city, province)"
                                value={
                                  selectedLocation?.address ||
                                  watch("location") ||
                                  ""
                                }
                                readOnly={selectedLocation !== null}
                              />
                              <button
                                type="button"
                                onClick={() => setShowLocationPicker(true)}
                                className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm whitespace-nowrap font-medium shadow-lg hover:shadow-xl"
                              >
                                <MapPin className="w-5 h-5" />
                                <span>Select on Map</span>
                              </button>
                            </div>
                            {selectedLocation && (
                              <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                                <p className="text-sm text-green-400 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Location successfully set on map
                                </p>
                              </div>
                            )}
                            {errors.location && (
                              <p className="mt-2 text-sm text-danger-600">
                                {errors.location.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-700">
                              Provide a complete address to help donors and
                              volunteers locate you easily
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Mode Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Preferred Delivery Method
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                              How would you like to receive this donation?
                              (Optional)
                            </label>
                            <select
                              {...register("delivery_mode")}
                              className="input text-sm px-4 py-3 w-full h-[42px]"
                            >
                              <option value="">Select delivery mode</option>
                              <option value="pickup">Self Pickup</option>
                              <option value="volunteer">
                                Volunteer Delivery
                              </option>
                              <option value="direct">Direct Delivery</option>
                            </select>
                            {errors.delivery_mode && (
                              <p className="mt-2 text-sm text-danger-600">
                                {errors.delivery_mode.message}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-gray-700">
                              Choose how you prefer to receive this donation
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Deadline (Optional)
                            </label>
                            <input
                              {...register("needed_by")}
                              type="date"
                              className="input text-sm px-4 py-3 w-full h-[42px]"
                              min={new Date().toISOString().split("T")[0]}
                            />
                            <p className="mt-2 text-xs text-gray-700">
                              Specify a deadline if you need this item by a
                              specific date
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Instructions Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Delivery Instructions (Optional)
                          </label>
                          <textarea
                            {...register("delivery_instructions")}
                            className="input h-24 resize-none text-sm px-4 py-3 w-full"
                            placeholder="e.g., Best time to contact, gate code, landmarks, special instructions..."
                          />
                          <p className="mt-2 text-xs text-gray-700">
                            Add any special instructions to help with delivery
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Priority & Review */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: stepDirection > 0 ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection > 0 ? -24 : 24 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Urgency Level Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Urgency Level *
                        </label>
                        <p className="text-sm text-blue-500 mb-4">
                          Select the urgency level for this request
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {urgencyLevels.map((level) => (
                            <label
                              key={level.value}
                              className={`relative cursor-pointer p-2 sm:p-2.5 rounded-lg border-2 transition-all ${
                                watchedUrgency === level.value
                                  ? "border-yellow-500 bg-amber-50 shadow-lg shadow-yellow-500/20"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
                              }`}
                            >
                              <input
                                {...register("urgency", {
                                  required: "Urgency level is required",
                                })}
                                type="radio"
                                value={level.value}
                                className="sr-only"
                              />
                              <div className="flex flex-col items-center">
                                <h3
                                  className={`text-sm font-semibold ${
                                    watchedUrgency === level.value
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {level.label}
                                </h3>
                              </div>
                              {watchedUrgency === level.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2"
                                >
                                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                </motion.div>
                              )}
                            </label>
                          ))}
                        </div>
                        {errors.urgency && (
                          <p className="mt-2 text-sm text-danger-600">
                            {errors.urgency.message}
                          </p>
                        )}
                      </div>

                      {/* Sample Image Upload Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Sample Image (Optional)
                        </label>
                        <p className="text-sm text-blue-500 mb-4">
                          Upload a reference image to help donors understand
                          what you need. (Max 5MB)
                        </p>

                        <div className="space-y-2">
                          {!sampleImage ? (
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      error("Image must be less than 5MB");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () =>
                                      setSampleImage(reader.result);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all border-gray-300 bg-gray-50 hover:border-yellow-500 hover:bg-gray-100 cursor-pointer">
                                <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-blue-500" />
                                <p className="text-sm text-white">
                                  Click to upload image or drag and drop
                                </p>
                                <p className="text-sm mt-2 text-blue-500">
                                  PNG, JPG, JPEG up to 5MB
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 max-w-xs">
                                <img
                                  src={sampleImage}
                                  alt="Sample"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setSampleImage(null)}
                                className="absolute -top-2 -right-2 bg-danger-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Section */}
                      <div className="border-t-2 border-gray-300 pt-8 mt-8">
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg border border-gray-200">
                              <CheckCircle className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">
                                Request Review
                              </h3>
                              <p className="text-sm text-gray-700 mt-1">
                                Please review all information before submitting
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-xl border-2 border-gray-300/50 shadow-xl overflow-hidden">
                          {/* Header Section */}
                          <div className="bg-gray-50/50 px-6 py-4 border-b-2 border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider mb-2">
                                  Request Information
                                </div>
                                <h4 className="text-xl font-bold text-white leading-tight">
                                  {watch("title") || "Untitled Request"}
                                </h4>
                              </div>
                              {watchedUrgency &&
                                (watchedUrgency === "critical" ||
                                  watchedUrgency === "high") && (
                                  <div className="ml-4 flex-shrink-0">
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide ${
                                        watchedUrgency === "critical"
                                          ? "bg-danger-900/40 text-danger-300 border border-danger-500/40"
                                          : "bg-red-900/40 text-red-300 border border-red-500/40"
                                      }`}
                                    >
                                      <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                      {urgencyLevels.find(
                                        (l) => l.value === watchedUrgency,
                                      )?.label || watchedUrgency}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Description Section */}
                          {watch("description") && (
                            <div className="px-6 py-5 border-b border-gray-200/50">
                              <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider mb-2">
                                Description
                              </div>
                              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                {watch("description")}
                              </p>
                            </div>
                          )}

                          {/* Details Grid */}
                          <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Category */}
                              <div className="space-y-2">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider">
                                  Category
                                </div>
                                <div className="text-base text-white font-medium">
                                  {watch("category") || "Not specified"}
                                </div>
                              </div>

                              {/* Quantity */}
                              <div className="space-y-2">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider">
                                  Quantity Needed
                                </div>
                                <div className="text-base text-white font-medium">
                                  {watch("quantity_needed") || 1}{" "}
                                  {watch("quantity_needed") === 1
                                    ? "item"
                                    : "items"}
                                </div>
                              </div>

                              {/* Urgency */}
                              <div className="space-y-2">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider">
                                  Urgency Level
                                </div>
                                <div
                                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                                    watchedUrgency === "critical"
                                      ? "bg-danger-900/40 text-danger-300 border border-danger-500/40"
                                      : watchedUrgency === "high"
                                        ? "bg-red-900/40 text-red-300 border border-red-500/40"
                                        : watchedUrgency === "medium"
                                          ? "bg-yellow-900/40 text-gray-600 border border-yellow-500/40"
                                          : "bg-green-900/40 text-green-300 border border-green-500/40"
                                  }`}
                                >
                                  {(watchedUrgency &&
                                    urgencyLevels.find(
                                      (l) => l.value === watchedUrgency,
                                    )?.label) ||
                                    "Not specified"}
                                </div>
                              </div>

                              {/* Location */}
                              <div className="space-y-2">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  Pickup/Delivery Location
                                </div>
                                <div className="text-sm text-white font-medium leading-relaxed">
                                  {watch("location") || "Not specified"}
                                </div>
                              </div>

                              {/* Delivery Mode */}
                              <div className="space-y-2">
                                <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                  <Package className="h-3.5 w-3.5" />
                                  Preferred Delivery Mode
                                </div>
                                <div className="text-sm text-white font-medium">
                                  {watchedDeliveryMode === "pickup"
                                    ? "Self Pickup"
                                    : watchedDeliveryMode === "volunteer"
                                      ? "Volunteer Delivery"
                                      : watchedDeliveryMode === "direct"
                                        ? "Direct Delivery"
                                        : "Not specified"}
                                </div>
                              </div>

                              {/* Deadline */}
                              {watch("needed_by") && (
                                <div className="space-y-2">
                                  <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Deadline
                                  </div>
                                  <div className="text-sm text-white font-medium">
                                    {new Date(
                                      watch("needed_by"),
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Sample Image */}
                              {sampleImage && (
                                <div className="space-y-2">
                                  <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Reference Image
                                  </div>
                                  <div className="text-sm text-white font-medium">
                                    Image attached
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional Information */}
                          {(watch("delivery_instructions") ||
                            watch("tags")) && (
                            <div className="border-t border-gray-200/50">
                              {watch("delivery_instructions") && (
                                <div className="px-6 py-5 border-b border-gray-200/50">
                                  <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider mb-2">
                                    Delivery Instructions
                                  </div>
                                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {watch("delivery_instructions")}
                                  </p>
                                </div>
                              )}
                              {watch("tags") && (
                                <div className="px-6 py-5">
                                  <div className="text-xs text-blue-500/70 font-semibold uppercase tracking-wider mb-3">
                                    Tags
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {watch("tags")
                                      .split(",")
                                      .map((tag, idx) => tag.trim())
                                      .filter((tag) => tag)
                                      .map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs bg-amber-50 text-gray-600 border border-gray-200 font-medium"
                                        >
                                          {tag.trim()}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Primary In-Form Progress */}
                <div className="mt-8 rounded-2xl border-2 border-blue-200 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/80 to-white dark:from-slate-800 dark:to-slate-800 p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Request Input Progress
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          You are on step {currentStep} of {steps.length}:{" "}
                          {steps[currentStep - 1]?.title}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowWorkflowGuide(true)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 transition-all shadow-sm"
                      title="How the workflow works"
                      aria-label="How the workflow works"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      animate={{
                        width: `${(currentStep / steps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {steps.map((step) => {
                      const isActive = currentStep === step.number;
                      const isDone = currentStep > step.number;

                      return (
                        <div
                          key={step.number}
                          className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold truncate ${
                            isActive
                              ? "border-blue-300 bg-blue-100/70 text-blue-800 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                              : isDone
                                ? "border-emerald-300 bg-emerald-100/70 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                                : "border-gray-200 bg-white text-gray-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-400"
                          }`}
                        >
                          {step.number}. {step.title}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8 pt-6 border-t-2 border-gray-200 dark:border-slate-600">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-slate-600 order-2 sm:order-1"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Previous</span>
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95 order-1 sm:order-2"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>
                            {editMode ? "Updating..." : "Creating..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>
                            {editMode ? "Update Request" : "Create Request"}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Location Picker Modal */}
        <LocationPicker
          isOpen={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={(location) => {
            setSelectedLocation(location);
            setValue("location", location.address);
            setShowLocationPicker(false);
          }}
          initialLocation={selectedLocation}
          title="Select Delivery Location"
        />
        {/* Workflow Guide Modal */}
        <WorkflowGuideModal
          isOpen={showWorkflowGuide}
          onClose={() => setShowWorkflowGuide(false)}
          userRole="recipient"
        />

        {/* Verification Required Modal */}
        <VerificationRequiredModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          verificationStatus={
            profile?.id_verification_status || profile?.verification_status
          }
          hasIdUploaded={
            !!(
              profile?.primary_id_type &&
              profile?.primary_id_number &&
              profile?.primary_id_image_url
            )
          }
        />
      </div>
    </div>
  );
};

export default CreateRequestPage;
