import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";

const AddPlantForm = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    isPending,
    isError,
    mutateAsync,
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/plants`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Plant added successfully 🌱");
      reset();
    },
  });

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  const onSubmit = async (data) => {
    const { name, price, quantity, category, description, image } = data;
    const imageFile = image[0];

    try {
      const imageURL = await imageUpload(imageFile);

      const plantData = {
        name,
        image: imageURL,
        price: Number(price),
        quantity: Number(quantity),
        category,
        description,
        seller: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };

      await mutateAsync(plantData);
    } catch (error) {
      toast.error("Failed to add plant");
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-white p-8 rounded-xl shadow"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Plant name"
                className="w-full px-4 py-3 border border-lime-300 rounded-md focus:outline-lime-500"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">Name is required</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Category</label>
              <select
                className="w-full px-4 py-3 border border-lime-300 rounded-md focus:outline-lime-500"
                {...register("category", { required: true })}
              >
                <option value="">Select category</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.category && (
                <p className="text-xs text-red-500">Category is required</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Description</label>
              <textarea
                className="w-full h-32 px-4 py-3 border border-lime-300 rounded-md focus:outline-lime-500"
                placeholder="Plant description"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-xs text-red-500">Description is required</p>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Price & Quantity */}
            <div className="flex gap-4">
              <div className="w-full space-y-1 text-sm">
                <label className="block text-gray-600">Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full px-4 py-3 border border-lime-300 rounded-md focus:outline-lime-500"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">Price is required</p>
                )}
              </div>

              <div className="w-full space-y-1 text-sm">
                <label className="block text-gray-600">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  className="w-full px-4 py-3 border border-lime-300 rounded-md focus:outline-lime-500"
                  {...register("quantity", { required: true })}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500">Quantity is required</p>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="border-4 border-dotted border-gray-300 p-6 rounded-lg text-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  {...register("image", { required: true })}
                />
                <span className="inline-block bg-lime-500 text-white px-4 py-2 rounded-md">
                  Upload Image
                </span>
              </label>
              {errors.image && (
                <p className="text-xs text-red-500 mt-2">Image is required</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-lime-500 text-white py-3 rounded-md font-medium hover:bg-lime-600 transition"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
