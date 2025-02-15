import React from "react";

const BackgroundImage: React.FC = () => {
  return (
    <img
      loading="lazy"
      src="/Dot Grid.svg"
      className="object-cover absolute inset-0 size-full"
      alt="Background"
    />
  );
};

const Bubble: React.FC<{ position: string }> = ({ position }) => {
  return (
    <div
      className={`absolute ${position} w-40 h-40 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-50`}
    ></div>
  );
};

const SignUpIllustration: React.FC = () => {
  return (
    <img
      loading="lazy"
      src="/Sign in and sign up Graphic.svg"
      className="object-contain w-48 mb-6"
      alt="Sign Up illustration"
    />
  );
};

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
}) => {
  return (
    <div className="box-border flex relative flex-col shrink-0 mt-6">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={label}
        className="px-6 py-3 w-full text-lg font-medium rounded-3xl bg-gray-100 shadow-md text-gray-700"
        aria-label={label}
      />
    </div>
  );
};

const SignUpForm: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-gray-800 rounded-xl shadow-lg w-[400px] relative">
      <SignUpIllustration />
      <div className="text-4xl font-bold mb-6 text-gray-900">Sign Up</div>
      <form className="flex flex-col gap-4 w-80">
        <InputField label="Username" id="signup-username" />
        <InputField label="Password" id="signup-password" type="password" />
        <InputField
          label="Confirm Password"
          id="signup-confirm-password"
          type="password"
        />
        <button className="px-6 py-3 text-lg font-semibold text-white bg-pink-400 rounded-3xl hover:bg-pink-500">
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-gray-700 text-sm">
        Already have an account?{" "}
        <a
          href="/signin"
          className="text-pink-500 font-semibold hover:underline"
        >
          Sign in
        </a>
      </div>
    </div>
  );
};

const SignUpPage: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
      <BackgroundImage />
      <Bubble position="top-0 right-0" />
      <Bubble position="bottom-0 left-0" />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
