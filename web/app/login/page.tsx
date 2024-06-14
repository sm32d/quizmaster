import SignInWithFacebook from "../components/buttons/btnSigninWithFacebook";
import SignInWithGithub from "../components/buttons/btnSigninWithGithub";
import SignInWithGoogle from "../components/buttons/btnSigninWithGoogle";

const LoginPage = () => {
  return (
    <div className="min-h-[92svh] hero">
      <div className="card lg:card-side border border-dotted border-neutral shadow-xl">
        <div className="card-body items-center text-center md:px-11">
          <h2 className="card-title">Log In</h2>
          <div className="card-actions flex-col pt-4 pb-2">
            <SignInWithGoogle />
            <SignInWithGithub />
            <SignInWithFacebook />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
