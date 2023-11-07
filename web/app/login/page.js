import SignInWithGithub from "../components/signinWithGithub";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-200 hero">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Log In</h2>
          <div className="card-actions justify-center py-4">
            <SignInWithGithub />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
