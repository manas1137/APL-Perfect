import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Input, Button } from "../../components";
import { useSiteAuth } from "../../context/SiteAuthContext";

const SiteLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useSiteAuth();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#151312] px-4 py-8 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/overlay.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[rgba(8,8,10,0.55)] z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md bg-[#151312]/95 backdrop-blur-sm border border-[#3A2B1E] rounded-xl p-6 sm:p-8"
        style={{ boxShadow: "0 8px 32px rgba(140, 100, 40, 0.12)" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/auth" className="inline-block mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#D5C7BA] hover:text-[#D9954E] font-medium text-sm sm:text-base"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF8F1] mb-2">
            Site Login
          </h1>
          <p className="text-[#D5C7BA] text-sm sm:text-base px-4">
            Enter your site name and password
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <Input
            label="Site Name"
            labelClassName="text-[#D5C7BA]"
            placeholder="Enter your site name"
            error={errors.name?.message}
            className="bg-[#201B19] border-[#4B3A2A] text-white placeholder:text-[#907A67] focus:border-[#B87839] focus:ring-[#B87839]"
            {...register("name", {
              required: "Site name is required",
            })}
          />

          <Input
            label="Password"
            labelClassName="text-[#D5C7BA]"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            className="bg-[#201B19] border-[#4B3A2A] text-white placeholder:text-[#907A67] focus:border-[#B87839] focus:ring-[#B87839]"
            {...register("password", {
              required: "Password is required",
            })}
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#A86A33] hover:bg-[#C47D3B] active:bg-[#8D5627] text-white focus:ring-[#A86A33]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SiteLogin;
