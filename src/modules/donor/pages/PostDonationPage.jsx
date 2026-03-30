import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Gift,
  Package,
  MapPin,
  Calendar,
  Clock,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Tag,
  Users,
  Truck,
  Upload,
  X,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Info } from "lucide-react";
import { useAuth } from "@/modules/auth/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { db } from "@/shared/lib/supabase";
import { FormSkeleton } from "@/shared/components/ui/Skeleton";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";
import LocationPicker from "@/shared/components/ui/LocationPicker";
import { HelpIcon } from "@/shared/components/ui/HelpTooltip";
import WorkflowGuideModal from "@/shared/components/ui/WorkflowGuideModal";
import {
  focusAndShakeField,
  handleFormValidationErrors,
} from "@/shared/lib/formValidationUX";

const PostDonationPage = () => {
  const { user, profile } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [donationDestination, setDonationDestination] = useState("recipients"); // 'organization' or 'recipients'
  const formTopRef = useRef(null);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [stepDirection, setStepDirection] = useState(1);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pickup_location: profile?.address || "",
      condition: "good",
      status: "available",
      is_urgent: false,
      quantity: 1,
    },
  });

  // Apply prefill if coming from a request
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.title) setValue("title", prefill.title);
      if (prefill.description) setValue("description", prefill.description);
      if (prefill.category) setValue("category", prefill.category);
      if (prefill.quantity) setValue("quantity", prefill.quantity);
      // Default to recipients flow when fulfilling a request
      setDonationDestination("recipients");
    }
  }, [location.state, setValue]);

  const watchedCategory = watch("category");
  const watchedCondition = watch("condition");
  const watchedIsUrgent = watch("is_urgent");
  const watchedDeliveryMode = watch("delivery_mode");
  const watchedQuantity = Number(watch("quantity") || 1);
  const watchedTags = watch("tags") || "";
  const parsedTags = watchedTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const categories = [
    "Food & Beverages",
    "Clothing & Accessories",
    "Medical Supplies",
    "Educational Materials",
    "Household Items",
    "Electronics & Technology",
    "Toys & Recreation",
    "Personal Care Items",
    "Emergency Supplies",
    "Other",
  ];

  const conditions = [
    {
      value: "new",
      label: "New",
      description: "Unused, in original packaging",
    },
    {
      value: "like_new",
      label: "Like New",
      description: "Excellent condition, barely used",
    },
    {
      value: "good",
      label: "Good",
      description: "Minor signs of use, fully functional",
    },
    {
      value: "fair",
      label: "Fair",
      description: "Shows wear but still usable",
    },
  ];

  const steps = [
    { number: 1, title: "Basic Information", icon: Package },
    { number: 2, title: "Details & Location", icon: MapPin },
    { number: 3, title: "Availability & Review", icon: Calendar },
  ];

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
      fieldsToValidate = ["title", "description", "category", "quantity"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["condition", "pickup_location", "delivery_mode"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 3) {
      setStepDirection(1);
      setCurrentStep(currentStep + 1);
      scrollToFormTop();
    } else if (!isValid) {
      const firstInvalidField = fieldsToValidate.find((field) =>
        Boolean(getFieldState(field).error),
      );
      if (firstInvalidField) {
        focusAndShakeField(firstInvalidField);
      } else {
        handleFormValidationErrors(errors, fieldsToValidate);
      }
    }
  };

  const handleSubmitErrors = (formErrors) => {
    handleFormValidationErrors(formErrors);
  };

  const updateQuantity = (delta) => {
    const nextQuantity = Math.min(1000, Math.max(1, watchedQuantity + delta));
    setValue("quantity", nextQuantity, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addTag = (rawTag) => {
    const cleanedTag = rawTag.trim().replace(/^#/, "");
    if (!cleanedTag) {
      return;
    }
    if (
      parsedTags.some(
        (existing) => existing.toLowerCase() === cleanedTag.toLowerCase(),
      )
    ) {
      setTagInput("");
      return;
    }
    const nextTags = [...parsedTags, cleanedTag].slice(0, 8);
    setValue("tags", nextTags.join(", "), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    const nextTags = parsedTags.filter((tag) => tag !== tagToRemove);
    setValue("tags", nextTags.join(", "), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setStepDirection(-1);
      setCurrentStep(currentStep - 1);
      scrollToFormTop();
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5 - uploadedImages.length;

    if (files.length > maxFiles) {
      error(`You can only upload ${maxFiles} more image(s)`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        error("Each image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
        };
        setUploadedImages((prev) => [...prev, newImage]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    setImageFiles((prev) => {
      const imageToRemove = uploadedImages.find((img) => img.id === imageId);
      return prev.filter((file) => file !== imageToRemove?.file);
    });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const donationData = {
        ...data,
        donor_id: user.id,
        quantity: parseInt(data.quantity),
        expiry_date: data.expiry_date || null,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        images:
          uploadedImages.length > 0
            ? uploadedImages.map((img) => img.preview)
            : [], // Save all images as base64 array
        donation_destination: donationDestination, // Add donation destination
        delivery_mode: data.delivery_mode, // Always include delivery mode
        created_at: new Date().toISOString(),
      };

      const newDonation = await db.createDonation(donationData);
      success("Donation posted successfully!");
      navigate("/my-donations");
    } catch (err) {
      console.error("Error creating donation:", err);
      error(err.message || "Failed to post donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header - Removed title, subtitle, and logo */}
        {location.state?.fromRequestId && (
          <motion.div
            ref={formTopRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 inline-block text-left">
              <p className="text-sm text-amber-800">
                You are fulfilling a recipient's request. You can adjust the
                details if needed.
              </p>
              <div className="text-sm text-amber-700 mt-2">
                <Link
                  to="/browse-requests"
                  className="underline hover:text-amber-800"
                >
                  Back to Browse Requests
                </Link>
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
            <div className="card p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-[#000f3d]/20 shadow-sm">
              <form
                onSubmit={(e) => {
                  if (currentStep !== 3) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(onSubmit, handleSubmitErrors)(e);
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
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                          Share your kindness
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                          Fill in the details to list your donation and help
                          someone today.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f6f8ff] border border-[#dfe7ff] p-4 sm:p-5">
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0">
                            <CheckCircle className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-blue-900">
                              Safe Giving
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Your donation is visible to verified community
                              members for a safer exchange.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-3">
                            Donation Images
                          </label>
                          <div className="flex flex-wrap gap-3">
                            <label className="h-28 w-28 rounded-xl border border-[#d7def5] bg-white hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-500">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <ImageIcon className="h-6 w-6" />
                              <span className="mt-2 text-xs font-medium">
                                Add Photo
                              </span>
                            </label>
                            {uploadedImages.slice(0, 4).map((image) => (
                              <div
                                key={image.id}
                                className="relative h-28 w-28 rounded-xl overflow-hidden border border-[#d7def5] bg-white"
                              >
                                <img
                                  src={image.preview}
                                  alt="Donation preview"
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id)}
                                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                                  aria-label="Remove uploaded image"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Donation Title *
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
                                message:
                                  "Title must be less than 100 characters",
                              },
                            })}
                            className="w-full px-4 py-3 bg-white border border-[#d7def5] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="e.g., Set of 5 warm winter blankets"
                          />
                          {errors.title && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Category *
                            </label>
                            <select
                              {...register("category", {
                                required: "Category is required",
                              })}
                              className="w-full px-4 py-3 bg-white border border-[#d7def5] rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Quantity *
                            </label>
                            <div className="flex items-center bg-white border border-[#d7def5] rounded-xl overflow-hidden h-[46px]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(-1)}
                                className="h-full w-12 inline-flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                {...register("quantity", {
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
                                min="1"
                                className="w-full h-full text-center text-sm font-semibold text-gray-900 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(1)}
                                className="h-full w-12 inline-flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            {errors.quantity && (
                              <p className="mt-2 text-sm text-danger-600">
                                {errors.quantity.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Description & Details
                          </label>
                          <textarea
                            {...register("description", {
                              maxLength: {
                                value: 1000,
                                message:
                                  "Description must be less than 1000 characters",
                              },
                            })}
                            className="w-full px-4 py-3 bg-white border border-[#d7def5] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-32 resize-none"
                            placeholder="Describe the item condition, size, or relevant details..."
                          />
                          {errors.description && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.description.message}
                            </p>
                          )}
                        </div>

                        <div className="mt-5">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-3">
                            Discoverability Tags
                          </label>
                          <p className="text-xs text-gray-500 mb-2">
                            Example:{" "}
                            <span className="font-medium">#winter-care</span>,{" "}
                            <span className="font-medium">#new-condition</span>,{" "}
                            <span className="font-medium">
                              #ready-for-pickup
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[
                              "winter-care",
                              "new-condition",
                              "ready-for-pickup",
                            ].map((sampleTag) => (
                              <button
                                key={sampleTag}
                                type="button"
                                onClick={() => addTag(sampleTag)}
                                className="inline-flex items-center px-2.5 py-1 rounded-full border border-[#d7def5] bg-white hover:bg-blue-50 text-[11px] font-medium text-[#4255b6] transition-colors"
                              >
                                #{sampleTag}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {parsedTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold"
                              >
                                #{tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="text-violet-500 hover:text-violet-700"
                                  aria-label={`Remove tag ${tag}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            ))}
                            <div className="flex items-center gap-2">
                              <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    addTag(tagInput);
                                  }
                                }}
                                className="w-36 px-3 py-1.5 bg-white border border-[#d7def5] rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="add a tag"
                              />
                              <button
                                type="button"
                                onClick={() => addTag(tagInput)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#e8ecff] hover:bg-[#dbe3ff] text-[#3144a3] text-xs font-semibold transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Tag
                              </button>
                            </div>
                          </div>
                          <input {...register("tags")} type="hidden" />
                          <p className="mt-2 text-xs text-gray-500">
                            Add short keywords buyers might search for, like
                            item condition, urgency, or pickup style.
                          </p>
                        </div>
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
                      className="space-y-6"
                    >
                      {/* Donation Destination Selection - Moved to first */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Where to send this donation? *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* To Recipients with Options - Moved to first */}
                          <label
                            className={`cursor-pointer p-2 sm:p-2.5 rounded-lg border-2 transition-all ${
                              donationDestination === "recipients"
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-[#000f3d]/15 bg-white hover:bg-gray-50 hover:border-[#000f3d]/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="donationDestination"
                              value="recipients"
                              checked={donationDestination === "recipients"}
                              onChange={(e) =>
                                setDonationDestination(e.target.value)
                              }
                              className="sr-only"
                            />
                            <div className="flex items-start space-x-2">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                                  donationDestination === "recipients"
                                    ? "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg"
                                    : "bg-gray-100 border-2 border-gray-200"
                                }`}
                              >
                                <Users
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    donationDestination === "recipients"
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3
                                  className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                                    donationDestination === "recipients"
                                      ? "text-gray-900"
                                      : "text-gray-800"
                                  }`}
                                >
                                  To Recipients
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                                  You decide how recipients will receive this
                                  donation (pickup/delivery)
                                </p>
                              </div>
                              {donationDestination === "recipients" && (
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                          </label>

                          {/* Direct to Organization */}
                          <label
                            className={`cursor-pointer p-2 sm:p-2.5 rounded-lg border-2 transition-all ${
                              donationDestination === "organization"
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-[#000f3d]/15 bg-white hover:bg-gray-50 hover:border-[#000f3d]/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="donationDestination"
                              value="organization"
                              checked={donationDestination === "organization"}
                              onChange={(e) => {
                                setDonationDestination(e.target.value);
                              }}
                              className="sr-only"
                            />
                            <div className="flex items-start space-x-2">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                                  donationDestination === "organization"
                                    ? "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg"
                                    : "bg-gray-100 border-2 border-gray-200"
                                }`}
                              >
                                <Package
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    donationDestination === "organization"
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3
                                  className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                                    donationDestination === "organization"
                                      ? "text-gray-900"
                                      : "text-gray-800"
                                  }`}
                                >
                                  Direct to Organization
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                                  Send directly to organization (CFC-GK) for
                                  distribution
                                </p>
                              </div>
                              {donationDestination === "organization" && (
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Condition *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {conditions.map((condition) => (
                            <label
                              key={condition.value}
                              className={`cursor-pointer p-2 sm:p-2.5 rounded-lg border transition-all ${
                                watchedCondition === condition.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-[#000f3d]/15 bg-white hover:bg-gray-50 hover:border-[#000f3d]/30"
                              }`}
                            >
                              <input
                                {...register("condition", {
                                  required: "Condition is required",
                                })}
                                type="radio"
                                value={condition.value}
                                className="sr-only"
                              />
                              <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                                  {condition.label}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                                  {condition.description}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.condition && (
                          <p className="mt-2 text-sm text-danger-600">
                            {errors.condition.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Pickup Location *
                        </label>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              {...register("pickup_location", {
                                required: "Pickup location is required",
                              })}
                              className="flex-1 w-full px-4 py-3 bg-white dark:bg-slate-900 border border-[#000f3d]/20 dark:border-slate-500 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Enter pickup address or location"
                              value={
                                selectedLocation?.address ||
                                watch("pickup_location") ||
                                ""
                              }
                              readOnly={selectedLocation !== null}
                            />
                            <button
                              type="button"
                              onClick={() => setShowLocationPicker(true)}
                              className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm whitespace-nowrap font-medium"
                            >
                              <MapPin className="w-5 h-5" />
                              <span>Map</span>
                            </button>
                          </div>
                          {selectedLocation && (
                            <div className="bg-green-50 border border-green-200 p-2 rounded-lg">
                              <p className="text-[10px] sm:text-xs text-green-700 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Location set on map
                              </p>
                            </div>
                          )}
                          {errors.pickup_location && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.pickup_location.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mode of Delivery and Expiry Date in same row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mode of Delivery */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Mode of Delivery *
                          </label>
                          <select
                            {...register("delivery_mode", {
                              required: "Delivery mode is required",
                            })}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-[#000f3d]/20 dark:border-slate-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-[42px]"
                          >
                            <option value="">Select delivery mode</option>
                            {donationDestination === "organization" ? (
                              <>
                                <option value="donor_delivery">
                                  I will deliver to organization
                                </option>
                                <option value="volunteer">
                                  Use volunteer to deliver to organization
                                </option>
                                <option value="organization_pickup">
                                  Organization will pick up at my location
                                </option>
                              </>
                            ) : (
                              <>
                                <option value="pickup">Self Pickup</option>
                                <option value="volunteer">
                                  Volunteer Delivery
                                </option>
                                <option value="direct">
                                  Direct Delivery (by donor)
                                </option>
                              </>
                            )}
                          </select>
                          {errors.delivery_mode && (
                            <p className="mt-2 text-sm text-danger-600">
                              {errors.delivery_mode.message}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-600">
                            {donationDestination === "organization"
                              ? "Choose how to deliver your donation to the organization"
                              : "Choose how recipients can receive this donation"}
                          </p>
                        </div>

                        {/* Expiry Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Expiry Date (if applicable)
                          </label>
                          <input
                            {...register("expiry_date")}
                            type="date"
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-[#000f3d]/20 dark:border-slate-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-[42px]"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      {/* Info message when organization is selected */}
                      {donationDestination === "organization" && (
                        <div className="bg-amber-200 border-2 border-amber-500 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-900" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-amber-950">
                              Sending to Organization
                            </p>
                            <p className="text-sm text-amber-900 mt-1">
                              Your donation will be sent directly to the
                              organization (CFC-GK) for distribution to those in
                              need.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pickup Instructions - Moved to last */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Pickup Instructions (optional)
                        </label>
                        <textarea
                          {...register("pickup_instructions")}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-[#000f3d]/20 dark:border-slate-500 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-24 sm:h-28 resize-none"
                          placeholder="Special instructions for pickup (e.g., gate code, best time to contact, etc.)"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Availability & Review */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: stepDirection > 0 ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection > 0 ? -24 : 24 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Urgent Priority Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Priority Level *
                        </label>
                        <p className="text-sm text-gray-600 mb-4">
                          Select the urgency level for this donation
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Normal Priority Button */}
                          <button
                            type="button"
                            onClick={() => setValue("is_urgent", false)}
                            className={`relative p-2 sm:p-2.5 rounded-lg border-2 transition-all duration-300 ${
                              !watchedIsUrgent
                                ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 shadow-sm"
                                : "border-gray-300 dark:border-[#000f3d]/15 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-[#000f3d]/30"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                                  !watchedIsUrgent
                                    ? "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50"
                                    : "bg-gray-100 border-2 border-gray-200"
                                }`}
                              >
                                <Clock
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    !watchedIsUrgent
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <h3
                                  className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                                    !watchedIsUrgent
                                      ? "text-gray-900"
                                      : "text-gray-800"
                                  }`}
                                >
                                  Normal Priority
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                                  Standard donation with flexible pickup
                                  timeline
                                </p>
                              </div>
                            </div>
                            {!watchedIsUrgent && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2"
                              >
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                              </motion.div>
                            )}
                          </button>

                          {/* Urgent Priority Button */}
                          <button
                            type="button"
                            onClick={() => setValue("is_urgent", true)}
                            className={`relative p-2 sm:p-2.5 rounded-lg border-2 transition-all duration-300 ${
                              watchedIsUrgent
                                ? "border-red-500 bg-red-50 shadow-sm"
                                : "border-[#000f3d]/15 bg-white hover:bg-gray-50 hover:border-[#000f3d]/30"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                                  watchedIsUrgent
                                    ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50"
                                    : "bg-gray-100 border-2 border-gray-200"
                                }`}
                              >
                                <AlertCircle
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    watchedIsUrgent
                                      ? "text-white"
                                      : "text-gray-700"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <h3
                                  className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                                    watchedIsUrgent
                                      ? "text-gray-900"
                                      : "text-gray-800"
                                  }`}
                                >
                                  Urgent Priority
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                                  Needs immediate attention (perishable items,
                                  time-sensitive supplies)
                                </p>
                              </div>
                            </div>
                            {watchedIsUrgent && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2"
                              >
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                              </motion.div>
                            )}
                          </button>
                        </div>

                        {/* Urgent Priority Info Banner */}
                        {watchedIsUrgent && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 flex items-start space-x-3 text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200"
                          >
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">
                                Urgent Priority Enabled
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                This donation will be highlighted and
                                prioritized in search results to ensure quick
                                matching with recipients.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Image Upload Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Donation Photos
                        </label>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload photos of your donation to help recipients see
                          what you're offering. (Max 5 images, 5MB each)
                        </p>

                        <div className="space-y-2">
                          {/* Upload Area */}
                          <div className="relative">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={uploadedImages.length >= 5}
                            />
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all ${
                                uploadedImages.length >= 5
                                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                  : "border-[#000f3d]/20 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                              }`}
                            >
                              <Upload
                                className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 ${
                                  uploadedImages.length >= 5
                                    ? "text-gray-400"
                                    : "text-blue-600"
                                }`}
                              />
                              <p
                                className={`text-sm ${
                                  uploadedImages.length >= 5
                                    ? "text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {uploadedImages.length >= 5
                                  ? "Maximum 5 images reached"
                                  : "Click to upload images or drag and drop"}
                              </p>
                              <p
                                className={`text-sm mt-2 ${
                                  uploadedImages.length >= 5
                                    ? "text-gray-500"
                                    : "text-blue-500"
                                }`}
                              >
                                PNG, JPG, JPEG up to 5MB each
                              </p>
                            </div>
                          </div>

                          {/* Image Preview Grid */}
                          {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                              {uploadedImages.map((image) => (
                                <div key={image.id} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-[#000f3d]/10">
                                    <img
                                      src={image.preview}
                                      alt={image.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-2 -right-2 bg-danger-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  <p
                                    className="text-[10px] sm:text-xs text-gray-600 mt-1 truncate"
                                    title={image.name}
                                  >
                                    {image.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Section */}
                      <div className="border-t border-[#000f3d]/10 pt-8 mt-8">
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <CheckCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                Donation Review
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Please review all information before submitting
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#000f3d]/20 shadow-sm overflow-hidden">
                          {/* Header Section */}
                          <div className="bg-gray-50 px-6 py-4 border-b border-[#000f3d]/10">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                  Donation Information
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                  {watch("title") || "Untitled Donation"}
                                </h4>
                              </div>
                              {watchedIsUrgent && (
                                <div className="ml-4 flex-shrink-0">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wide">
                                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Urgent
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Description Section */}
                          {watch("description") && (
                            <div className="px-6 py-5 border-b border-[#000f3d]/10">
                              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                Description
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {watch("description")}
                              </p>
                            </div>
                          )}

                          {/* Details Grid */}
                          <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Category */}
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                  Category
                                </div>
                                <div className="text-base text-gray-900 font-medium">
                                  {watch("category") || "Not specified"}
                                </div>
                              </div>

                              {/* Quantity */}
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                  Quantity
                                </div>
                                <div className="text-base text-gray-900 font-medium">
                                  {watch("quantity") || 1}{" "}
                                  {watch("quantity") === 1 ? "item" : "items"}
                                </div>
                              </div>

                              {/* Condition */}
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                  Item Condition
                                </div>
                                <div
                                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                                    watchedCondition === "new"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : watchedCondition === "like_new"
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : watchedCondition === "good"
                                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                                          : "bg-orange-50 text-orange-700 border border-orange-200"
                                  }`}
                                >
                                  {(watchedCondition &&
                                    conditions.find(
                                      (c) => c.value === watchedCondition,
                                    )?.label) ||
                                    "Not specified"}
                                </div>
                              </div>

                              {/* Pickup Location */}
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  Pickup Location
                                </div>
                                <div className="text-sm text-gray-900 font-medium leading-relaxed">
                                  {watch("pickup_location") || "Not specified"}
                                </div>
                              </div>

                              {/* Delivery Method */}
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                  {donationDestination === "organization" ? (
                                    <Package className="h-3.5 w-3.5" />
                                  ) : (
                                    <Users className="h-3.5 w-3.5" />
                                  )}
                                  Delivery Method
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-900 font-semibold">
                                    {donationDestination === "organization"
                                      ? "Direct to Organization"
                                      : "To Recipients"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {watchedDeliveryMode === "pickup"
                                      ? "Self Pickup"
                                      : watchedDeliveryMode === "volunteer"
                                        ? "Volunteer Delivery"
                                        : watchedDeliveryMode === "direct"
                                          ? "Direct Delivery (by donor)"
                                          : watchedDeliveryMode ===
                                              "donor_delivery"
                                            ? "Donor will deliver to organization"
                                            : watchedDeliveryMode ===
                                                "organization_pickup"
                                              ? "Organization will pick up"
                                              : "Not specified"}
                                  </div>
                                </div>
                              </div>

                              {/* Expiry Date */}
                              {watch("expiry_date") && (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Expiry Date
                                  </div>
                                  <div className="text-sm text-gray-900 font-medium">
                                    {new Date(
                                      watch("expiry_date"),
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Photos */}
                              {uploadedImages.length > 0 && (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Attachments
                                  </div>
                                  <div className="text-sm text-gray-900 font-medium">
                                    {uploadedImages.length} image
                                    {uploadedImages.length > 1 ? "s" : ""}{" "}
                                    attached
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional Information */}
                          {(watch("pickup_instructions") || watch("tags")) && (
                            <div className="border-t border-[#000f3d]/10">
                              {/* Pickup Instructions */}
                              {watch("pickup_instructions") && (
                                <div className="px-6 py-5 border-b border-[#000f3d]/10">
                                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                    Pickup Instructions
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {watch("pickup_instructions")}
                                  </p>
                                </div>
                              )}

                              {/* Tags */}
                              {watch("tags") && (
                                <div className="px-6 py-5">
                                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
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
                                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs bg-amber-50 text-amber-800 border border-amber-200 font-medium"
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
                <div className="mt-8 rounded-2xl border-2 border-primary-200 dark:border-primary-700/50 bg-gradient-to-r from-primary-50/80 to-white dark:from-slate-800 dark:to-slate-800 p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white flex-shrink-0">
                        <CheckCircle className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Donation Input Progress
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
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-800/50 text-primary-700 dark:text-primary-300 transition-all shadow-sm"
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
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
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
                              ? "border-primary-300 bg-primary-100/70 text-primary-800 dark:border-primary-600 dark:bg-primary-900/30 dark:text-primary-200"
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
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8 pt-6 border-t border-[#000f3d]/10 dark:border-slate-600">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border border-[#000f3d]/20 dark:border-slate-600 order-2 sm:order-1"
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
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-95 order-1 sm:order-2"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Gift className="h-5 w-5" />
                          <span>Post Donation</span>
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
            setValue("pickup_location", location.address);
            setShowLocationPicker(false);
          }}
          initialLocation={selectedLocation}
          title="Select Pickup Location"
        />
        {/* Workflow Guide Modal */}
        <WorkflowGuideModal
          isOpen={showWorkflowGuide}
          onClose={() => setShowWorkflowGuide(false)}
          userRole="donor"
        />
      </div>
    </div>
  );
};

export default PostDonationPage;
