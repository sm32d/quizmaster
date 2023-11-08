import SignInWithGithub from "../components/buttons/btnSigninWithGithub";
import SignInWithGoogle from "../components/buttons/btnSigninWithGoogle";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-200 hero">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Log In</h2>
          <div className="card-actions flex-col justify-center py-4">
            <SignInWithGoogle />
            <SignInWithGithub />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
