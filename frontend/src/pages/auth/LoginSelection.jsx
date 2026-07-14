import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import { Button } from "../../components/buttons";

const LoginSelection = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#151312] px-4 overflow-hidden">
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
          <h1 className="text-2xl font-bold text-[#FFF8F1] mb-2">
            Welcome to APL Perfect
          </h1>
          <p className="text-[#D5C7BA]">
            Select your login type
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to={ROUTES.AUTH.LOGIN}>
              <Button variant="primary" size="lg" className="w-full justify-start bg-[#A86A33] hover:bg-[#C47D3B] active:bg-[#8D5627] text-white focus:ring-[#A86A33]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#A86A33]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D18A45]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Admin Login</p>
                    <p className="text-sm opacity-75">Access admin dashboard</p>
                  </div>
                </div>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/auth/site-login">
              <Button variant="secondary" size="lg" className="w-full justify-start bg-[#26201D] hover:bg-[#302A26] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3A2B1E] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D18A45]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7V3l-4 4h3v8h2V7h3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Site Login</p>
                    <p className="text-sm opacity-75">Access site portal</p>
                  </div>
                </div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSelection;
