// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Eye, EyeOff, Zap, Shield, TrendingUp, Lock, Mail } from "lucide-react";

// import bg_image from "@/assets/bg_image.avif";
// import useUserStore from "@/store/UserStore";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setErrors({});
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const { email, password } = formData;
//       if (!email || !password) {
//         setErrors({ form: "Please fill in all required fields." });
//         setIsLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setErrors({ form: data.message || "Invalid email or password" });
//         return;
//       }

//       // Save auth info
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       useUserStore.getState().setUser(data.user);

//       navigate("/dashboard");
//     } catch (error) {
//       setErrors({
//         form: "Server error, please try again later",
//       });
//       console.error("Login failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Section - Image */}
//       <div className="w-full md:w-1/2 relative overflow-hidden">
//         {/* Background gradient overlay */}
//         <div className="absolute inset-0 bg-linear-to-br from-blue-900/70 via-indigo-900/70 to-purple-900/70 z-10"></div>

//         {/* Energy monitoring image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage: `url(${bg_image})`,
//           }}
//         ></div>

//         {/* Content overlay */}
//         <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12 text-white">
//           <div className="max-w-md">
//             <div className="flex items-center mb-6">
//               <div className="p-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg mr-3">
//                 <Zap className="h-8 w-8 text-white" />
//               </div>
//               <h1 className="text-3xl font-bold">WattBot</h1>
//             </div>

//             <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
//             <p className="text-lg mb-6 text-blue-100">
//               Sign in to access your energy dashboard and continue monitoring
//               your consumption.
//             </p>

//             <div className="space-y-4">
//               <div className="flex items-start">
//                 <div className="p-2 rounded-full bg-blue-500/20 mr-3 mt-1">
//                   <Zap className="h-5 w-5 text-blue-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">
//                     Real-time Monitoring
//                   </h3>
//                   <p className="text-blue-100">
//                     Track your energy usage in real-time
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start">
//                 <div className="p-2 rounded-full bg-indigo-500/20 mr-3 mt-1">
//                   <TrendingUp className="h-5 w-5 text-indigo-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">AI Predictions</h3>
//                   <p className="text-blue-100">
//                     Forecast future usage and costs
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start">
//                 <div className="p-2 rounded-full bg-green-500/20 mr-3 mt-1">
//                   <Shield className="h-5 w-5 text-green-300" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">Secure & Private</h3>
//                   <p className="text-blue-100">Your data is protected</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Section - Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-linear-to-br from-blue-50 to-indigo-100">
//         <div className="w-full max-w-md">
//           {/* Logo and Branding for mobile */}
//           <div className="text-center md:hidden mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="p-3 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg">
//                 <Zap className="h-10 w-10 text-white" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">WattBot</h1>
//             <p className="mt-2 text-gray-600">
//               AI-powered energy monitoring and optimization
//             </p>
//           </div>

//           {/* Login Card */}
//           <Card className="shadow-xl border-0">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl font-bold text-center">
//                 Login to Your Account
//               </CardTitle>
//               <CardDescription className="text-center">
//                 Enter your credentials to access your account
//               </CardDescription>
//             </CardHeader>

//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 {errors.form && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//                     <p className="text-red-600 text-sm text-center">
//                       {errors.form}
//                     </p>
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="name@example.com"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className={`pl-10 ${
//                         errors.email ? "border-red-500" : ""
//                       }`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-red-500 text-sm">{errors.email}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                   </div>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className={`pl-10 ${
//                         errors.password ? "border-red-500" : ""
//                       }`}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                   {errors.password && (
//                     <p className="text-red-500 text-sm">{errors.password}</p>
//                   )}
//                 </div>
//               </CardContent>

//               <CardFooter className="flex flex-col space-y-4">
//                 <Button
//                   type="submit"
//                   className="w-full mt-6 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center">
//                       <svg
//                         className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Signing in...
//                     </div>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </Button>

//                 <div className="text-center text-sm text-gray-600">
//                   Don't have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/signup")}
//                     className="font-medium text-blue-600 hover:text-blue-500"
//                   >
//                     Sign up
//                   </button>
//                 </div>
//               </CardFooter>
//             </form>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Zap,
  Shield,
  TrendingUp,
  Lock,
  Mail,
  Package,
  ShoppingCart,
} from "lucide-react";

import bg_image from "@/assets/bg_image.avif";
import useUserStore from "@/store/UserStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { email, password } = formData;
      if (!email || !password) {
        setErrors({ form: "Please fill in all required fields." });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ form: data.message || "Invalid email or password" });
        return;
      }

      // Save auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      useUserStore.getState().setUser(data.user);

      navigate("/dashboard");
    } catch (error) {
      setErrors({
        form: "Server error, please try again later",
      });
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Image */}
      <div className="w-full md:w-1/2 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-orange-800/70 to-orange-700/70 z-10"></div>

        {/* Store image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg_image})`,
          }}
        ></div>

        {/* Content overlay */}
        <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg mr-3">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">BenStore</h1>
            </div>

            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-lg mb-6 text-orange-100">
              Sign in to access your store dashboard and continue managing your
              inventory.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-orange-500/20 mr-3 mt-1">
                  <Package className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Inventory Management
                  </h3>
                  <p className="text-orange-100">
                    Track your products and stock levels
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-orange-500/20 mr-3 mt-1">
                  <TrendingUp className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sales Analytics</h3>
                  <p className="text-orange-100">
                    Monitor sales performance and trends
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-orange-500/20 mr-3 mt-1">
                  <Shield className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-orange-100">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="w-full max-w-md">
          {/* Logo and Branding for mobile */}
          <div className="text-center md:hidden mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                <Package className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BenStore</h1>
            <p className="mt-2 text-gray-600">
              Your complete store management solution
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Login to Your Account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm text-center">
                      {errors.form}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    Sign up
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
